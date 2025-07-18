import { NextResponse } from "next/server";
import { generateEmbedding, EmbeddingModel } from "@/lib/embeddings";
import { classifier } from "../train/route";

export async function POST(req: Request) {
  try {
    const { text, models } = await req.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Default to all available models if none specified
    const requestedModels: EmbeddingModel[] = models && Array.isArray(models) 
      ? models.filter((m: string) => ['sentence-bert', 'bert', 'word2vec-glove', 'gemini'].includes(m))
      : ['sentence-bert', 'bert', 'word2vec-glove', 'gemini'];

    const predictions: any[] = [];
    const embeddings: { [model in EmbeddingModel]?: any } = {};

    // Generate embeddings and predictions for each requested model
    for (const model of requestedModels) {
      try {
        // Check if model is trained
        if (!classifier.isModelTrained(model)) {
          predictions.push({
            model,
            error: `Model ${model} is not trained. Please train the model first.`,
            trained: false
          });
          continue;
        }

        // Generate embedding
        console.log(`Generating ${model} embedding...`);
        const embeddingResult = await generateEmbedding(text, model);
        embeddings[model] = embeddingResult;

        // Make prediction
        console.log(`Making prediction with ${model}...`);
        const prediction = await classifier.predict(embeddingResult, model);

        predictions.push({
          model,
          predictedCategory: prediction.predictedCategory,
          confidence: Math.round(prediction.confidence * 10000) / 100, // Convert to percentage
          probabilities: Object.fromEntries(
            Object.entries(prediction.probabilities).map(([cat, prob]) => [cat, Math.round(prob * 10000) / 100])
          ),
          embeddingDimensions: embeddingResult.dimensions,
          trained: true
        });

      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        predictions.push({
          model,
          error: `Failed to generate prediction: ${(error as Error).message}`,
          trained: classifier.isModelTrained(model)
        });
      }
    }

    // Calculate consensus prediction if multiple models were used
    let consensus = null;
    const trainedPredictions = predictions.filter(p => p.trained && !p.error);
    
    if (trainedPredictions.length > 1) {
      // Simple voting mechanism
      const votes: { [category: string]: number } = {};
      let totalConfidence = 0;

      trainedPredictions.forEach(pred => {
        votes[pred.predictedCategory] = (votes[pred.predictedCategory] || 0) + 1;
        totalConfidence += pred.confidence;
      });

      const maxVotes = Math.max(...Object.values(votes));
      const consensusCategory = Object.keys(votes).find(cat => votes[cat] === maxVotes);
      
      consensus = {
        category: consensusCategory,
        votes: maxVotes,
        totalModels: trainedPredictions.length,
        agreement: Math.round((maxVotes / trainedPredictions.length) * 10000) / 100,
        avgConfidence: Math.round((totalConfidence / trainedPredictions.length) * 100) / 100
      };
    }

    return NextResponse.json({
      success: true,
      text: text.substring(0, 200) + (text.length > 200 ? '...' : ''), // Truncate for response
      predictions,
      consensus,
      modelsRequested: requestedModels,
      modelsProcessed: predictions.length,
      trainedModels: predictions.filter(p => p.trained && !p.error).length
    });

  } catch (error) {
    console.error("Error making prediction:", error);
    return NextResponse.json(
      { error: "Failed to make prediction: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return available models and their training status
    const trainedModels = classifier.getTrainedModels();
    const availableModels = ['sentence-bert', 'bert', 'word2vec-glove', 'gemini'];
    
    const modelStatus = availableModels.map(model => ({
      model,
      trained: classifier.isModelTrained(model as EmbeddingModel),
      performance: classifier.getModelPerformance(model as EmbeddingModel)
    }));

    return NextResponse.json({
      success: true,
      availableModels,
      modelStatus,
      totalTrained: Array.from(trainedModels.keys()).length,
      usage: {
        endpoint: "/api/classification/predict",
        method: "POST",
        body: {
          text: "Article text to classify",
          models: ["sentence-bert", "bert", "word2vec-glove", "gemini"] // optional
        }
      }
    });

  } catch (error) {
    console.error("Error getting prediction info:", error);
    return NextResponse.json(
      { error: "Failed to get prediction info" },
      { status: 500 }
    );
  }
} 