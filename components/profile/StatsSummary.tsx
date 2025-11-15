interface StatsSummaryProps {
  stats: {
    totalWatched: number;
    averageRating: number;
    totalLiked: number;
  };
}

export default function StatsSummary({ stats }: StatsSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">İstatistiklerim</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Toplam İzlenen */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {stats.totalWatched}
          </div>
          <div className="text-sm text-gray-600">İzlenen Film</div>
        </div>

        {/* Ortalama Puan */}
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-4xl font-bold text-green-600 mb-2">
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "-"}
          </div>
          <div className="text-sm text-gray-600">Ortalama Puan</div>
        </div>

        {/* Beğenilen Filmler */}
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {stats.totalLiked}
          </div>
          <div className="text-sm text-gray-600">Beğenilen Film</div>
        </div>
      </div>

      {/* Beğenme Oranı */}
      {stats.totalWatched > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Beğenme Oranı</span>
            <span className="text-sm font-bold text-blue-600">
              {((stats.totalLiked / stats.totalWatched) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${(stats.totalLiked / stats.totalWatched) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
