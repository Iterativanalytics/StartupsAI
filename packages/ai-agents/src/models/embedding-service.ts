import OpenAI from 'openai';

export class EmbeddingService {
  private openai?: OpenAI;
  private model: string;

  constructor(apiKey?: string, model: string = 'text-embedding-3-small') {
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
    this.model = model;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.openai) {
      // Fallback: return random embedding for testing
      return Array(1536).fill(0).map(() => Math.random());
    }

    try {
      const response = await this.openai.embeddings.create({
        model: this.model,
        input: text
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    if (!this.openai) {
      // Fallback: return random embeddings for testing
      return texts.map(() => Array(1536).fill(0).map(() => Math.random()));
    }

    try {
      const response = await this.openai.embeddings.create({
        model: this.model,
        input: texts
      });

      return response.data.map(d => d.embedding);
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw error;
    }
  }

  async similarity(text1: string, text2: string): Promise<number> {
    const [embedding1, embedding2] = await Promise.all([
      this.generateEmbedding(text1),
      this.generateEmbedding(text2)
    ]);

    return this.cosineSimilarity(embedding1, embedding2);
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