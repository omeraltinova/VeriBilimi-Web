import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Site Bilgisi */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">🎬 FilmÖneri</h3>
            <p className="text-sm text-gray-600">
              Kişiselleştirilmiş film önerileri ile yeni filmler keşfedin.
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  Filmler
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-blue-600 transition">
                  Profilim
                </Link>
              </li>
            </ul>
          </div>

          {/* Hakkında */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Proje Hakkında</h3>
            <p className="text-sm text-gray-600">
              Bu proje veri bilimi teknikleri kullanılarak geliştirilmiş bir film öneri uygulamasıdır.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} FilmÖneri. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
