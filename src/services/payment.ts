import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export const LISTING_FEE_SOL = 0.01;
export const FEE_RECIPIENT_ADDRESS = '6rmN7SW2CnTWcFXn2Y2PQZfRBfVXovH3gMiQ2W9a8PsE';

export interface PaymentResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export class PaymentService {
  private static connection: Connection;

  static initialize(rpcEndpoint: string = 'https://api.mainnet-beta.solana.com') {
    this.connection = new Connection(rpcEndpoint, 'confirmed');
  }

  static async sendListingFee(
    senderWallet: any,
    recipientAddress: string = FEE_RECIPIENT_ADDRESS,
    amountSOL: number = LISTING_FEE_SOL
  ): Promise<PaymentResult> {
    try {
      if (!senderWallet || !senderWallet.publicKey) {
        return {
          success: false,
          error: 'Wallet not connected'
        };
      }

      if (!this.connection) {
        this.initialize();
      }

      const recipientPubkey = new PublicKey(recipientAddress);
      const senderPubkey = senderWallet.publicKey;

      const lamports = Math.floor(amountSOL * LAMPORTS_PER_SOL);

      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: senderPubkey,
        blockhash,
        lastValidBlockHeight
      }).add(
        SystemProgram.transfer({
          fromPubkey: senderPubkey,
          toPubkey: recipientPubkey,
          lamports
        })
      );

      const signed = await senderWallet.signTransaction(transaction);

      const signature = await this.connection.sendRawTransaction(signed.serialize());

      await this.connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });

      return {
        success: true,
        signature
      };
    } catch (error) {
      console.error('Payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    }
  }

  static async verifyTransaction(signature: string): Promise<boolean> {
    try {
      if (!this.connection) {
        this.initialize();
      }

      const status = await this.connection.getSignatureStatus(signature);

      return status?.value?.confirmationStatus === 'confirmed' ||
             status?.value?.confirmationStatus === 'finalized';
    } catch (error) {
      console.error('Transaction verification error:', error);
      return false;
    }
  }

  static async getBalance(walletAddress: string): Promise<number> {
    try {
      if (!this.connection) {
        this.initialize();
      }

      const pubkey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(pubkey);

      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Get balance error:', error);
      return 0;
    }
  }

  static formatSOL(lamports: number): string {
    return (lamports / LAMPORTS_PER_SOL).toFixed(4);
  }

  static async waitForConfirmation(signature: string, maxAttempts: number = 30): Promise<boolean> {
    if (!this.connection) {
      this.initialize();
    }

    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.connection.getSignatureStatus(signature);

      if (status?.value?.confirmationStatus === 'confirmed' ||
          status?.value?.confirmationStatus === 'finalized') {
        return true;
      }

      if (status?.value?.err) {
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return false;
  }
}
