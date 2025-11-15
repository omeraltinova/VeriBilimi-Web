import Database from "better-sqlite3";
import path from "path";

// Veritabanı dosyası yolu
const dbPath = path.join(process.cwd(), "data", "app.db");

// Singleton pattern ile database instance
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    initializeDatabase(db);
  }
  return db;
}

// Veritabanı tablolarını oluştur
function initializeDatabase(database: Database.Database) {
  // Users tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Movies tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      year INTEGER NOT NULL,
      genres TEXT NOT NULL,
      description TEXT,
      poster_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User-Movie Interactions tablosu
  database.exec(`
    CREATE TABLE IF NOT EXISTS user_movie_interactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      movie_id TEXT NOT NULL,
      watched BOOLEAN DEFAULT 0,
      liked BOOLEAN,
      rating INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
      UNIQUE(user_id, movie_id)
    )
  `);

  // İndeksler
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_interactions_user
    ON user_movie_interactions(user_id);

    CREATE INDEX IF NOT EXISTS idx_interactions_movie
    ON user_movie_interactions(movie_id);
  `);
}

// ID oluşturucu (cuid benzeri basit UUID)
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Veritabanını kapat (cleanup için)
export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
