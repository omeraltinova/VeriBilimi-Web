import { NextRequest, NextResponse } from "next/server";
import { getAllMovies } from "@/lib/models/movie";
import { getUserInteractions } from "@/lib/models/interaction";
import type { UserMovieInteraction } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    // URL'den userId parametresini al
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Tüm filmleri getir
    const movies = getAllMovies();

    // Eğer userId varsa, kullanıcının etkileşimlerini de getir
    let interactions: UserMovieInteraction[] = [];
    if (userId) {
      interactions = getUserInteractions(userId);
    }

    // Film ID'lerine göre etkileşimleri map'le
    const interactionMap = new Map(
      interactions.map((interaction) => [interaction.movieId, interaction])
    );

    // Filmleri etkileşimlerle birleştir
    const moviesWithInteractions = movies.map((movie) => ({
      ...movie,
      interaction: interactionMap.get(movie.id) || null,
    }));

    return NextResponse.json({
      movies: moviesWithInteractions,
    });
  } catch (error) {
    console.error("Get movies error:", error);
    return NextResponse.json(
      { error: "Filmler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
