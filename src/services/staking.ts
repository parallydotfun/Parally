import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createClient } from '@supabase/supabase-js';

const MAINNET_RPC = 'https://api.mainnet-beta.solana.com';
const DEVNET_RPC = 'https://api.devnet.solana.com';

const USE_MAINNET = import.meta.env.VITE_SOLANA_NETWORK === 'mainnet';
const RPC_ENDPOINT = USE_MAINNET ? MAINNET_RPC : DEVNET_RPC;

const connection = new Connection(RPC_ENDPOINT, 'confirmed');

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function getTokenBalance(walletAddress: string, tokenAddress: string): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Failed to get token balance:', error);
    return 0;
  }
}

export async function getStakedAmount(walletAddress: string, tokenSymbol: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('user_stakes')
      .select('staked_amount')
      .eq('wallet_address', walletAddress)
      .eq('token_symbol', tokenSymbol)
      .is('unstake_date', null)
      .maybeSingle();

    if (error) {
      console.error('Failed to get staked amount:', error);
      return 0;
    }

    return data?.staked_amount || 0;
  } catch (error) {
    console.error('Failed to get staked amount:', error);
    return 0;
  }
}

export async function stakeTokens(
  wallet: any,
  tokenAddress: string,
  amount: number,
  stakingProgramAddress: string
): Promise<string> {
  try {
    if (!wallet || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    if (!stakingProgramAddress || stakingProgramAddress === 'StakingProgramAddressPlaceholder') {
      throw new Error('Staking program not configured. Please contact support.');
    }

    const fromPubkey = wallet.publicKey;
    const toPubkey = new PublicKey(stakingProgramAddress);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: Math.floor(amount * LAMPORTS_PER_SOL),
      })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    const signed = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());

    await connection.confirmTransaction(signature, 'confirmed');

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stake-tokens`;
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: wallet.publicKey.toString(),
        tokenSymbol: 'R1X',
        amount,
        signature,
      }),
    });

    return signature;
  } catch (error) {
    console.error('Staking failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to stake tokens');
  }
}

export async function unstakeTokens(
  wallet: any,
  tokenAddress: string,
  amount: number,
  stakingProgramAddress: string
): Promise<string> {
  try {
    if (!wallet || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    if (!stakingProgramAddress || stakingProgramAddress === 'StakingProgramAddressPlaceholder') {
      throw new Error('Staking program not configured. Please contact support.');
    }

    const signature = 'mock_unstake_' + Date.now();

    const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/unstake-tokens`;
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress: wallet.publicKey.toString(),
        tokenSymbol: 'R1X',
        amount,
        signature,
      }),
    });

    return signature;
  } catch (error) {
    console.error('Unstaking failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to unstake tokens');
  }
}

export async function getTotalValueLocked(tokenSymbol: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('user_stakes')
      .select('staked_amount')
      .eq('token_symbol', tokenSymbol)
      .is('unstake_date', null);

    if (error) {
      console.error('Failed to get TVL:', error);
      return 0;
    }

    return data?.reduce((sum, stake) => sum + (stake.staked_amount || 0), 0) || 0;
  } catch (error) {
    console.error('Failed to get TVL:', error);
    return 0;
  }
}
