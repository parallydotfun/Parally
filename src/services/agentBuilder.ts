import { supabase } from './database';

export interface AgentDraft {
  id?: string;
  creator_wallet: string;
  name: string;
  description: string;
  full_description: string;
  category: string;
  price: number;
  api_endpoint: string;
  tags: string[];
  capabilities: string[];
  preview_images: string[];
  last_saved_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AgentReview {
  id?: string;
  item_id: string;
  reviewer_wallet: string;
  rating: number;
  review_text: string;
  helpful_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ListingFee {
  id?: string;
  item_id?: string;
  creator_wallet: string;
  fee_amount: number;
  transaction_signature: string;
  recipient_address: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at?: string;
  confirmed_at?: string;
}

export class AgentBuilderService {
  static async createDraft(walletAddress: string): Promise<AgentDraft | null> {
    try {
      const { data, error } = await supabase
        .from('agent_drafts')
        .insert({
          creator_wallet: walletAddress,
          name: '',
          description: '',
          full_description: '',
          category: 'AI Agent',
          price: 0.01,
          api_endpoint: '',
          tags: [],
          capabilities: [],
          preview_images: []
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating draft:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in createDraft:', error);
      return null;
    }
  }

  static async saveDraft(draftId: string, draftData: Partial<AgentDraft>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('agent_drafts')
        .update({
          ...draftData,
          last_saved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', draftId);

      if (error) {
        console.error('Error saving draft:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in saveDraft:', error);
      return false;
    }
  }

  static async loadDraft(draftId: string): Promise<AgentDraft | null> {
    try {
      const { data, error } = await supabase
        .from('agent_drafts')
        .select('*')
        .eq('id', draftId)
        .single();

      if (error) {
        console.error('Error loading draft:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in loadDraft:', error);
      return null;
    }
  }

  static async getUserDrafts(walletAddress: string): Promise<AgentDraft[]> {
    try {
      const { data, error } = await supabase
        .from('agent_drafts')
        .select('*')
        .eq('creator_wallet', walletAddress)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error getting user drafts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception in getUserDrafts:', error);
      return [];
    }
  }

  static async deleteDraft(draftId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('agent_drafts')
        .delete()
        .eq('id', draftId);

      if (error) {
        console.error('Error deleting draft:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in deleteDraft:', error);
      return false;
    }
  }

  static async createReview(review: Omit<AgentReview, 'id' | 'created_at' | 'updated_at' | 'helpful_count'>): Promise<AgentReview | null> {
    try {
      const { data, error } = await supabase
        .from('agent_reviews')
        .insert({
          item_id: review.item_id,
          reviewer_wallet: review.reviewer_wallet,
          rating: review.rating,
          review_text: review.review_text,
          helpful_count: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating review:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in createReview:', error);
      return null;
    }
  }

  static async getItemReviews(itemId: string): Promise<AgentReview[]> {
    try {
      const { data, error } = await supabase
        .from('agent_reviews')
        .select('*')
        .eq('item_id', itemId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting item reviews:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception in getItemReviews:', error);
      return [];
    }
  }

  static async updateReview(reviewId: string, reviewData: Partial<AgentReview>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('agent_reviews')
        .update({
          ...reviewData,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId);

      if (error) {
        console.error('Error updating review:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in updateReview:', error);
      return false;
    }
  }

  static async recordListingFee(feeData: Omit<ListingFee, 'id' | 'created_at'>): Promise<ListingFee | null> {
    try {
      const { data, error } = await supabase
        .from('listing_fees')
        .insert({
          item_id: feeData.item_id,
          creator_wallet: feeData.creator_wallet,
          fee_amount: feeData.fee_amount,
          transaction_signature: feeData.transaction_signature,
          recipient_address: feeData.recipient_address,
          status: feeData.status
        })
        .select()
        .single();

      if (error) {
        console.error('Error recording listing fee:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in recordListingFee:', error);
      return null;
    }
  }

  static async updateListingFeeStatus(
    transactionSignature: string,
    status: 'confirmed' | 'failed'
  ): Promise<boolean> {
    try {
      const updateData: any = { status };

      if (status === 'confirmed') {
        updateData.confirmed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('listing_fees')
        .update(updateData)
        .eq('transaction_signature', transactionSignature);

      if (error) {
        console.error('Error updating listing fee status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in updateListingFeeStatus:', error);
      return false;
    }
  }

  static async uploadPreviewImage(file: File): Promise<string | null> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const filePath = `agent-previews/${fileName}`;

      const { data, error } = await supabase.storage
        .from('agent-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading preview image:', error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('agent-assets')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Exception in uploadPreviewImage:', error);
      return null;
    }
  }

  static async compressAndUploadImage(file: File, maxWidth: number = 1200, maxHeight: number = 800): Promise<string | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(async (blob) => {
            if (!blob) {
              resolve(null);
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });

            const url = await AgentBuilderService.uploadPreviewImage(compressedFile);
            resolve(url);
          }, 'image/jpeg', 0.85);
        };

        img.src = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    });
  }
}
