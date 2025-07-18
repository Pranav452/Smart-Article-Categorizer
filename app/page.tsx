import { ChatInterface } from "@/components/chat-interface"
import { DocumentUpload } from "@/components/document-upload"
import { ArticleClassifier } from "@/components/article-classifier"
import LegalDocumentSearch from "@/components/legal-document-search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">AI Document Processing & Search System</h1>
        <p className="text-lg text-muted-foreground">
          Advanced document processing with article classification, legal document search, and RAG capabilities
        </p>
      </div>

      <Tabs defaultValue="classifier" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="classifier">Article Classifier</TabsTrigger>
          <TabsTrigger value="legal-search">Legal Search</TabsTrigger>
          <TabsTrigger value="chat">RAG Chat</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="classifier" className="mt-6">
          <ArticleClassifier />
        </TabsContent>

        <TabsContent value="legal-search" className="mt-6">
          <LegalDocumentSearch />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <ChatInterface />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentUpload />
        </TabsContent>
      </Tabs>
    </div>
  )
}
