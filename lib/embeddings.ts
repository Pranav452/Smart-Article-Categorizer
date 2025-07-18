import { pipeline } from "@xenova/transformers";
import { google } from "@ai-sdk/google";
import { embed } from "ai";
import { dot, norm } from "mathjs";

// Cache pipelines to avoid reloading models
let sentenceBertEmbedder: any = null;
let bertEmbedder: any = null;

export type EmbeddingModel = 'sentence-bert' | 'bert' | 'word2vec-glove' | 'gemini';

export interface EmbeddingResult {
  embedding: number[];
  model: EmbeddingModel;
  dimensions: number;
}

// Cosine similarity function
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  const dotProduct = dot(vec1, vec2) as number;
  const normA = norm(vec1) as number;
  const normB = norm(vec2) as number;
  return dotProduct / (normA * normB);
}

// Sentence-BERT embeddings (existing implementation)
export async function generateSentenceBertEmbedding(text: string): Promise<number[]> {
  try {
    if (!sentenceBertEmbedder) {
      sentenceBertEmbedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }

    const output = await sentenceBertEmbedder(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
  } catch (error) {
    console.error("Error generating Sentence-BERT embedding:", error);
    throw new Error("Failed to generate Sentence-BERT embedding");
  }
}

// BERT [CLS] token embeddings
export async function generateBertEmbedding(text: string): Promise<number[]> {
  try {
    if (!bertEmbedder) {
      bertEmbedder = await pipeline("feature-extraction", "Xenova/bert-base-uncased");
    }

    const output = await bertEmbedder(text, { pooling: "cls", normalize: true });
    return Array.from(output.data);
  } catch (error) {
    console.error("Error generating BERT embedding:", error);
    throw new Error("Failed to generate BERT embedding");
  }
}

// Word2Vec/GloVe averaged embeddings (simplified implementation)
export async function generateWord2VecGloveEmbedding(text: string): Promise<number[]> {
  try {
    // For demonstration, we'll use a simple averaging approach with pre-trained embeddings
    // In a real implementation, you would load actual GloVe/Word2Vec vectors
    
    // Split text into words and clean them
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    
    // Generate pseudo-embeddings for demonstration (300 dimensions like GloVe)
    // In reality, you would look up each word in a pre-trained embedding dictionary
    const dimension = 300;
    const avgEmbedding = new Array(dimension).fill(0);
    
    for (const word of words) {
      // Simplified hash-based pseudo-embedding for demonstration
      const wordEmbedding = generatePseudoWordEmbedding(word, dimension);
      for (let i = 0; i < dimension; i++) {
        avgEmbedding[i] += wordEmbedding[i];
      }
    }
    
    // Average the embeddings
    if (words.length > 0) {
      for (let i = 0; i < dimension; i++) {
        avgEmbedding[i] /= words.length;
      }
    }
    
    // Normalize the vector
    const magnitude = Math.sqrt(avgEmbedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < dimension; i++) {
        avgEmbedding[i] /= magnitude;
      }
    }
    
    return avgEmbedding;
  } catch (error) {
    console.error("Error generating Word2Vec/GloVe embedding:", error);
    throw new Error("Failed to generate Word2Vec/GloVe embedding");
  }
}

// Helper function to generate pseudo word embeddings for demonstration
function generatePseudoWordEmbedding(word: string, dimension: number): number[] {
  const embedding = new Array(dimension);
  let hash = 0;
  
  // Simple hash function
  for (let i = 0; i < word.length; i++) {
    hash = ((hash << 5) - hash + word.charCodeAt(i)) & 0xffffffff;
  }
  
  // Generate consistent pseudo-random values based on the hash
  for (let i = 0; i < dimension; i++) {
    hash = ((hash * 1103515245 + 12345) & 0x7fffffff) % 2147483647;
    embedding[i] = (hash / 2147483647) * 2 - 1; // Normalize to [-1, 1]
  }
  
  return embedding;
}

// Gemini embeddings
export async function generateGeminiEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: google.embedding('text-embedding-004'),
      value: text,
    });
    
    return embedding;
  } catch (error) {
    console.error("Error generating Gemini embedding:", error);
    throw new Error("Failed to generate Gemini embedding");
  }
}

// Main function to generate embeddings with specified model
export async function generateEmbedding(text: string, model: EmbeddingModel = 'sentence-bert'): Promise<EmbeddingResult> {
  let embedding: number[];
  
  switch (model) {
    case 'sentence-bert':
      embedding = await generateSentenceBertEmbedding(text);
      break;
    case 'bert':
      embedding = await generateBertEmbedding(text);
      break;
    case 'word2vec-glove':
      embedding = await generateWord2VecGloveEmbedding(text);
      break;
    case 'gemini':
      embedding = await generateGeminiEmbedding(text);
      break;
    default:
      throw new Error(`Unsupported embedding model: ${model}`);
  }
  
  return {
    embedding,
    model,
    dimensions: embedding.length
  };
}

// Batch embedding generation
export async function generateBatchEmbeddings(
  texts: string[], 
  model: EmbeddingModel = 'sentence-bert'
): Promise<EmbeddingResult[]> {
  const results: EmbeddingResult[] = [];
  
  for (const text of texts) {
    const result = await generateEmbedding(text, model);
    results.push(result);
  }
  
  return results;
}
