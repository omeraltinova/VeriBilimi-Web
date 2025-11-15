// Seed script - veritabanını ilk verilerle doldurur
import { getDb } from "../lib/db";
import { seedDatabase } from "../lib/seed";

try {
  console.log("Starting database seed...");

  // Database'i başlat
  getDb();

  // Seed et
  seedDatabase();

  console.log("Seed completed successfully!");
  process.exit(0);
} catch (error) {
  console.error("Seed failed:", error);
  process.exit(1);
}
