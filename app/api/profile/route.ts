import { NextRequest, NextResponse } from "next/server";
import { getUserStats, getWatchedMovies } from "@/lib/models/interaction";
import { getAllMovies } from "@/lib/models/movie";
import { getUserReviews } from "@/lib/models/review";
import type { Movie } from "@/lib/types";

interface WatchedMovie extends Movie {
  watched: boolean;
  liked?: boolean;
  rating?: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId gerekli" },
        { status: 400 }
      );
    }

    // Kullanıcı istatistiklerini al
    const stats = getUserStats(userId);

    // İzlenen filmleri al
    const watchedMovies = getWatchedMovies(userId) as WatchedMovie[];

    // Kullanıcının yorumlarını al
    const reviews = getUserReviews(userId);

    // Basit öneri algoritması
    const recommendation = getRecommendation(userId, watchedMovies);

    return NextResponse.json({
      stats,
      watchedMovies,
      reviews,
      recommendation,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Profil yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Basit öneri algoritması
function getRecommendation(userId: string, watchedMovies: WatchedMovie[]) {
  try {
    const allMovies = getAllMovies();

    // İzlenen film ID'lerini al
    const watchedMovieIds = new Set(watchedMovies.map((m) => m.id));

    // Beğenilen filmlerin türlerini topla
    const likedGenres = new Map<string, number>();
    watchedMovies.forEach((movie) => {
      if (movie.liked) {
        movie.genres.forEach((genre: string) => {
          likedGenres.set(genre, (likedGenres.get(genre) || 0) + 1);
        });
      }
    });

    // Eğer hiç beğenilen film yoksa, en yüksek puanlı izlenmemiş filmi öner
    if (likedGenres.size === 0) {
      const unwatchedMovies = allMovies.filter((m) => !watchedMovieIds.has(m.id));
      if (unwatchedMovies.length > 0) {
        // Random bir film seç
        return unwatchedMovies[Math.floor(Math.random() * unwatchedMovies.length)];
      }
      return null;
    }

    // Beğenilen türlere göre skorla
    const scoredMovies = allMovies
      .filter((m) => !watchedMovieIds.has(m.id))
      .map((movie) => {
        let score = 0;
        movie.genres.forEach((genre) => {
          score += likedGenres.get(genre) || 0;
        });
        return { movie, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scoredMovies.length > 0) {
      // En yüksek skorlu filmlerden birini seç (ilk 3'ten random)
      const topMovies = scoredMovies.slice(0, Math.min(3, scoredMovies.length));
      const selected = topMovies[Math.floor(Math.random() * topMovies.length)];
      return selected.movie;
    }

    // Hiçbir eşleşme yoksa, izlenmemiş filmlerden random seç
    const unwatchedMovies = allMovies.filter((m) => !watchedMovieIds.has(m.id));
    if (unwatchedMovies.length > 0) {
      return unwatchedMovies[Math.floor(Math.random() * unwatchedMovies.length)];
    }

    return null;
  } catch (error) {
    console.error("Recommendation error:", error);
    return null;
  }
}
