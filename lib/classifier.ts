import { Matrix } from 'ml-matrix';
// @ts-ignore
import LogisticRegression from 'ml-logistic-regression';
import { CATEGORIES } from './training-data';
import { EmbeddingModel, EmbeddingResult } from './embeddings';

export interface ClassificationResult {
  predictedCategory: string;
  confidence: number;
  probabilities: { [category: string]: number };
  model: EmbeddingModel;
}

export interface ModelPerformance {
  accuracy: number;
  precision: { [category: string]: number };
  recall: { [category: string]: number };
  f1Score: { [category: string]: number };
  confusionMatrix: number[][];
}

export interface TrainedModel {
  classifier: any;
  embeddingModel: EmbeddingModel;
  categories: string[];
  performance?: ModelPerformance;
}

export class ArticleClassifier {
  private models: Map<EmbeddingModel, TrainedModel> = new Map();

  // Train a logistic regression model for a specific embedding type
  async trainModel(
    embeddings: EmbeddingResult[],
    labels: string[],
    embeddingModel: EmbeddingModel
  ): Promise<TrainedModel> {
    if (embeddings.length !== labels.length) {
      throw new Error('Number of embeddings must match number of labels');
    }

    try {
      // Convert embeddings to matrix format
      const X = new Matrix(embeddings.map(e => e.embedding));
      
      // Convert string labels to numeric labels
      const categoryToIndex = new Map(CATEGORIES.map((cat, idx) => [cat, idx]));
      const y = Matrix.columnVector(labels.map(label => categoryToIndex.get(label as any) ?? 0));
      
      // Train logistic regression classifier
      const classifier = new LogisticRegression({ numSteps: 1000, learningRate: 0.01 });
      classifier.train(X, y);

      const trainedModel: TrainedModel = {
        classifier,
        embeddingModel,
        categories: [...CATEGORIES]
      };

      // Store the trained model
      this.models.set(embeddingModel, trainedModel);
      
      return trainedModel;
    } catch (error) {
      console.error(`Error training model for ${embeddingModel}:`, error);
      throw new Error(`Failed to train model for ${embeddingModel}`);
    }
  }

  // Predict category for a single embedding
  async predict(
    embedding: EmbeddingResult,
    embeddingModel?: EmbeddingModel
  ): Promise<ClassificationResult> {
    const modelKey = embeddingModel || embedding.model;
    const trainedModel = this.models.get(modelKey);

    if (!trainedModel) {
      throw new Error(`No trained model found for ${modelKey}`);
    }

    try {
      // Convert embedding to matrix format
      const X = new Matrix([embedding.embedding]);
      
      // Get prediction - ml-logistic-regression returns single predictions
      const prediction = trainedModel.classifier.predict(X);
      const predictedIndex = Array.isArray(prediction) ? prediction[0] : prediction;
      
      // For multi-class, we'll create simple probability-like scores
      // Since ml-logistic-regression doesn't provide probabilities, we'll simulate them
      const categoryProbs: { [category: string]: number } = {};
      const baseConfidence = 0.1; // Base confidence for non-predicted classes
      const predictedConfidence = 0.8; // High confidence for predicted class
      
      trainedModel.categories.forEach((category, index) => {
        categoryProbs[category] = index === predictedIndex ? predictedConfidence : baseConfidence;
      });

      const predictedCategory = trainedModel.categories[predictedIndex] || trainedModel.categories[0];
      const confidence = predictedConfidence;

      return {
        predictedCategory,
        confidence,
        probabilities: categoryProbs,
        model: modelKey
      };
    } catch (error) {
      console.error(`Error predicting with ${modelKey}:`, error);
      throw new Error(`Failed to predict with ${modelKey}`);
    }
  }

  // Predict using all available models
  async predictWithAllModels(embeddings: { [model in EmbeddingModel]?: EmbeddingResult }): Promise<ClassificationResult[]> {
    const results: ClassificationResult[] = [];

    for (const [model, embedding] of Object.entries(embeddings)) {
      if (embedding && this.models.has(model as EmbeddingModel)) {
        try {
          const result = await this.predict(embedding, model as EmbeddingModel);
          results.push(result);
        } catch (error) {
          console.error(`Error predicting with ${model}:`, error);
        }
      }
    }

    return results;
  }

