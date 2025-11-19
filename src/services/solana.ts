import React from 'react';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionSignature,
  ConfirmOptions,
  SendOptions,
} from '@solana/web3.js';
import { DatabaseService } from './database';

const SOLANA_RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
const DEVNET_RPC_ENDPOINT = 'https://api.devnet.solana.com';

const USE_DEVNET = true;

export class SolanaService {
  private static connection: Connection | null = null;

  static getConnection(): Connection {
    if (!this.connection) {
      const endpoint = USE_DEVNET ? DEVNET_RPC_ENDPOINT : SOLANA_RPC_ENDPOINT;
      this.connection = new Connection(endpoint, 'confirmed');
    }
    return this.connection;
  }

  static async getBalance(walletAddress: string): Promise<number> {
    try {
      const connection = this.getConnection();
      const publicKey = new PublicKey(walletAddress);
      const balance = await connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }

  static async getWallet(): Promise<any> {
    if ('solana' in window) {
      const solana = (window as any).solana;
      if (solana?.isPhantom) {
        return solana;
      }
    }
    if ('solflare' in window) {
      return (window as any).solflare;
    }
    throw new Error('No Solana wallet found');
  }

  static async createPaymentTransaction(
    fromAddress: string,
    toAddress: string,
    amountInSOL: number
  ): Promise<Transaction> {
    try {
      const connection = this.getConnection();
      const fromPublicKey = new PublicKey(fromAddress);
      const toPublicKey = new PublicKey(toAddress);

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: fromPublicKey,
        blockhash,
        lastValidBlockHeight,
      });

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: toPublicKey,
          lamports: amountInSOL * LAMPORTS_PER_SOL,
        })
      );

      return transaction;
    } catch (error) {
      console.error('Error creating payment transaction:', error);
      throw error;
    }
  }

  static async sendTransaction(
    transaction: Transaction,
    walletAddress: string
  ): Promise<TransactionSignature> {
    try {
      const wallet = await this.getWallet();
      const connection = this.getConnection();

      const { signature } = await wallet.signAndSendTransaction(transaction);

      await DatabaseService.recordTransaction(
        walletAddress,
        signature,
        'payment',
        0
      );

      return signature;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  static async confirmTransaction(
    signature: TransactionSignature,
    commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed'
  ): Promise<boolean> {
    try {
      const connection = this.getConnection();

      const confirmation = await connection.confirmTransaction(signature, commitment);

      if (confirmation.value.err) {
        await DatabaseService.updateTransactionStatus(signature, 'failed');
        return false;
      }

      await DatabaseService.updateTransactionStatus(signature, 'confirmed', new Date().toISOString());
      return true;
    } catch (error) {
      console.error('Error confirming transaction:', error);
      await DatabaseService.updateTransactionStatus(signature, 'failed');
      return false;
    }
  }

  static async sendAndConfirmPayment(
    fromAddress: string,
    toAddress: string,
    amountInSOL: number,
    serviceName?: string
  ): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      const transaction = await this.createPaymentTransaction(
        fromAddress,
        toAddress,
        amountInSOL
      );

      const signature = await this.sendTransaction(transaction, fromAddress);

      await DatabaseService.recordTransaction(
        fromAddress,
        signature,
        serviceName ? 'service_purchase' : 'payment',
        amountInSOL,
        serviceName
      );

      const confirmed = await this.confirmTransaction(signature);

      return {
        success: confirmed,
        signature,
      };
    } catch (error) {
      console.error('Error in sendAndConfirmPayment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed',
      };
    }
  }

  static async getTransactionStatus(
    signature: TransactionSignature
  ): Promise<'confirmed' | 'failed' | 'pending'> {
    try {
      const connection = this.getConnection();
      const status = await connection.getSignatureStatus(signature);

      if (status.value === null) {
        return 'pending';
      }

      if (status.value.err) {
        return 'failed';
      }

      if (status.value.confirmationStatus === 'confirmed' || status.value.confirmationStatus === 'finalized') {
        return 'confirmed';
      }

      return 'pending';
    } catch (error) {
      console.error('Error getting transaction status:', error);
      return 'pending';
    }
  }

  static async monitorTransaction(
    signature: TransactionSignature,
    onStatusChange: (status: 'pending' | 'confirmed' | 'failed') => void,
    maxAttempts = 30,
    intervalMs = 2000
  ): Promise<void> {
    let attempts = 0;

    const checkStatus = async () => {
      if (attempts >= maxAttempts) {
        onStatusChange('failed');
        await DatabaseService.updateTransactionStatus(signature, 'failed');
        return;
      }

      const status = await this.getTransactionStatus(signature);
      onStatusChange(status);

      if (status === 'confirmed') {
        await DatabaseService.updateTransactionStatus(signature, 'confirmed', new Date().toISOString());
        return;
      }

      if (status === 'failed') {
        await DatabaseService.updateTransactionStatus(signature, 'failed');
        return;
      }

      attempts++;
      setTimeout(checkStatus, intervalMs);
    };

    await checkStatus();
  }

  static async getRecentTransactions(
    walletAddress: string,
    limit = 10
  ): Promise<Array<{ signature: string; slot: number; blockTime: number | null }>> {
    try {
      const connection = this.getConnection();
      const publicKey = new PublicKey(walletAddress);

      const signatures = await connection.getSignaturesForAddress(publicKey, { limit });

      return signatures.map(sig => ({
        signature: sig.signature,
        slot: sig.slot,
        blockTime: sig.blockTime,
      }));
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      return [];
    }
  }

  static lamportsToSOL(lamports: number): number {
    return lamports / LAMPORTS_PER_SOL;
  }

  static solToLamports(sol: number): number {
    return sol * LAMPORTS_PER_SOL;
  }

  static truncateAddress(address: string, chars = 4): string {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  }

  static isValidAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  static async requestAirdrop(walletAddress: string, amountInSOL = 1): Promise<string> {
    if (!USE_DEVNET) {
      throw new Error('Airdrops only available on devnet');
    }

    try {
      const connection = this.getConnection();
      const publicKey = new PublicKey(walletAddress);
      const signature = await connection.requestAirdrop(
        publicKey,
        amountInSOL * LAMPORTS_PER_SOL
      );

      await connection.confirmTransaction(signature);
      return signature;
    } catch (error) {
      console.error('Error requesting airdrop:', error);
      throw error;
    }
  }
}

export function useWallet() {
  const [wallet, setWallet] = React.useState<any>(null);
  const [connected, setConnected] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);

  React.useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      if ('solana' in window) {
        const solana = (window as any).solana;
        if (solana?.isPhantom && solana.isConnected) {
          setWallet(solana);
          setConnected(true);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connect = async () => {
    try {
      setConnecting(true);
      const solanaWallet = await SolanaService.getWallet();
      await solanaWallet.connect();
      setWallet(solanaWallet);
      setConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (wallet) {
        await wallet.disconnect();
        setWallet(null);
        setConnected(false);
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return { wallet, connected, connecting, connect, disconnect };
}
