import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Film Öneri Uygulaması
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Sevdiğin filmleri işaretle, puan ver ve sana özel film önerileri al
        </p>
        <p className="text-lg text-gray-500 mb-12">
          Veri bilimi ve makine öğrenmesi ile desteklenen kişiselleştirilmiş öneri sistemi
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-16">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition shadow-md hover:shadow-lg"
          >
            Kayıt Ol
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-lg font-semibold mb-2">Geniş Film Kataloğu</h3>
            <p className="text-gray-600 text-sm">
              Binlerce film arasından favorilerini seç ve keşfet
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-lg font-semibold mb-2">Puan ve Değerlendirme</h3>
            <p className="text-gray-600 text-sm">
              İzlediğin filmlere puan ver, beğenilerini işaretle
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold mb-2">Akıllı Öneriler</h3>
            <p className="text-gray-600 text-sm">
              Yapay zeka destekli öneri sistemi ile sana özel filmler
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
