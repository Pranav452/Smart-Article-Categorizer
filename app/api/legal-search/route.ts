import { NextRequest, NextResponse } from 'next/server';
import { LEGAL_DOCUMENTS } from '../../../lib/legal-documents';
import { searchDocuments, SimilarityMethod } from '../../../lib/similarity-methods';

export async function POST(request: NextRequest) {
  try {
    const { query, methods } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Default to all methods if none specified
    const searchMethods: SimilarityMethod[] = methods || ['cosine', 'euclidean', 'mmr', 'hybrid'];

    // Execute searches for all requested methods in parallel
    const searchPromises = searchMethods.map(async (method) => {
      const result = await searchDocuments(query, LEGAL_DOCUMENTS, method, 5);
      return {
        method,
        ...result
      };
    });

    const searchResults = await Promise.all(searchPromises);

    // Prepare response with results for each method
    const response = {
      query,
      totalDocuments: LEGAL_DOCUMENTS.length,
      results: searchResults.reduce((acc, result) => {
        acc[result.method] = {
          results: result.results,
          metrics: result.metrics
        };
        return acc;
      }, {} as Record<SimilarityMethod, any>)
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in legal document search:', error);
    return NextResponse.json(
      { error: 'Failed to search legal documents' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return available documents and categories for reference
    const documentsByCategory = LEGAL_DOCUMENTS.reduce((acc, doc) => {
      if (!acc[doc.category]) {
        acc[doc.category] = [];
      }
      acc[doc.category].push({
        id: doc.id,
        title: doc.title,
        section: doc.section
      });
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({
      totalDocuments: LEGAL_DOCUMENTS.length,
      categories: Object.keys(documentsByCategory),
      documentsByCategory,
      availableMethods: ['cosine', 'euclidean', 'mmr', 'hybrid']
    });

  } catch (error) {
    console.error('Error fetching legal documents info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legal documents info' },
      { status: 500 }
    );
  }
} 