export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">
          Film Öneri Uygulaması
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sevdiğin filmleri işaretle, puan ver ve sana özel film önerileri al
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Giriş Yap
          </a>
          <a
            href="/register"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Kayıt Ol
          </a>
        </div>
      </main>
    </div>
  );
}
