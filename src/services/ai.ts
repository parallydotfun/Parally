const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIChatRequest {
  message: string;
  walletAddress: string;
  conversationHistory?: AIMessage[];
}

export interface AIChatResponse {
  success: boolean;
  response: string;
  tokensUsed?: number;
  error?: string;
}

export class AIService {
  static async sendMessage(
    message: string,
    walletAddress: string,
    conversationHistory: AIMessage[] = []
  ): Promise<AIChatResponse> {
    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message,
          walletAddress,
          conversationHistory: conversationHistory.slice(-10),
        } as AIChatRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data: AIChatResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling AI service:', error);
      return {
        success: false,
        response: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async sendMessageWithStreaming(
    message: string,
    walletAddress: string,
    conversationHistory: AIMessage[] = [],
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string) => void,
    onError: (error: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message,
          walletAddress,
          conversationHistory: conversationHistory.slice(-10),
        } as AIChatRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data: AIChatResponse = await response.json();

      if (data.success && data.response) {
        const words = data.response.split(' ');
        let currentText = '';

        for (let i = 0; i < words.length; i++) {
          currentText += (i > 0 ? ' ' : '') + words[i];
          onChunk(currentText);
          await new Promise(resolve => setTimeout(resolve, 30));
        }

        onComplete(data.response);
      } else {
        throw new Error(data.error || 'No response received');
      }
    } catch (error) {
      console.error('Error in streaming AI service:', error);
      onError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }

  static convertToAIMessages(messages: Array<{ type: 'user' | 'agent'; content: string }>): AIMessage[] {
    return messages.map(msg => ({
      role: msg.type === 'agent' ? 'assistant' : 'user',
      content: msg.content,
    }));
  }

  static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  static calculateCost(tokens: number, model: 'gpt-4' | 'gpt-3.5-turbo' = 'gpt-4'): number {
    const costPerToken = model === 'gpt-4' ? 0.00003 : 0.000002;
    return tokens * costPerToken;
  }
}
