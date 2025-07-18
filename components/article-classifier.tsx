"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Brain, BarChart3, Target, Play, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface PredictionResult {
  model: string;
  predictedCategory: string;
  confidence: number;
  probabilities: { [category: string]: number };
  embeddingDimensions: number;
  trained: boolean;
  error?: string;
}

interface ModelStatus {
  model: string;
  trained: boolean;
  performance?: {
    accuracy: number;
    avgPrecision: number;
    avgRecall: number;
    avgF1Score: number;
  };
}

interface TrainingResult {
  success: boolean;
  model: string;
  performance: {
    accuracy: number;
    precision: { [category: string]: number };
    recall: { [category: string]: number };
    f1Score: { [category: string]: number };
    confusionMatrix: number[][];
  };
  trainingSize: number;
  testSize: number;
  embeddingDimensions: number;
  categories: string[];
}

const SAMPLE_ARTICLES = [
  {
    title: "Breaking: Revolutionary AI Chip Achieves Human-Level Performance",
    content: "Scientists at leading tech companies have developed a new artificial intelligence processor that demonstrates human-level cognitive abilities across multiple domains. The breakthrough chip uses novel neural architecture and advanced machine learning algorithms to process information with unprecedented efficiency. This development could revolutionize computing and enable new applications in robotics, autonomous vehicles, and intelligent systems."
  },
  {
    title: "Stock Market Surges Following Federal Reserve Interest Rate Decision", 
    content: "Global financial markets experienced significant gains today after the Federal Reserve announced its decision to maintain current interest rates. The S&P 500 climbed 2.5% while international indices showed similar positive momentum. Investors responded favorably to the central bank's dovish stance and commitment to supporting economic growth. Trading volumes reached record highs as institutional and retail investors increased their market exposure."
  },
  {
    title: "Medical Breakthrough: New Gene Therapy Restores Vision in Blind Patients",
    content: "A groundbreaking clinical trial has successfully restored vision in patients with inherited blindness using advanced gene therapy techniques. The treatment involves introducing functional genes into retinal cells using a modified virus vector. Patients who received the therapy showed remarkable improvement in visual acuity and light sensitivity. The results offer hope for millions of people worldwide suffering from genetic eye diseases."
  }
];

