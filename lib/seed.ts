import { createMovie, getMovieCount } from "./models/movie";
import moviesData from "@/data/movies.mock.json";

export function seedDatabase() {
  // Eğer veritabanında film varsa, seed etme
  const count = getMovieCount();
  if (count > 0) {
    console.log("Database already seeded with", count, "movies");
    return;
  }

  console.log("Seeding database with movies...");

  // Mock filmleri veritabanına ekle
  for (const movie of moviesData) {
    createMovie(
      movie.title,
      movie.year,
      movie.genres,
      movie.description,
      movie.posterUrl
    );
  }

  console.log(`Successfully seeded ${moviesData.length} movies`);
}
