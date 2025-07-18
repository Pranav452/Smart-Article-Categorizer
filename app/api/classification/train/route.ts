import { NextResponse } from "next/server";
import { trainingData, CATEGORIES } from "@/lib/training-data";
import { generateBatchEmbeddings, EmbeddingModel } from "@/lib/embeddings";
import { ArticleClassifier } from "@/lib/classifier";

// Global classifier instance (in production, you'd use a more persistent solution)
const classifier = new ArticleClassifier();

export async function POST(req: Request) {
  try {
    const { embeddingModel, testSplit = 0.2 } = await req.json();

    if (!embeddingModel || !['sentence-bert', 'bert', 'word2vec-glove', 'gemini'].includes(embeddingModel)) {
      return NextResponse.json(
        { error: "Invalid embedding model. Must be one of: sentence-bert, bert, word2vec-glove, gemini" },
        { status: 400 }
      );
    }

    console.log(`Training model with ${embeddingModel} embeddings...`);

    // Shuffle and split data
    const shuffledData = [...trainingData].sort(() => 0.5 - Math.random());
    const splitIndex = Math.floor(shuffledData.length * (1 - testSplit));
    const trainData = shuffledData.slice(0, splitIndex);
    const testData = shuffledData.slice(splitIndex);

    // Generate embeddings for training data
    console.log("Generating training embeddings...");
    const trainTexts = trainData.map(article => `${article.title} ${article.content}`);
    const trainLabels = trainData.map(article => article.category);
    const trainEmbeddings = await generateBatchEmbeddings(trainTexts, embeddingModel as EmbeddingModel);

    // Train the model
    console.log("Training classifier...");
    const trainedModel = await classifier.trainModel(trainEmbeddings, trainLabels, embeddingModel as EmbeddingModel);

    // Generate embeddings for test data
    console.log("Generating test embeddings...");
    const testTexts = testData.map(article => `${article.title} ${article.content}`);
    const testLabels = testData.map(article => article.category);
    const testEmbeddings = await generateBatchEmbeddings(testTexts, embeddingModel as EmbeddingModel);

    // Evaluate the model
    console.log("Evaluating model...");
    const performance = classifier.evaluateModel(testEmbeddings, testLabels, embeddingModel as EmbeddingModel);

    return NextResponse.json({
      success: true,
      model: embeddingModel,
      trainingSize: trainData.length,
      testSize: testData.length,
      embeddingDimensions: trainEmbeddings[0]?.dimensions || 0,
      performance: {
        accuracy: Math.round(performance.accuracy * 10000) / 100, // Convert to percentage with 2 decimal places
        precision: Object.fromEntries(
          Object.entries(performance.precision).map(([cat, val]) => [cat, Math.round(val * 10000) / 100])
        ),
        recall: Object.fromEntries(
          Object.entries(performance.recall).map(([cat, val]) => [cat, Math.round(val * 10000) / 100])
        ),
        f1Score: Object.fromEntries(
          Object.entries(performance.f1Score).map(([cat, val]) => [cat, Math.round(val * 10000) / 100])
        ),
        confusionMatrix: performance.confusionMatrix
      },
      categories: CATEGORIES
    });

  } catch (error) {
    console.error("Error training model:", error);
    return NextResponse.json(
      { error: "Failed to train model: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return status of trained models
    const trainedModels = classifier.getTrainedModels();
    const modelStatus: { [key: string]: any } = {};

    for (const [model, trainedModel] of trainedModels.entries()) {
      modelStatus[model] = {
        trained: true,
        categories: trainedModel.categories,
        performance: trainedModel.performance ? {
          accuracy: Math.round(trainedModel.performance.accuracy * 10000) / 100,
          avgPrecision: Math.round(
            Object.values(trainedModel.performance.precision).reduce((a, b) => a + b, 0) / 
            Object.values(trainedModel.performance.precision).length * 10000
          ) / 100,
          avgRecall: Math.round(
            Object.values(trainedModel.performance.recall).reduce((a, b) => a + b, 0) / 
            Object.values(trainedModel.performance.recall).length * 10000
          ) / 100,
          avgF1Score: Math.round(
            Object.values(trainedModel.performance.f1Score).reduce((a, b) => a + b, 0) / 
            Object.values(trainedModel.performance.f1Score).length * 10000
          ) / 100
        } : null
      };
    }

    return NextResponse.json({
      success: true,
      availableModels: ['sentence-bert', 'bert', 'word2vec-glove', 'gemini'],
      trainedModels: modelStatus,
      trainingDataSize: trainingData.length,
      categories: CATEGORIES
    });

  } catch (error) {
    console.error("Error getting model status:", error);
    return NextResponse.json(
      { error: "Failed to get model status" },
      { status: 500 }
    );
  }
}

// Export the classifier instance for use in other API routes
export { classifier }; 