"use client";

interface MovieFiltersProps {
  genres: string[];
  selectedGenres: string[];
  onGenreChange: (genres: string[]) => void;
  watchedFilter: "all" | "watched" | "unwatched";
  onWatchedFilterChange: (filter: "all" | "watched" | "unwatched") => void;
  sortBy: "year" | "title" | "rating";
  onSortByChange: (sortBy: "year" | "title" | "rating") => void;
}

export default function MovieFilters({
  genres,
  selectedGenres,
  onGenreChange,
  watchedFilter,
  onWatchedFilterChange,
  sortBy,
  onSortByChange,
}: MovieFiltersProps) {
  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onGenreChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onGenreChange([...selectedGenres, genre]);
    }
  };

  const handleClearGenres = () => {
    onGenreChange([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">Filtreler</h2>

      {/* İzlenme Durumu */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">İzlenme Durumu</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onWatchedFilterChange("all")}
            className={`px-4 py-2 text-sm rounded-lg transition ${
              watchedFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => onWatchedFilterChange("watched")}
            className={`px-4 py-2 text-sm rounded-lg transition ${
              watchedFilter === "watched"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            İzlediğim
          </button>
          <button
            onClick={() => onWatchedFilterChange("unwatched")}
            className={`px-4 py-2 text-sm rounded-lg transition ${
              watchedFilter === "unwatched"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            İzlemediklerim
          </button>
        </div>
      </div>

      {/* Sıralama */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Sıralama</h3>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as "year" | "title" | "rating")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="year">Yıla Göre</option>
          <option value="title">İsme Göre</option>
          <option value="rating">Puana Göre</option>
        </select>
      </div>

      {/* Türler */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Türler</h3>
          {selectedGenres.length > 0 && (
            <button
              onClick={handleClearGenres}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Temizle
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreToggle(genre)}
              className={`px-3 py-1 text-sm rounded-full transition ${
                selectedGenres.includes(genre)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
        {selectedGenres.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            {selectedGenres.length} tür seçildi
          </p>
        )}
      </div>
    </div>
  );
}
