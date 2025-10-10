export interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}

export class VectorStore {
  private documents: VectorDocument[] = [];
  private pinecone?: any; // Pinecone client would be injected

  async addDocument(doc: VectorDocument): Promise<void> {
    if (this.pinecone) {
      // Store in Pinecone
      // await this.pinecone.upsert([{
      //   id: doc.id,
      //   values: doc.embedding,
      //   metadata: { content: doc.content, ...doc.metadata }
      // }]);
    } else {
      // Fallback to in-memory storage
      this.documents.push(doc);
    }
  }

  async search(
    queryEmbedding: number[],
    topK: number = 5,
    filter?: Record<string, any>
  ): Promise<VectorDocument[]> {
    if (this.pinecone) {
      // Query Pinecone
      // const results = await this.pinecone.query({
      //   vector: queryEmbedding,
      //   topK,
      //   filter
      // });
      // return results.matches.map(m => ({
      //   id: m.id,
      //   content: m.metadata.content,
      //   embedding: m.values,
      //   metadata: m.metadata
      // }));
      return [];
    } else {
      // Fallback: cosine similarity search
      const scored = this.documents.map(doc => ({
        doc,
        score: this.cosineSimilarity(queryEmbedding, doc.embedding)
      }));

      return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(s => s.doc);
    }
  }

  async delete(id: string): Promise<void> {
    if (this.pinecone) {
      // await this.pinecone.delete([id]);
    } else {
      this.documents = this.documents.filter(doc => doc.id !== id);
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}