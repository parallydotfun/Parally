import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface UnstakeRequest {
  walletAddress: string;
  tokenSymbol: string;
  amount: number;
  signature: string;
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
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { walletAddress, tokenSymbol, amount, signature }: UnstakeRequest = await req.json();

    if (!walletAddress || !tokenSymbol || !amount || !signature) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { error: updateError } = await supabase
      .from('user_stakes')
      .update({
        unstake_date: new Date().toISOString(),
      })
      .eq('wallet_address', walletAddress)
      .eq('token_symbol', tokenSymbol)
      .is('unstake_date', null);

    if (updateError) {
      throw updateError;
    }

    const { data: allStakes } = await supabase
      .from('user_stakes')
      .select('staked_amount')
      .eq('token_symbol', tokenSymbol)
      .is('unstake_date', null);

    const totalStaked = allStakes?.reduce((sum, stake) => sum + stake.staked_amount, 0) || 0;

    await supabase
      .from('staking_config')
      .update({ total_value_locked: totalStaked })
      .eq('token_symbol', tokenSymbol);

    return new Response(
      JSON.stringify({ success: true, signature }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in unstake-tokens function:', error);
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