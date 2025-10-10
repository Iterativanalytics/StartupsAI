import Anthropic from '@anthropic-ai/sdk';
import { BaseLLMProvider, LLMRequest, LLMResponse } from './llm-interface';

export class ClaudeProvider extends BaseLLMProvider {
  name = 'claude';
  private client: Anthropic;

  constructor(apiKey: string) {
    super();
    this.client = new Anthropic({ apiKey });
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    this.validateRequest(request);

    const systemMessage = request.messages.find(m => m.role === 'system');
    const messages = request.messages.filter(m => m.role !== 'system');

    const response = await this.client.messages.create({
      model: request.model || 'claude-3-5-sonnet-20241022',
      max_tokens: request.maxTokens || 4096,
      temperature: request.temperature || 0.7,
      system: systemMessage?.content,
      messages: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    });

    const content = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return {
      content,
      model: response.model,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens
      },
      finishReason: response.stop_reason || 'end_turn'
    };
  }

  async generateStream(
    request: LLMRequest,
    onChunk: (chunk: string) => void
  ): Promise<LLMResponse> {
    this.validateRequest(request);

    const systemMessage = request.messages.find(m => m.role === 'system');
    const messages = request.messages.filter(m => m.role !== 'system');

    let fullContent = '';
    let inputTokens = 0;
    let outputTokens = 0;
    let model = '';
    let finishReason = '';

    const stream = await this.client.messages.create({
      model: request.model || 'claude-3-5-sonnet-20241022',
      max_tokens: request.maxTokens || 4096,
      temperature: request.temperature || 0.7,
      system: systemMessage?.content,
      messages: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      stream: true
    });

    for await (const event of stream) {
      if (event.type === 'message_start') {
        model = event.message.model;
        inputTokens = event.message.usage.input_tokens;
      } else if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        const chunk = event.delta.text;
        fullContent += chunk;
        onChunk(chunk);
      } else if (event.type === 'message_delta') {
        outputTokens = event.usage.output_tokens;
        finishReason = event.delta.stop_reason || 'end_turn';
      }
    }

    return {
      content: fullContent,
      model,
      usage: {
        inputTokens,
        outputTokens
      },
      finishReason
    };
  }
}