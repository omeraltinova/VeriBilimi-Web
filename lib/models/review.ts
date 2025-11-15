import { getDb, generateId } from "../db";
import type { Review } from "../types";

interface ReviewRow {
  id: string;
  user_id: string;
  movie_id: string;
  review_text: string;
  created_at: string;
  updated_at: string;
}

interface ReviewWithUserRow extends ReviewRow {
  username: string;
}

// Yorum oluştur veya güncelle
export function upsertReview(
  userId: string,
  movieId: string,
  reviewText: string
): Review {
  const db = getDb();

  // Mevcut yorumu kontrol et
  const existing = getReview(userId, movieId);

  if (existing) {
    // Güncelle
    const stmt = db.prepare(`
      UPDATE reviews
      SET review_text = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND movie_id = ?
    `);

    stmt.run(reviewText, userId, movieId);
  } else {
    // Yeni oluştur
    const id = generateId();
    const stmt = db.prepare(`
      INSERT INTO reviews (id, user_id, movie_id, review_text)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, userId, movieId, reviewText);
  }

  return getReview(userId, movieId)!;
}

// Kullanıcının bir film için yorumunu getir
export function getReview(userId: string, movieId: string): Review | undefined {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, user_id as userId, movie_id as movieId, review_text as reviewText,
           datetime(created_at) as createdAt, datetime(updated_at) as updatedAt
    FROM reviews
    WHERE user_id = ? AND movie_id = ?
  `);

  const row = stmt.get(userId, movieId) as Review | undefined;
  return row;
}

// Bir film için tüm yorumları getir (kullanıcı isimleriyle)
export function getMovieReviews(movieId: string): Review[] {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT r.id, r.user_id as userId, r.movie_id as movieId, r.review_text as reviewText,
           datetime(r.created_at) as createdAt, datetime(r.updated_at) as updatedAt,
           u.username
    FROM reviews r
    INNER JOIN users u ON r.user_id = u.id
    WHERE r.movie_id = ?
    ORDER BY r.created_at DESC
  `);

  return stmt.all(movieId) as Review[];
}

// Kullanıcının tüm yorumlarını getir
export function getUserReviews(userId: string): Array<Review & { movieTitle: string; movieYear: number }> {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT r.id, r.user_id as userId, r.movie_id as movieId, r.review_text as reviewText,
           datetime(r.created_at) as createdAt, datetime(r.updated_at) as updatedAt,
           m.title as movieTitle, m.year as movieYear
    FROM reviews r
    INNER JOIN movies m ON r.movie_id = m.id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `);

  return stmt.all(userId) as Array<Review & { movieTitle: string; movieYear: number }>;
}

// Yorum sil
export function deleteReview(userId: string, movieId: string): boolean {
  const db = getDb();
  const stmt = db.prepare(`
    DELETE FROM reviews
    WHERE user_id = ? AND movie_id = ?
  `);

  const result = stmt.run(userId, movieId);
  return result.changes > 0;
}

// Bir film için yorum sayısı
export function getMovieReviewCount(movieId: string): number {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM reviews WHERE movie_id = ?
  `);
  const result = stmt.get(movieId) as { count: number };
  return result.count;
}
