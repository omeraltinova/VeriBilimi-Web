"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { useRouter } from "next/navigation";
import StatsSummary from "@/components/profile/StatsSummary";
import RecommendationCard from "@/components/profile/RecommendationCard";
import type { Movie, Review } from "@/lib/types";

interface ProfileData {
  stats: {
    totalWatched: number;
    averageRating: number;
    totalLiked: number;
  };
  watchedMovies: Array<Movie & { watched: boolean; liked?: boolean; rating?: number }>;
  reviews: Array<Review & { movieTitle: string; movieYear: number }>;
  recommendation: Movie | null;
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Giriş kontrolü
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Profil verilerini yükle
  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/profile?userId=${user.id}`);
      const data = await response.json();

      if (response.ok) {
        setProfileData(data);
      } else {
        setError(data.error || "Profil yüklenirken bir hata oluştu");
      }
    } catch (err) {
      setError("Profil yüklenirken bir hata oluştu");
      console.error("Fetch profile error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Profil yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchProfileData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Kullanıcı Başlığı */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profilim</h1>
        <p className="text-gray-600 mt-2">
          Hoş geldin, {user.username || user.email}!
        </p>
      </div>

      {/* İstatistikler */}
      <StatsSummary stats={profileData.stats} />

      {/* Film Önerisi */}
      <RecommendationCard movie={profileData.recommendation} />

      {/* İzlenen Filmler */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          İzlediğim Filmler ({profileData.watchedMovies.length})
        </h2>

        {profileData.watchedMovies.length > 0 ? (
          <div className="space-y-3">
            {profileData.watchedMovies.map((movie) => (
              <div
                key={movie.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                {/* Poster Thumbnail */}
                <div className="flex-shrink-0">
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center">
                      <span className="text-2xl">🎬</span>
                    </div>
                  )}
                </div>

                {/* Film Bilgileri */}
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900">{movie.title}</h3>
                  <p className="text-sm text-gray-600">
                    {movie.year} • {movie.genres.join(", ")}
                  </p>

                  {/* Etkileşimler */}
                  <div className="flex items-center gap-4 mt-2">
                    {movie.rating !== undefined && (
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        ⭐ {movie.rating}/10
                      </span>
                    )}
                    {movie.liked === true && (
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                        👍 Beğendim
                      </span>
                    )}
                    {movie.liked === false && (
                      <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                        👎 Beğenmedim
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <p className="text-gray-600 mb-4">Henüz film izlemedin</p>
            <a
              href="/movies"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Filmleri Keşfet
            </a>
          </div>
        )}
      </div>

      {/* Yorumlarım */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Yorumlarım ({profileData.reviews.length})
        </h2>

        {profileData.reviews.length > 0 ? (
          <div className="space-y-4">
            {profileData.reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {review.movieTitle}
                    </h3>
                    <p className="text-sm text-gray-600">{review.movieYear}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {review.reviewText}
                </p>

                {review.updatedAt !== review.createdAt && (
                  <p className="text-xs text-gray-400 mt-2">
                    Düzenlendi: {new Date(review.updatedAt).toLocaleDateString("tr-TR")}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-600 mb-4">Henüz yorum yapmadın</p>
            <a
              href="/movies"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Film İzle ve Yorum Yap
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