export function ArticleClassifier() {
  const [articleText, setArticleText] = useState("");
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [consensus, setConsensus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<ModelStatus[]>([]);
  const [isTraining, setIsTraining] = useState<{ [model: string]: boolean }>({});
  const [trainingResults, setTrainingResults] = useState<{ [model: string]: TrainingResult }>({});

  // Load model status on component mount
  useEffect(() => {
    loadModelStatus();
  }, []);

  const loadModelStatus = async () => {
    try {
      const response = await fetch('/api/classification/predict');
      const data = await response.json();
      if (data.success) {
        setModelStatus(data.modelStatus);
      }
    } catch (error) {
      console.error('Error loading model status:', error);
    }
  };

  const trainModel = async (model: string) => {
    setIsTraining(prev => ({ ...prev, [model]: true }));
    try {
      const response = await fetch('/api/classification/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeddingModel: model, testSplit: 0.2 })
      });

      const result = await response.json();
      
      if (result.success) {
        setTrainingResults(prev => ({ ...prev, [model]: result }));
        await loadModelStatus(); // Refresh model status
        toast.success(`${model} model trained successfully! Accuracy: ${result.performance.accuracy}%`);
      } else {
        toast.error(`Failed to train ${model} model: ${result.error}`);
      }
    } catch (error) {
      console.error(`Error training ${model} model:`, error);
      toast.error(`Error training ${model} model`);
    } finally {
      setIsTraining(prev => ({ ...prev, [model]: false }));
    }
  };

  const classifyArticle = async () => {
    if (!articleText.trim()) {
      toast.error("Please enter some article text to classify");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/classification/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: articleText })
      });

      const result = await response.json();
      
      if (result.success) {
        setPredictions(result.predictions);
        setConsensus(result.consensus);
        toast.success("Article classified successfully!");
      } else {
        toast.error(`Classification failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error classifying article:', error);
      toast.error("Error classifying article");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleArticle = (sample: any) => {
    setArticleText(`${sample.title}\n\n${sample.content}`);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Tech': 'bg-blue-100 text-blue-800',
      'Finance': 'bg-green-100 text-green-800', 
      'Healthcare': 'bg-red-100 text-red-800',
      'Sports': 'bg-orange-100 text-orange-800',
      'Politics': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const trainedModelCount = modelStatus.filter(m => m.trained).length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Smart Article Categorizer</h1>
        <p className="text-muted-foreground">
          Classify articles using 4 different embedding approaches: BERT, Sentence-BERT, Word2Vec/GloVe, and Gemini
        </p>
      </div>

      <Tabs defaultValue="classifier" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="classifier">Article Classifier</TabsTrigger>
          <TabsTrigger value="training">Model Training</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
        </TabsList>

        {/* Classifier Tab */}
        <TabsContent value="classifier" className="space-y-6">
          {/* Model Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Model Status ({trainedModelCount}/4 trained)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {modelStatus.map((model) => (
                  <div key={model.model} className="text-center">
                    <Badge 
                      variant={model.trained ? "default" : "secondary"}
                      className="w-full justify-center"
                    >
                      {model.model}
                    </Badge>
                    <div className="text-sm text-muted-foreground mt-1">
                      {model.trained ? "✓ Trained" : "⚠ Not Trained"}
                    </div>
                    {model.performance && (
                      <div className="text-xs text-muted-foreground">
                        {model.performance.accuracy}% accuracy
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sample Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {SAMPLE_ARTICLES.map((sample, index) => (
                  <div key={index} className="p-3 border rounded cursor-pointer hover:bg-accent"
                       onClick={() => loadSampleArticle(sample)}>
                    <h4 className="font-medium text-sm mb-2">{sample.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {sample.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Article Input */}
          <Card>
            <CardHeader>
              <CardTitle>Article Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter article title and content here..."
                value={articleText}
                onChange={(e) => setArticleText(e.target.value)}
                rows={8}
                className="min-h-[200px]"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={classifyArticle} 
                  disabled={isLoading || trainedModelCount === 0}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Classify Article
                </Button>
                <Button variant="outline" onClick={() => setArticleText("")}>
                  Clear
                </Button>
              </div>
              {trainedModelCount === 0 && (
                <Alert>
                  <AlertDescription>
                    No models are trained yet. Please train at least one model in the "Model Training" tab.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Consensus Results */}
          {consensus && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Consensus Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Badge className={getCategoryColor(consensus.category)}>
                    {consensus.category}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {consensus.votes}/{consensus.totalModels} models agree 
                    ({consensus.agreement}% agreement)
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg Confidence: {consensus.avgConfidence}%
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Individual Model Predictions */}
          {predictions.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4">
              {predictions.map((prediction) => (
                <Card key={prediction.model}>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">{prediction.model}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {prediction.error ? (
                      <Alert>
                        <AlertDescription>{prediction.error}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(prediction.predictedCategory)}>
                            {prediction.predictedCategory}
                          </Badge>
                          <span className="text-sm font-medium">
                            {prediction.confidence}% confidence
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Category Probabilities:</div>
                          {Object.entries(prediction.probabilities).map(([category, prob]) => (
                            <div key={category} className="flex items-center gap-2">
                              <span className="text-sm w-20">{category}:</span>
                              <Progress value={prob} className="flex-1" />
                              <span className="text-sm w-12">{prob}%</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          Embedding dimensions: {prediction.embeddingDimensions}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Train Classification Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {['sentence-bert', 'bert', 'word2vec-glove', 'gemini'].map((model) => {
                  const status = modelStatus.find(m => m.model === model);
                  const training = isTraining[model];
                  const result = trainingResults[model];
                  
                  return (
                    <Card key={model}>
                      <CardHeader>
                        <CardTitle className="capitalize text-lg">{model}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={status?.trained ? "default" : "secondary"}>
                            {status?.trained ? "Trained" : "Not Trained"}
                          </Badge>
                          {status?.performance && (
                            <span className="text-sm text-muted-foreground">
                              {status.performance.accuracy}% accuracy
                            </span>
                          )}
                        </div>
                        
                        <Button
                          onClick={() => trainModel(model)}
                          disabled={training}
                          className="w-full"
                          variant={status?.trained ? "outline" : "default"}
                        >
                          {training ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Training...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              {status?.trained ? "Retrain" : "Train"} Model
                            </>
                          )}
                        </Button>
                        
                        {result && (
                          <div className="text-sm space-y-1">
                            <div>Accuracy: {result.performance.accuracy}%</div>
                            <div>Training Size: {result.trainingSize}</div>
                            <div>Test Size: {result.testSize}</div>
                            <div>Dimensions: {result.embeddingDimensions}</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Model Performance Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(trainingResults).length > 0 ? (
                <div className="space-y-6">
                  {/* Performance Summary Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Model</th>
                          <th className="text-left p-2">Accuracy</th>
                          <th className="text-left p-2">Avg Precision</th>
                          <th className="text-left p-2">Avg Recall</th>
                          <th className="text-left p-2">Avg F1 Score</th>
                          <th className="text-left p-2">Dimensions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(trainingResults).map(([model, result]) => {
                          const avgPrecision = Object.values(result.performance.precision).reduce((a, b) => a + b, 0) / Object.values(result.performance.precision).length;
                          const avgRecall = Object.values(result.performance.recall).reduce((a, b) => a + b, 0) / Object.values(result.performance.recall).length;
                          const avgF1 = Object.values(result.performance.f1Score).reduce((a, b) => a + b, 0) / Object.values(result.performance.f1Score).length;
                          
                          return (
                            <tr key={model} className="border-b">
                              <td className="p-2 capitalize font-medium">{model}</td>
                              <td className="p-2">{result.performance.accuracy}%</td>
                              <td className="p-2">{avgPrecision.toFixed(2)}%</td>
                              <td className="p-2">{avgRecall.toFixed(2)}%</td>
                              <td className="p-2">{avgF1.toFixed(2)}%</td>
                              <td className="p-2">{result.embeddingDimensions}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Category-wise Performance */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Category-wise Performance</h3>
                    {['Tech', 'Finance', 'Healthcare', 'Sports', 'Politics', 'Entertainment'].map((category) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium">{category}</h4>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          {Object.entries(trainingResults).map(([model, result]) => (
                            <div key={model} className="space-y-1">
                              <div className="capitalize font-medium">{model}</div>
                              <div>Precision: {result.performance.precision[category] || 0}%</div>
                              <div>Recall: {result.performance.recall[category] || 0}%</div>
                              <div>F1: {result.performance.f1Score[category] || 0}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    No performance data available. Please train some models first.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 