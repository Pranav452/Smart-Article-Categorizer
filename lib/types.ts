export interface Document {
  id: string
  title: string
  content: string
  embedding?: number[]
  created_at: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface SearchResult {
  document: Document
  similarity: number
}