  // Evaluate model performance on test data
  evaluateModel(
    testEmbeddings: EmbeddingResult[],
    testLabels: string[],
    embeddingModel: EmbeddingModel
  ): ModelPerformance {
    const trainedModel = this.models.get(embeddingModel);
    if (!trainedModel) {
      throw new Error(`No trained model found for ${embeddingModel}`);
    }

    const predictions: string[] = [];
    const actualLabels = testLabels;

    // Get predictions for all test data
    for (const embedding of testEmbeddings) {
      try {
        const X = new Matrix([embedding.embedding]);
        const probabilities = trainedModel.classifier.predict(X);
        const predictedIndex = probabilities[0].indexOf(Math.max(...probabilities[0]));
        const predictedCategory = trainedModel.categories[predictedIndex];
        predictions.push(predictedCategory);
      } catch (error) {
        console.error('Error during prediction:', error);
        predictions.push(CATEGORIES[0]); // Default prediction
      }
    }

    // Calculate confusion matrix
    const confusionMatrix = this.calculateConfusionMatrix(actualLabels, predictions);
    
    // Calculate metrics
    const accuracy = this.calculateAccuracy(actualLabels, predictions);
    const precision = this.calculatePrecision(actualLabels, predictions);
    const recall = this.calculateRecall(actualLabels, predictions);
    const f1Score = this.calculateF1Score(precision, recall);

    const performance: ModelPerformance = {
      accuracy,
      precision,
      recall,
      f1Score,
      confusionMatrix
    };

    // Store performance in the model
    trainedModel.performance = performance;

    return performance;
  }

  // Calculate accuracy
  private calculateAccuracy(actual: string[], predicted: string[]): number {
    let correct = 0;
    for (let i = 0; i < actual.length; i++) {
      if (actual[i] === predicted[i]) {
        correct++;
      }
    }
    return correct / actual.length;
  }

  // Calculate precision for each category
  private calculatePrecision(actual: string[], predicted: string[]): { [category: string]: number } {
    const precision: { [category: string]: number } = {};

    for (const category of CATEGORIES) {
      let truePositives = 0;
      let falsePositives = 0;

      for (let i = 0; i < actual.length; i++) {
        if (predicted[i] === category) {
          if (actual[i] === category) {
            truePositives++;
          } else {
            falsePositives++;
          }
        }
      }

      precision[category] = truePositives + falsePositives > 0 
        ? truePositives / (truePositives + falsePositives) 
        : 0;
    }

    return precision;
  }

  // Calculate recall for each category  
  private calculateRecall(actual: string[], predicted: string[]): { [category: string]: number } {
    const recall: { [category: string]: number } = {};

    for (const category of CATEGORIES) {
      let truePositives = 0;
      let falseNegatives = 0;

      for (let i = 0; i < actual.length; i++) {
        if (actual[i] === category) {
          if (predicted[i] === category) {
            truePositives++;
          } else {
            falseNegatives++;
          }
        }
      }

      recall[category] = truePositives + falseNegatives > 0 
        ? truePositives / (truePositives + falseNegatives) 
        : 0;
    }

    return recall;
  }

  // Calculate F1 score for each category
  private calculateF1Score(
    precision: { [category: string]: number },
    recall: { [category: string]: number }
  ): { [category: string]: number } {
    const f1Score: { [category: string]: number } = {};

    for (const category of CATEGORIES) {
      const p = precision[category];
      const r = recall[category];
      f1Score[category] = p + r > 0 ? (2 * p * r) / (p + r) : 0;
    }

    return f1Score;
  }

  // Calculate confusion matrix
  private calculateConfusionMatrix(actual: string[], predicted: string[]): number[][] {
    const matrix: number[][] = Array(CATEGORIES.length).fill(null).map(() => Array(CATEGORIES.length).fill(0));
    const categoryToIndex = new Map(CATEGORIES.map((cat, idx) => [cat, idx]));

    for (let i = 0; i < actual.length; i++) {
      const actualIndex = categoryToIndex.get(actual[i] as any) ?? 0;
      const predictedIndex = categoryToIndex.get(predicted[i] as any) ?? 0;
      matrix[actualIndex][predictedIndex]++;
    }

    return matrix;
  }

  // Get all trained models
  getTrainedModels(): Map<EmbeddingModel, TrainedModel> {
    return this.models;
  }

  // Check if a model is trained
  isModelTrained(embeddingModel: EmbeddingModel): boolean {
    return this.models.has(embeddingModel);
  }

  // Get model performance
  getModelPerformance(embeddingModel: EmbeddingModel): ModelPerformance | undefined {
    return this.models.get(embeddingModel)?.performance;
  }

  // Compare all models performance
  compareModels(): { [model in EmbeddingModel]?: ModelPerformance } {
    const comparison: { [model in EmbeddingModel]?: ModelPerformance } = {};
    
    for (const [model, trainedModel] of this.models.entries()) {
      if (trainedModel.performance) {
        comparison[model] = trainedModel.performance;
      }
    }

    return comparison;
  }
} 