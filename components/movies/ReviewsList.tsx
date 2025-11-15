"use client";

import { useState, useEffect } from "react";
import type { Review } from "@/lib/types";

interface ReviewsListProps {
  movieId: string;
  currentUserId?: string;
}

export default function ReviewsList({ movieId, currentUserId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [movieId]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/reviews?movieId=${movieId}`);
      const data = await response.json();

      if (response.ok) {
        setReviews(data.reviews);
      } else {
        setError(data.error || "Yorumlar yüklenirken bir hata oluştu");
      }
    } catch (err) {
      setError("Yorumlar yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="py-4">
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">Henüz yorum yapılmamış</p>
        <p className="text-sm text-gray-400 mt-1">İlk yorumu sen yap!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">
        Yorumlar ({reviews.length})
      </h3>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className={`p-4 rounded-lg border ${
              review.userId === currentUserId
                ? "bg-blue-50 border-blue-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-semibold text-gray-900">
                  {review.username || "Kullanıcı"}
                </span>
                {review.userId === currentUserId && (
                  <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                    Senin yorumun
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(review.createdAt)}
              </span>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {review.reviewText}
            </p>

            {review.updatedAt !== review.createdAt && (
              <p className="text-xs text-gray-400 mt-2">
                Düzenlendi: {formatDate(review.updatedAt)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
