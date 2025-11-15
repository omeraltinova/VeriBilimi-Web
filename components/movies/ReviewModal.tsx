"use client";

import { useState, useEffect } from "react";
import type { Movie, Review } from "@/lib/types";

interface ReviewModalProps {
  movie: Movie;
  userId: string;
  existingReview?: Review;
  isOpen: boolean;
  onClose: () => void;
  onSave: (reviewText: string) => Promise<void>;
}

export default function ReviewModal({
  movie,
  userId,
  existingReview,
  isOpen,
  onClose,
  onSave,
}: ReviewModalProps) {
  const [reviewText, setReviewText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal açıldığında mevcut yorumu yükle
  useEffect(() => {
    if (isOpen && existingReview) {
      setReviewText(existingReview.reviewText);
    } else if (isOpen) {
      setReviewText("");
    }
    setError(null);
  }, [isOpen, existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (reviewText.trim().length < 10) {
      setError("Yorum en az 10 karakter olmalı");
      return;
    }

    if (reviewText.length > 1000) {
      setError("Yorum en fazla 1000 karakter olabilir");
      return;
    }

    setIsLoading(true);

    try {
      await onSave(reviewText);
      onClose();
    } catch (err) {
      setError("Yorum kaydedilirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {existingReview ? "Yorumu Düzenle" : "Yorum Yaz"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {movie.title} ({movie.year})
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
              Yorumun ({reviewText.length}/1000 karakter)
            </label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Film hakkındaki düşüncelerini yaz... (En az 10 karakter)"
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading || reviewText.trim().length < 10}
            >
              {isLoading ? "Kaydediliyor..." : existingReview ? "Güncelle" : "Yorum Yap"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
