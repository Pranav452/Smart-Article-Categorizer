'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Search,
  FileText,
  Upload,
  Clock,
  Target,
  BarChart3,
  Download,
  Zap,
  Scale,
  Shuffle,
  GitMerge
} from 'lucide-react';

interface SearchResult {
  document: {
    id: string;
    title: string;
    content: string;
    category: string;
    section?: string;
    keywords: string[];
    entities: string[];
  };
  score: number;
  method: string;
  explanation?: string;
}

interface SearchMetrics {
  precision: number;
  recall: number;
  diversityScore: number;
  executionTime: number;
}

interface MethodResults {
  results: SearchResult[];
  metrics: SearchMetrics;
}

interface SearchResponse {
  query: string;
  totalDocuments: number;
  results: Record<string, MethodResults>;
}

const SIMILARITY_METHODS = [
  {
    id: 'cosine',
    name: 'Cosine Similarity',
    icon: <Target className="w-4 h-4" />,
    description: 'Standard semantic matching using vector angles',
    color: 'bg-blue-500'
  },
  {
    id: 'euclidean',
    name: 'Euclidean Distance',
    icon: <Scale className="w-4 h-4" />,
    description: 'Geometric distance in embedding space',
    color: 'bg-green-500'
  },
  {
    id: 'mmr',
    name: 'MMR',
    icon: <Shuffle className="w-4 h-4" />,
    description: 'Maximal Marginal Relevance for diversity',
    color: 'bg-purple-500'
  },
  {
    id: 'hybrid',
    name: 'Hybrid Similarity',
    icon: <GitMerge className="w-4 h-4" />,
    description: '60% Cosine + 40% Legal Entity Match',
    color: 'bg-orange-500'
  }
];

const TEST_QUERIES = [
  "Income tax deduction for education",
  "GST rate for textile products",
  "Property registration process",
  "Court fee structure"
];

export default function LegalDocumentSearch() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentsInfo, setDocumentsInfo] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch documents info on component mount
  useEffect(() => {
    fetchDocumentsInfo();
  }, []);

  const fetchDocumentsInfo = async () => {
    try {
      const response = await fetch('/api/legal-search');
      const data = await response.json();
      setDocumentsInfo(data);
    } catch (error) {
      console.error('Error fetching documents info:', error);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/legal-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          methods: ['cosine', 'euclidean', 'mmr', 'hybrid']
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: SearchResponse = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching documents:', error);
      setError('Failed to search documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // TODO: Implement file processing
      console.log('File selected:', file.name);
    }
  };

  const useTestQuery = (testQuery: string) => {
    setQuery(testQuery);
  };

  const getMethodColor = (method: string) => {
    return SIMILARITY_METHODS.find(m => m.id === method)?.color || 'bg-gray-500';
  };

  const formatScore = (score: number) => {
    return (score * 100).toFixed(1) + '%';
  };

  const formatTime = (time: number) => {
    return time < 1000 ? `${time}ms` : `${(time / 1000).toFixed(2)}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <FileText className="w-8 h-8" />
          Indian Legal Document Search System
        </h1>
        <p className="text-gray-600">
          Compare 4 different similarity methods for legal document retrieval
        </p>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Interface
          </CardTitle>
          <CardDescription>
            Enter a query or upload a document to search through Indian legal documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text Query</TabsTrigger>
              <TabsTrigger value="upload">Document Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="query" className="text-sm font-medium">
                  Search Query
                </label>
                <Textarea
                  id="query"
                  placeholder="Enter your legal query here... (e.g., 'Income tax deduction for education')"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Test Queries</label>
                <div className="flex flex-wrap gap-2">
                  {TEST_QUERIES.map((testQuery, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => useTestQuery(testQuery)}
                      className="text-xs"
                    >
                      {testQuery}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload a legal document (PDF/Word)
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2">
            <Button 
              onClick={handleSearch} 
              disabled={isLoading || (!query.trim() && !selectedFile)}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Documents
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dataset Overview */}
      {documentsInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Dataset Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {documentsInfo.totalDocuments}
                </div>
                <div className="text-sm text-gray-600">Total Documents</div>
              </div>
              {documentsInfo.categories.map((category: string) => (
                <div key={category} className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {documentsInfo.documentsByCategory[category]?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">{category}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results - 4-Column Comparison */}
      {searchResults && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Search Results Comparison
              </CardTitle>
              <CardDescription>
                Query: "{searchResults.query}" | {searchResults.totalDocuments} documents searched
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Performance Metrics Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {SIMILARITY_METHODS.map((method) => {
                  const metrics = searchResults.results[method.id]?.metrics;
                  if (!metrics) return null;

                  return (
                    <div key={method.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${method.color}`} />
                        <span className="font-medium">{method.name}</span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Precision:</span>
                          <span>{formatScore(metrics.precision)}</span>
                        </div>
                        <Progress value={metrics.precision * 100} className="h-2" />
                        
                        <div className="flex justify-between">
                          <span>Recall:</span>
                          <span>{formatScore(metrics.recall)}</span>
                        </div>
                        <Progress value={metrics.recall * 100} className="h-2" />
                        
                        <div className="flex justify-between">
                          <span>Diversity:</span>
                          <span>{formatScore(metrics.diversityScore)}</span>
                        </div>
                        <Progress value={metrics.diversityScore * 100} className="h-2" />
                        
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Time:
                          </span>
                          <span>{formatTime(metrics.executionTime)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 4-Column Results Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SIMILARITY_METHODS.map((method) => {
              const methodResults = searchResults.results[method.id];
              if (!methodResults) return null;

              return (
                <Card key={method.id} className="h-fit">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {method.icon}
                      <span>{method.name}</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {method.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {methodResults.results.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No results found
                      </p>
                    ) : (
                      methodResults.results.map((result, index) => (
                        <div key={result.document.id} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="text-sm font-medium leading-tight">
                              {result.document.title}
                            </div>
                            <div className={`w-6 h-6 rounded-full ${method.color} flex items-center justify-center text-white text-xs font-bold`}>
                              {index + 1}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {result.document.category}
                            </Badge>
                            {result.document.section && (
                              <Badge variant="outline" className="text-xs">
                                {result.document.section}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-600 line-clamp-3">
                            {result.document.content.substring(0, 120)}...
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-green-600">
                              Score: {formatScore(result.score)}
                            </span>
                          </div>
                          
                          {result.explanation && (
                            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                              {result.explanation}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Analysis and Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Best Performing Method</h4>
                    <p className="text-sm text-gray-600">
                      Based on current search metrics, analyze which method performs best for this query type.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use Cosine Similarity for general semantic matching</li>
                      <li>• Use MMR when diversity in results is important</li>
                      <li>• Use Hybrid for legal-specific entity matching</li>
                      <li>• Use Euclidean for precise distance-based matching</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Detailed Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 