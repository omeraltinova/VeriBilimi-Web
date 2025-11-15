import Link from "next/link";
import type { Movie } from "@/lib/types";

interface RecommendationCardProps {
  movie: Movie | null;
}

export default function RecommendationCard({ movie }: RecommendationCardProps) {
  if (!movie) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🎬 Senin İçin Öneri
        </h2>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎭</div>
          <p className="text-gray-600 mb-2">
            Henüz öneri yok
          </p>
          <p className="text-sm text-gray-500">
            Daha fazla film izleyip puanla, sana özel öneriler sunalım!
          </p>
          <Link
            href="/movies"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Filmlere Göz At
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">🎬</span>
        <h2 className="text-xl font-bold">Senin İçin Öneri</h2>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="flex-shrink-0">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full md:w-48 h-64 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-full md:w-48 h-64 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-6xl">🎬</span>
              </div>
            )}
          </div>

          {/* Film Bilgileri */}
          <div className="flex-grow">
            <h3 className="text-2xl font-bold mb-2">{movie.title}</h3>
            <p className="text-blue-100 mb-3">
              {movie.year} • {movie.genres.join(", ")}
            </p>
            {movie.description && (
              <p className="text-white/90 mb-4 line-clamp-3">
                {movie.description}
              </p>
            )}

            <Link
              href="/movies"
              className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition shadow-md"
            >
              Filmlere Git ve İzle
            </Link>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-white/80">
            💡 Bu öneri, beğendiğin filmlerin türlerine göre seçildi
          </p>
        </div>
      </div>
    </div>
  );
}
