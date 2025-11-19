import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Loader } from 'lucide-react';
import { useWallet } from '../services/solana';
import { AgentBuilderService, AgentReview } from '../services/agentBuilder';
import { useNotification } from './Notification';

interface ReviewSystemProps {
  itemId: string;
  averageRating: number;
  reviewCount: number;
}

export default function ReviewSystem({ itemId, averageRating, reviewCount }: ReviewSystemProps) {
  const { wallet, connected } = useWallet();
  const { showNotification } = useNotification();

  const [reviews, setReviews] = useState<AgentReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [newReview, setNewReview] = useState({
    rating: 5,
    reviewText: ''
  });

  useEffect(() => {
    loadReviews();
  }, [itemId]);

  const loadReviews = async () => {
    setLoading(true);
    const fetchedReviews = await AgentBuilderService.getItemReviews(itemId);
    setReviews(fetchedReviews);
    setLoading(false);
  };

  const handleSubmitReview = async () => {
    if (!connected || !wallet) {
      showNotification('error', 'Please connect your wallet to submit a review');
      return;
    }

    if (newReview.reviewText.trim().length < 10) {
      showNotification('warning', 'Review must be at least 10 characters long');
      return;
    }

    setSubmitting(true);

    try {
      const review = await AgentBuilderService.createReview({
        item_id: itemId,
        reviewer_wallet: wallet.publicKey.toString(),
        rating: newReview.rating,
        review_text: newReview.reviewText
      });

      if (review) {
        showNotification('success', 'Review submitted successfully');
        setNewReview({ rating: 5, reviewText: '' });
        setShowReviewForm(false);
        await loadReviews();
      } else {
        showNotification('error', 'Failed to submit review');
      }
    } catch (error) {
      showNotification('error', 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate?.(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-transform`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reviews & Ratings</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-gray-500">({reviewCount} reviews)</span>
          </div>
        </div>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          disabled={!connected}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          Write a Review
        </button>
      </div>

      {showReviewForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            {renderStars(newReview.rating, true, (rating) => setNewReview(prev => ({ ...prev, rating })))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              value={newReview.reviewText}
              onChange={(e) => setNewReview(prev => ({ ...prev, reviewText: e.target.value }))}
              placeholder="Share your experience with this agent..."
              rows={4}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
            <button
              onClick={() => setShowReviewForm(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <Loader className="w-8 h-8 animate-spin mx-auto text-gray-400" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to review this agent!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at || '').toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {review.reviewer_wallet.slice(0, 6)}...{review.reviewer_wallet.slice(-4)}
                  </p>
                </div>
                <button className="flex items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">{review.helpful_count || 0}</span>
                </button>
              </div>
              <p className="text-gray-700">{review.review_text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
