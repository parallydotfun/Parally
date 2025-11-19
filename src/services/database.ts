import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export interface ChatMessage {
  id: string;
  wallet_address: string;
  message_type: 'user' | 'agent';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WalletActivity {
  id: string;
  wallet_address: string;
  transaction_signature: string;
  transaction_type: 'payment' | 'service_purchase' | 'transfer' | 'other';
  amount: number;
  token_mint?: string;
  status: 'pending' | 'confirmed' | 'failed';
  service_name?: string;
  metadata?: Record<string, any>;
  created_at: string;
  confirmed_at?: string;
}

export interface UserSpending {
  id: string;
  wallet_address: string;
  total_spent_sol: number;
  total_spent_usdc: number;
  transaction_count: number;
  services_used: number;
  last_activity_at?: string;
  created_at: string;
  updated_at: string;
}

export class DatabaseService {
  static async getChatHistory(walletAddress: string, limit = 50): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching chat history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception in getChatHistory:', error);
      return [];
    }
  }

  static async saveChatMessage(
    walletAddress: string,
    messageType: 'user' | 'agent',
    content: string,
    metadata?: Record<string, any>
  ): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          wallet_address: walletAddress,
          message_type: messageType,
          content: content,
          metadata: metadata || {},
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving chat message:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in saveChatMessage:', error);
      return null;
    }
  }

  static async deleteChatHistory(walletAddress: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('wallet_address', walletAddress);

      if (error) {
        console.error('Error deleting chat history:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in deleteChatHistory:', error);
      return false;
    }
  }

  static async getUserSpending(walletAddress: string): Promise<UserSpending | null> {
    try {
      const { data, error } = await supabase
        .from('user_spending')
        .select('*')
        .eq('wallet_address', walletAddress)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user spending:', error);
        return null;
      }

      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('user_spending')
          .insert({
            wallet_address: walletAddress,
            total_spent_sol: 0,
            total_spent_usdc: 0,
            transaction_count: 0,
            services_used: 0,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user spending record:', insertError);
          return null;
        }

        return newData;
      }

      return data;
    } catch (error) {
      console.error('Exception in getUserSpending:', error);
      return null;
    }
  }

  static async getWalletActivity(
    walletAddress: string,
    limit = 20
  ): Promise<WalletActivity[]> {
    try {
      const { data, error } = await supabase
        .from('wallet_activity')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching wallet activity:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception in getWalletActivity:', error);
      return [];
    }
  }

  static async recordTransaction(
    walletAddress: string,
    transactionSignature: string,
    transactionType: 'payment' | 'service_purchase' | 'transfer' | 'other',
    amount: number,
    serviceName?: string,
    tokenMint?: string,
    metadata?: Record<string, any>
  ): Promise<WalletActivity | null> {
    try {
      const { data, error } = await supabase
        .from('wallet_activity')
        .insert({
          wallet_address: walletAddress,
          transaction_signature: transactionSignature,
          transaction_type: transactionType,
          amount: amount,
          token_mint: tokenMint,
          status: 'pending',
          service_name: serviceName,
          metadata: metadata || {},
        })
        .select()
        .single();

      if (error) {
        console.error('Error recording transaction:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in recordTransaction:', error);
      return null;
    }
  }

  static async updateTransactionStatus(
    transactionSignature: string,
    status: 'confirmed' | 'failed',
    confirmedAt?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('wallet_activity')
        .update({
          status: status,
          confirmed_at: confirmedAt || new Date().toISOString(),
        })
        .eq('transaction_signature', transactionSignature);

      if (error) {
        console.error('Error updating transaction status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in updateTransactionStatus:', error);
      return false;
    }
  }

  static async getRecentPurchases(
    walletAddress: string,
    limit = 5
  ): Promise<WalletActivity[]> {
    try {
      const { data, error } = await supabase
        .from('wallet_activity')
        .select('*')
        .eq('wallet_address', walletAddress)
        .eq('transaction_type', 'service_purchase')
        .eq('status', 'confirmed')
        .order('confirmed_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent purchases:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception in getRecentPurchases:', error);
      return [];
    }
  }
}
