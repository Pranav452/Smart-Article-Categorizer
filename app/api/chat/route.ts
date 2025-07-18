import { streamText } from "ai"
import { google } from "@ai-sdk/google"
import { createClient } from "@supabase/supabase-js"
import { generateEmbedding } from "@/lib/embeddings"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]

    // Generate embedding for the user's question
    const queryEmbedding = await generateEmbedding(lastMessage.content)

    // Search for similar documents in Supabase
    const { data: documents, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 5,
    })

    if (error) {
      console.error("Error searching documents:", error)
      throw new Error("Failed to search documents")
    }

    // Prepare context from retrieved documents
    const context =
      documents?.map((doc: any) => `Title: ${doc.title}\nContent: ${doc.content}`).join("\n\n---\n\n") ||
      "No relevant documents found."

    // Create the system prompt with context
    const systemPrompt = `You are a helpful AI assistant that answers questions based on the provided context. 
    Use the following documents to answer the user's question. If the answer cannot be found in the context, 
    say so clearly and offer to help with something else.

    Context:
    ${context}
    
    Instructions:
    - Answer based primarily on the provided context
    - Be concise but comprehensive
    - If information is not in the context, acknowledge this
    - Cite relevant document titles when possible`

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      system: systemPrompt,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
