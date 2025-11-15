"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth/context";
import MovieCard from "@/components/movies/MovieCard";
import MovieFilters from "@/components/movies/MovieFilters";
import type { Movie, UserMovieInteraction } from "@/lib/types";

interface MovieWithInteraction extends Movie {
  interaction: UserMovieInteraction | null;
}

export default function MoviesPage() {
  const { user } = useAuth();
  const [movies, setMovies] = useState<MovieWithInteraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtre state'leri
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [watchedFilter, setWatchedFilter] = useState<"all" | "watched" | "unwatched">("all");
  const [sortBy, setSortBy] = useState<"year" | "title" | "rating">("year");

  // Filmleri yükle
  useEffect(() => {
    fetchMovies();
  }, [user]);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const url = user
        ? `/api/movies?userId=${user.id}`
        : "/api/movies";

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setMovies(data.movies);
      } else {
        setError(data.error || "Filmler yüklenirken bir hata oluştu");
      }
    } catch (err) {
      setError("Filmler yüklenirken bir hata oluştu");
      console.error("Fetch movies error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Etkileşim değişikliği
  const handleInteractionChange = async (
    movieId: string,
    interactionData: Partial<UserMovieInteraction>
  ) => {
    if (!user) return;

    try {
      const response = await fetch("/api/interactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          movieId,
          ...interactionData,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Local state'i güncelle
        setMovies((prevMovies) =>
          prevMovies.map((movie) =>
            movie.id === movieId
              ? { ...movie, interaction: data.interaction }
              : movie
          )
        );
      }
    } catch (error) {
      console.error("Save interaction error:", error);
    }
  };

  // Benzersiz türleri çıkar
  const allGenres = useMemo(() => {
    const genreSet = new Set<string>();
    movies.forEach((movie) => {
      movie.genres.forEach((genre) => genreSet.add(genre));
    });
    return Array.from(genreSet).sort();
  }, [movies]);

  // Filtreli ve sıralanmış filmler
  const filteredMovies = useMemo(() => {
    let filtered = [...movies];

    // Tür filtresi
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((movie) =>
        movie.genres.some((genre) => selectedGenres.includes(genre))
      );
    }

    // İzlenme durumu filtresi
    if (watchedFilter === "watched") {
      filtered = filtered.filter((movie) => movie.interaction?.watched);
    } else if (watchedFilter === "unwatched") {
      filtered = filtered.filter((movie) => !movie.interaction?.watched);
    }

    // Sıralama
    filtered.sort((a, b) => {
      if (sortBy === "year") {
        return b.year - a.year;
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title, "tr");
      } else if (sortBy === "rating") {
        const ratingA = a.interaction?.rating || 0;
        const ratingB = b.interaction?.rating || 0;
        return ratingB - ratingA;
      }
      return 0;
    });

    return filtered;
  }, [movies, selectedGenres, watchedFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Filmler yükleniyor...</p>
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
            onClick={fetchMovies}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Film Kataloğu</h1>
        <p className="text-gray-600 mt-2">
          {movies.length} film • {filteredMovies.length} sonuç gösteriliyor
        </p>
      </div>

      {/* Filtreler */}
      <MovieFilters
        genres={allGenres}
        selectedGenres={selectedGenres}
        onGenreChange={setSelectedGenres}
        watchedFilter={watchedFilter}
        onWatchedFilterChange={setWatchedFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {/* Film Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              interaction={movie.interaction}
              onInteractionChange={handleInteractionChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Filtrelere uygun film bulunamadı</p>
          <button
            onClick={() => {
              setSelectedGenres([]);
              setWatchedFilter("all");
            }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
}
