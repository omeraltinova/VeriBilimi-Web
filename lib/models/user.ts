import { getDb, generateId } from "../db";
import bcrypt from "bcryptjs";
import type { User } from "../types";

// Kullanıcı oluştur
export function createUser(email: string, username: string, password: string): User {
  const db = getDb();
  const id = generateId();
  const hashedPassword = bcrypt.hashSync(password, 10);

  const stmt = db.prepare(`
    INSERT INTO users (id, email, username, password)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(id, email, username, hashedPassword);

  return { id, email, username };
}

// Email ile kullanıcı bul
export function findUserByEmail(email: string): (User & { password: string }) | undefined {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, email, username, password
    FROM users
    WHERE email = ?
  `);

  return stmt.get(email) as (User & { password: string }) | undefined;
}

// ID ile kullanıcı bul
export function findUserById(id: string): User | undefined {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT id, email, username
    FROM users
    WHERE id = ?
  `);

  return stmt.get(id) as User | undefined;
}

// Kullanıcı şifresini doğrula
export function verifyPassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}

// Email mevcut mu kontrol et
export function isEmailTaken(email: string): boolean {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT COUNT(*) as count FROM users WHERE email = ?
  `);
  const result = stmt.get(email) as { count: number };
  return result.count > 0;
}
