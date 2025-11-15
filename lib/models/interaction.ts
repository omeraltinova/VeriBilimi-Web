import { getDb, generateId } from "../db";
import type { UserMovieInteraction } from "../types";

interface InteractionRow {
  id: string;
  userId: string;
  movieId: string;
  watched: number;
  liked: number | null;
  rating: number | null;
  updatedAt: string;
}

interface MovieWithInteractionRow {
  id: string;
  title: string;
  year: number;
  genres: string;
  description: string | null;
  posterUrl: string | null;
  watched: number;
  liked: number | null;
  rating: number | null;
}

// Etkileşim oluştur veya güncelle
export function upsertInteraction(
  userId: string,
  movieId: string,
  data: {
    watched?: boolean;
    liked?: boolean;
    rating?: number;
  }
): UserMovieInteraction {
  const db = getDb();

  // Önce mevcut etkileşimi kontrol et
  const existing = getInteraction(userId, movieId);

  if (existing) {
    // Güncelle
    const stmt = db.prepare(`
      UPDATE user_movie_interactions
      SET watched = COALESCE(?, watched),
          liked = COALESCE(?, liked),
          rating = COALESCE(?, rating),
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND movie_id = ?
    `);

    stmt.run(
      data.watched !== undefined ? (data.watched ? 1 : 0) : null,
      data.liked !== undefined ? (data.liked ? 1 : 0) : null,
      data.rating ?? null,
      userId,
      movieId
    );

    return getInteraction(userId, movieId)!;
  } else {
    // Yeni oluştur
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO user_movie_interactions (id, user_id, movie_id, watched, liked, rating)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      userId,
      movieId,
      data.watched !== undefined ? (data.watched ? 1 : 0) : 0,
      data.liked !== undefined ? (data.liked ? 1 : 0) : null,
      data.rating ?? null
    );

    return getInteraction(userId, movieId)!;
  }
}

// Kullanıcının bir filmle etkileşimini getir
export function getInteraction(userId: string, movieId: string): UserMovieInteraction | undefined {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, user_id as userId, movie_id as movieId, watched, liked, rating,
           datetime(updated_at) as updatedAt
    FROM user_movie_interactions
    WHERE user_id = ? AND movie_id = ?
  `);

  const row = stmt.get(userId, movieId) as InteractionRow | undefined;
  if (!row) return undefined;

  return {
    id: row.id,
    userId: row.userId,
    movieId: row.movieId,
    watched: Boolean(row.watched),
    liked: row.liked !== null ? Boolean(row.liked) : undefined,
    rating: row.rating !== null ? row.rating : undefined,
    updatedAt: row.updatedAt,
  };
}

// Kullanıcının tüm etkileşimlerini getir
export function getUserInteractions(userId: string): UserMovieInteraction[] {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, user_id as userId, movie_id as movieId, watched, liked, rating,
           datetime(updated_at) as updatedAt
    FROM user_movie_interactions
    WHERE user_id = ?
    ORDER BY updated_at DESC
  `);

  const rows = stmt.all(userId) as InteractionRow[];
  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    movieId: row.movieId,
    watched: Boolean(row.watched),
    liked: row.liked !== null ? Boolean(row.liked) : undefined,
    rating: row.rating !== null ? row.rating : undefined,
    updatedAt: row.updatedAt,
  }));
}

// Kullanıcının izlediği filmler
export function getWatchedMovies(userId: string) {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT m.id, m.title, m.year, m.genres, m.description, m.poster_url as posterUrl,
           i.watched, i.liked, i.rating
    FROM movies m
    INNER JOIN user_movie_interactions i ON m.id = i.movie_id
    WHERE i.user_id = ? AND i.watched = 1
    ORDER BY i.updated_at DESC
  `);

  const rows = stmt.all(userId) as MovieWithInteractionRow[];
  return rows.map((row) => ({
    ...row,
    genres: JSON.parse(row.genres) as string[],
    description: row.description || undefined,
    posterUrl: row.posterUrl || undefined,
    watched: Boolean(row.watched),
    liked: row.liked !== null ? Boolean(row.liked) : undefined,
  }));
}

// Kullanıcı istatistikleri
export function getUserStats(userId: string) {
  const db = getDb();

  // Toplam izlenen film sayısı
  const watchedStmt = db.prepare(`
    SELECT COUNT(*) as count FROM user_movie_interactions
    WHERE user_id = ? AND watched = 1
  `);
  const watchedResult = watchedStmt.get(userId) as { count: number };

  // Ortalama rating
  const avgRatingStmt = db.prepare(`
    SELECT AVG(rating) as avgRating FROM user_movie_interactions
    WHERE user_id = ? AND rating IS NOT NULL
  `);
  const avgRatingResult = avgRatingStmt.get(userId) as { avgRating: number | null };

  // Beğenilen film sayısı
  const likedStmt = db.prepare(`
    SELECT COUNT(*) as count FROM user_movie_interactions
    WHERE user_id = ? AND liked = 1
  `);
  const likedResult = likedStmt.get(userId) as { count: number };

  return {
    totalWatched: watchedResult.count,
    averageRating: avgRatingResult.avgRating || 0,
    totalLiked: likedResult.count,
  };
}
