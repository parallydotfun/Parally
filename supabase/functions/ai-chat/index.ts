import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatRequest {
  message: string;
  walletAddress: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

function generateMockResponse(message: string): string {
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('r1x') && (messageLower.includes('what') || messageLower.includes('explain'))) {
    return "r1x is an infrastructure platform for the machine economy, enabling autonomous machine-to-machine transactions. It provides the tools and protocols for machines to discover, negotiate, and execute transactions without human intervention. The platform includes an SDK for developers, a marketplace for services, and comprehensive agent-building tools.";
  }
  
  if (messageLower.includes('machine economy') || messageLower.includes('machine-to-machine')) {
    return "The machine economy refers to an economic system where autonomous machines and AI agents conduct transactions directly with each other. In this paradigm, machines can buy and sell services, data, and computational resources without human oversight. r1x enables this by providing secure payment rails, service discovery mechanisms, and trustless execution environments on blockchain infrastructure.";
  }
  
  if (messageLower.includes('sdk') || messageLower.includes('integrate')) {
    return "To integrate the r1x SDK, you'll need to: 1) Install the SDK package via npm or yarn, 2) Initialize the SDK with your API credentials, 3) Configure your agent's service offerings and payment preferences, 4) Implement the callback handlers for service requests, and 5) Deploy your agent to the r1x network. The SDK provides comprehensive TypeScript support and includes examples for common use cases.";
  }
  
  if (messageLower.includes('marketplace')) {
    return "The r1x Marketplace is a decentralized platform where AI agents and machines can discover and purchase services from each other. Services include data processing, API calls, computational resources, and specialized AI tasks. All transactions are recorded on-chain for transparency and accountability. Service providers set their own pricing and availability, creating a competitive marketplace.";
  }
  
  if (messageLower.includes('staking')) {
    return "r1x Staking allows users to stake tokens to secure the network and earn rewards. Stakers help validate transactions, provide liquidity for the marketplace, and participate in governance decisions. Rewards are distributed based on stake amount and duration. Staking also gives access to premium features and higher service limits.";
  }
  
  if (messageLower.includes('blockchain') || messageLower.includes('base')) {
    return "r1x is built on Base, an Ethereum Layer 2 solution that provides fast, low-cost transactions. This enables microtransactions between machines at scale. The blockchain layer ensures transparency, immutability, and trustless execution of machine-to-machine contracts. Smart contracts handle payment escrow, service level agreements, and dispute resolution.";
  }
  
  if (messageLower.includes('agent') && messageLower.includes('build')) {
    return "Building an r1x agent involves: 1) Defining your agent's capabilities and services, 2) Setting up authentication and wallet integration, 3) Implementing service handlers that respond to requests, 4) Configuring pricing and payment terms, 5) Testing in the sandbox environment, and 6) Deploying to mainnet. The r1x Agent Builder provides a no-code interface for common agent types, while the SDK offers full programmatic control.";
  }
  
  if (messageLower.includes('payment') || messageLower.includes('transaction')) {
    return "r1x handles payments through smart contracts on Base. When a machine requests a service, payment is locked in escrow. Once the service is delivered and verified, payment is released to the provider. This ensures trustless transactions. The system supports multiple tokens and automatic currency conversion. Transaction fees are minimal due to Base's L2 efficiency.";
  }
  
  if (messageLower.includes('hello') || messageLower.includes('hi')) {
    return "Hello! I'm r1x Agent, your assistant for navigating the machine economy. I can help you understand our infrastructure, guide you through integration, and answer questions about building autonomous agents. What would you like to know?";
  }
  
  return "I'm r1x Agent, here to help you understand and build on the machine economy infrastructure. I can answer questions about r1x SDK integration, the marketplace, agent building, staking, blockchain technology, and machine-to-machine transactions. What specific aspect would you like to learn more about?";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    console.log('OpenAI API Key present:', !!openaiApiKey);

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { message, walletAddress, conversationHistory }: ChatRequest = await req.json();

    if (!message || !walletAddress) {
      return new Response(
        JSON.stringify({ error: 'Message and wallet address are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    await supabase.from('chat_messages').insert({
      wallet_address: walletAddress,
      message_type: 'user',
      content: message,
      metadata: { timestamp: new Date().toISOString() },
    });

    let aiResponse: string;
    let tokensUsed = 0;
    let model = 'mock-ai';

    if (openaiApiKey) {
      try {
        console.log('Calling OpenAI API');

        const messages = [
          {
            role: 'system',
            content: 'You are r1x Agent, an AI assistant for the machine economy. You help users understand how r1x enables autonomous machine-to-machine transactions, answer questions about the infrastructure, and guide them through building on blockchain platforms. Be helpful, concise, and technical when needed. Focus on: machine economy concepts, r1x SDK integration, marketplace features, agent building, staking, and blockchain technology.'
          }
        ];

        if (conversationHistory && conversationHistory.length > 0) {
          const recentHistory = conversationHistory.slice(-10);
          for (const msg of recentHistory) {
            messages.push({
              role: msg.role as 'user' | 'assistant' | 'system',
              content: msg.content
            });
          }
        }

        messages.push({
          role: 'user',
          content: message
        });

        const openaiResponse = await fetch(
          'https://api.openai.com/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: messages,
              temperature: 0.7,
              max_tokens: 500,
            }),
          }
        );

        console.log('OpenAI API response status:', openaiResponse.status);

        if (!openaiResponse.ok) {
          const errorData = await openaiResponse.json();
          console.error('OpenAI API error:', errorData);
          throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const openaiData = await openaiResponse.json();
        console.log('OpenAI response parsed successfully');

        aiResponse = openaiData.choices?.[0]?.message?.content || 'I apologize, but I could not generate a response.';
        tokensUsed = openaiData.usage?.total_tokens || 0;
        model = 'gpt-3.5-turbo';
      } catch (error) {
        console.error('OpenAI API call failed, using mock response:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
        aiResponse = generateMockResponse(message);
      }
    } else {
      console.log('OpenAI API key not configured, using mock responses');
      aiResponse = generateMockResponse(message);
    }

    await supabase.from('chat_messages').insert({
      wallet_address: walletAddress,
      message_type: 'agent',
      content: aiResponse,
      metadata: {
        timestamp: new Date().toISOString(),
        model: model,
        tokens: tokensUsed,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse,
        tokensUsed: tokensUsed,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An error occurred',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});