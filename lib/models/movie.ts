import { getDb, generateId } from "../db";
import type { Movie } from "../types";

interface MovieRow {
  id: string;
  title: string;
  year: number;
  genres: string;
  description: string | null;
  posterUrl: string | null;
}

// Film oluştur
export function createMovie(
  title: string,
  year: number,
  genres: string[],
  description?: string,
  posterUrl?: string
): Movie {
  const db = getDb();
  const id = generateId();

  const stmt = db.prepare(`
    INSERT INTO movies (id, title, year, genres, description, poster_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, title, year, JSON.stringify(genres), description || null, posterUrl || null);

  return { id, title, year, genres, description, posterUrl };
}

// Tüm filmleri getir
export function getAllMovies(): Movie[] {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, title, year, genres, description, poster_url as posterUrl
    FROM movies
    ORDER BY year DESC, title ASC
  `);

  const rows = stmt.all() as MovieRow[];
  return rows.map((row) => ({
    ...row,
    genres: JSON.parse(row.genres) as string[],
    description: row.description || undefined,
    posterUrl: row.posterUrl || undefined,
  }));
}

// ID ile film bul
export function findMovieById(id: string): Movie | undefined {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, title, year, genres, description, poster_url as posterUrl
    FROM movies
    WHERE id = ?
  `);

  const row = stmt.get(id) as MovieRow | undefined;
  if (!row) return undefined;

  return {
    ...row,
    genres: JSON.parse(row.genres) as string[],
    description: row.description || undefined,
    posterUrl: row.posterUrl || undefined,
  };
}

// Film sayısı
export function getMovieCount(): number {
  const db = getDb();
  const stmt = db.prepare(`SELECT COUNT(*) as count FROM movies`);
  const result = stmt.get() as { count: number };
  return result.count;
}
