// Similarity Methods for Legal Document Search System
import { LegalDocument } from './legal-documents';
import { generateEmbedding } from './embeddings';

export interface SearchResult {
  document: LegalDocument;
  score: number;
  method: SimilarityMethod;
  explanation?: string;
}

export type SimilarityMethod = 'cosine' | 'euclidean' | 'mmr' | 'hybrid';

export interface SearchMetrics {
  precision: number;
  recall: number;
  diversityScore: number;
  executionTime: number;
}

// Cosine Similarity Implementation
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Euclidean Distance Implementation (converted to similarity score)
export function euclideanSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let sumSquaredDiff = 0;
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sumSquaredDiff += diff * diff;
  }

  const distance = Math.sqrt(sumSquaredDiff);
  // Convert distance to similarity (higher is better)
  // Using 1 / (1 + distance) to normalize between 0 and 1
  return 1 / (1 + distance);
}

// Legal Entity Matching for Hybrid Similarity
export function legalEntityMatch(queryText: string, document: LegalDocument): number {
  const queryLower = queryText.toLowerCase();
  let matches = 0;
  let totalEntities = document.entities.length;

  // Check for entity matches
  for (const entity of document.entities) {
    if (queryLower.includes(entity.toLowerCase())) {
      matches++;
    }
  }

  // Check for keyword matches
  for (const keyword of document.keywords) {
    if (queryLower.includes(keyword.toLowerCase())) {
      matches += 0.5; // Keywords have half weight compared to entities
    }
  }

  // Check for section matches
  if (document.section && queryLower.includes(document.section.toLowerCase())) {
    matches += 1;
  }

  return totalEntities > 0 ? matches / (totalEntities + document.keywords.length * 0.5 + 1) : 0;
}

// Hybrid Similarity: 0.6 × Cosine + 0.4 × Legal Entity Match
export function hybridSimilarity(
  queryEmbedding: number[],
  docEmbedding: number[],
  queryText: string,
  document: LegalDocument
): number {
  const cosineScore = cosineSimilarity(queryEmbedding, docEmbedding);
  const entityScore = legalEntityMatch(queryText, document);
  
  return 0.6 * cosineScore + 0.4 * entityScore;
}

// Maximal Marginal Relevance (MMR) Implementation
export function calculateMMR(
  candidates: SearchResult[],
  selectedDocs: LegalDocument[],
  lambda: number = 0.7 // Balance between relevance and diversity
): SearchResult[] {
  if (candidates.length === 0) return [];

  const results: SearchResult[] = [];
  const availableCandidates = [...candidates];

  // Select the most relevant document first
  const firstDoc = availableCandidates.reduce((best, current) => 
    current.score > best.score ? current : best
  );
  results.push(firstDoc);
  availableCandidates.splice(availableCandidates.indexOf(firstDoc), 1);

  // Select remaining documents balancing relevance and diversity
  while (availableCandidates.length > 0 && results.length < 5) {
    let bestCandidate: SearchResult | null = null;
    let bestMMRScore = -1;

    for (const candidate of availableCandidates) {
      // Calculate max similarity to already selected documents
      let maxSimilarity = 0;
      for (const selected of results) {
        const similarity = calculateDocumentSimilarity(candidate.document, selected.document);
        maxSimilarity = Math.max(maxSimilarity, similarity);
      }

      // MMR Score = λ × Relevance - (1-λ) × MaxSimilarity
      const mmrScore = lambda * candidate.score - (1 - lambda) * maxSimilarity;

      if (mmrScore > bestMMRScore) {
        bestMMRScore = mmrScore;
        bestCandidate = candidate;
      }
    }

    if (bestCandidate) {
      results.push({
        ...bestCandidate,
        score: bestMMRScore,
        explanation: `MMR Score: ${bestMMRScore.toFixed(3)} (Relevance: ${bestCandidate.score.toFixed(3)})`
      });
      availableCandidates.splice(availableCandidates.indexOf(bestCandidate), 1);
    } else {
      break;
    }
  }

  return results;
}

// Calculate document-to-document similarity for MMR
function calculateDocumentSimilarity(doc1: LegalDocument, doc2: LegalDocument): number {
  // Simple similarity based on category, keywords, and entities
  let similarity = 0;

  // Category match
  if (doc1.category === doc2.category) {
    similarity += 0.3;
  }

  // Keyword overlap
  const commonKeywords = doc1.keywords.filter(k => doc2.keywords.includes(k));
  similarity += (commonKeywords.length / Math.max(doc1.keywords.length, doc2.keywords.length)) * 0.4;

  // Entity overlap
  const commonEntities = doc1.entities.filter(e => doc2.entities.includes(e));
  similarity += (commonEntities.length / Math.max(doc1.entities.length, doc2.entities.length)) * 0.3;

  return similarity;
}

