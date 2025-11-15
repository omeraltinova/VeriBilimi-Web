"use client";

import { useState } from "react";
import type { Movie, UserMovieInteraction } from "@/lib/types";
import { useAuth } from "@/lib/auth/context";

interface MovieCardProps {
  movie: Movie;
  interaction: UserMovieInteraction | null;
  onInteractionChange: (movieId: string, interaction: Partial<UserMovieInteraction>) => void;
}

export default function MovieCard({ movie, interaction, onInteractionChange }: MovieCardProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleWatchedToggle = async () => {
    if (!user || isLoading) return;
    setIsLoading(true);

    const newWatched = !interaction?.watched;
    await onInteractionChange(movie.id, { watched: newWatched });

    setIsLoading(false);
  };

  const handleLikeToggle = async (liked: boolean) => {
    if (!user || isLoading) return;
    setIsLoading(true);

    // Eğer aynı değere tekrar tıklanırsa, beğeniyi kaldır
    const newLiked = interaction?.liked === liked ? undefined : liked;
    await onInteractionChange(movie.id, { liked: newLiked });

    setIsLoading(false);
  };

  const handleRatingChange = async (rating: number) => {
    if (!user || isLoading) return;
    setIsLoading(true);

    await onInteractionChange(movie.id, { rating });

    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Film Posteri */}
      {movie.posterUrl ? (
        <div className="relative h-64 bg-gray-200">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          {interaction?.watched && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              ✓ İzlendi
            </div>
          )}
        </div>
      ) : (
        <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white text-6xl">🎬</span>
        </div>
      )}

      {/* Film Bilgileri */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {movie.year} • {movie.genres.join(", ")}
        </p>
        {movie.description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {movie.description}
          </p>
        )}

        {/* Etkileşim Bölümü */}
        {user ? (
          <div className="space-y-3 border-t pt-3">
            {/* İzledim Checkbox */}
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={interaction?.watched || false}
                onChange={handleWatchedToggle}
                disabled={isLoading}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">İzledim</span>
            </label>

            {/* Beğendim/Beğenmedim */}
            <div className="flex gap-2">
              <button
                onClick={() => handleLikeToggle(true)}
                disabled={isLoading}
                className={`flex-1 px-3 py-2 text-sm rounded-lg transition ${
                  interaction?.liked === true
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                👍 Beğendim
              </button>
              <button
                onClick={() => handleLikeToggle(false)}
                disabled={isLoading}
                className={`flex-1 px-3 py-2 text-sm rounded-lg transition ${
                  interaction?.liked === false
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                👎 Beğenmedim
              </button>
            </div>

            {/* Puan Verme (1-10) */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Puanım: {interaction?.rating || "-"}
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <button
                    key={score}
                    onClick={() => handleRatingChange(score)}
                    disabled={isLoading}
                    className={`flex-1 py-1 text-xs rounded transition ${
                      interaction?.rating === score
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-gray-500">
            Etkileşim için giriş yapın
          </div>
        )}
      </div>
    </div>
  );
}