// Main search function that applies all similarity methods
export async function searchDocuments(
  query: string,
  documents: LegalDocument[],
  method: SimilarityMethod,
  topK: number = 5
): Promise<{ results: SearchResult[]; metrics: SearchMetrics }> {
  const startTime = Date.now();
  
  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query, 'sentence-bert');
  
  // Calculate scores for all documents
  const scoredResults: SearchResult[] = [];
  
  for (const document of documents) {
    // Generate document embedding
    const docText = `${document.title} ${document.content}`;
    const docEmbedding = await generateEmbedding(docText, 'sentence-bert');
    
    let score = 0;
    let explanation = '';
    
    switch (method) {
      case 'cosine':
        score = cosineSimilarity(queryEmbedding.embedding, docEmbedding.embedding);
        explanation = `Cosine similarity: ${score.toFixed(3)}`;
        break;
        
      case 'euclidean':
        score = euclideanSimilarity(queryEmbedding.embedding, docEmbedding.embedding);
        explanation = `Euclidean similarity: ${score.toFixed(3)}`;
        break;
        
      case 'hybrid':
        score = hybridSimilarity(
          queryEmbedding.embedding,
          docEmbedding.embedding,
          query,
          document
        );
        const cosineScore = cosineSimilarity(queryEmbedding.embedding, docEmbedding.embedding);
        const entityScore = legalEntityMatch(query, document);
        explanation = `Hybrid: ${score.toFixed(3)} (Cosine: ${cosineScore.toFixed(3)}, Entity: ${entityScore.toFixed(3)})`;
        break;
        
      case 'mmr':
        // For MMR, we'll use cosine as the base relevance score
        score = cosineSimilarity(queryEmbedding.embedding, docEmbedding.embedding);
        explanation = `Base relevance: ${score.toFixed(3)}`;
        break;
    }
    
    scoredResults.push({
      document,
      score,
      method,
      explanation
    });
  }
  
  // Sort by score (descending)
  scoredResults.sort((a, b) => b.score - a.score);
  
  let finalResults: SearchResult[];
  
  if (method === 'mmr') {
    // Apply MMR algorithm
    finalResults = calculateMMR(scoredResults, []);
  } else {
    // Take top K results
    finalResults = scoredResults.slice(0, topK);
  }
  
  const executionTime = Date.now() - startTime;
  
  // Calculate metrics (simplified for demo)
  const metrics: SearchMetrics = {
    precision: calculatePrecision(finalResults, query),
    recall: calculateRecall(finalResults, documents, query),
    diversityScore: calculateDiversityScore(finalResults),
    executionTime
  };
  
  return { results: finalResults, metrics };
}

// Calculate precision (relevant docs in top 5 results)
function calculatePrecision(results: SearchResult[], query: string): number {
  // Simple precision based on category relevance and keyword matching
  let relevantCount = 0;
  
  for (const result of results) {
    const queryLower = query.toLowerCase();
    const isRelevant = 
      result.document.keywords.some(k => queryLower.includes(k.toLowerCase())) ||
      result.document.entities.some(e => queryLower.includes(e.toLowerCase())) ||
      result.document.content.toLowerCase().includes(queryLower);
    
    if (isRelevant) relevantCount++;
  }
  
  return results.length > 0 ? relevantCount / results.length : 0;
}

// Calculate recall (coverage of relevant documents)
function calculateRecall(results: SearchResult[], allDocs: LegalDocument[], query: string): number {
  const queryLower = query.toLowerCase();
  
  // Find all potentially relevant documents
  const relevantDocs = allDocs.filter(doc =>
    doc.keywords.some(k => queryLower.includes(k.toLowerCase())) ||
    doc.entities.some(e => queryLower.includes(e.toLowerCase())) ||
    doc.content.toLowerCase().includes(queryLower)
  );
  
  if (relevantDocs.length === 0) return 1; // No relevant docs exist
  
  // Count how many relevant docs are in results
  const foundRelevant = results.filter(result =>
    relevantDocs.some(relevant => relevant.id === result.document.id)
  );
  
  return foundRelevant.length / relevantDocs.length;
}

// Calculate diversity score (for MMR evaluation)
function calculateDiversityScore(results: SearchResult[]): number {
  if (results.length <= 1) return 1;
  
  let totalSimilarity = 0;
  let pairCount = 0;
  
  for (let i = 0; i < results.length; i++) {
    for (let j = i + 1; j < results.length; j++) {
      const similarity = calculateDocumentSimilarity(
        results[i].document,
        results[j].document
      );
      totalSimilarity += similarity;
      pairCount++;
    }
  }
  
  const avgSimilarity = pairCount > 0 ? totalSimilarity / pairCount : 0;
  return 1 - avgSimilarity; // Higher diversity = lower average similarity
} 