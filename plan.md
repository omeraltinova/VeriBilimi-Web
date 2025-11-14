# Film Öneri Web Uygulaması – Plan

## 1. Genel Amaç

Kullanıcıların **sistem tarafından belirlenmiş bir film kataloğu** içinden:

- İzledikleri filmleri işaretleyebildiği,
- Filmlere puan verebildiği,
- "Beğendim / beğenmedim" gibi basit feedback sağlayabildiği,
- Profil sayfasında kendi film geçmişini ve önerilerini görebildiği

basit bir web uygulaması.

> Not: **Önerme sistemi (model)** web uygulamasından ayrı tasarlanacak. Frontend sadece bu modelin sunduğu film listesini ve varsa skorları kullanacak.

---

## 2. Sayfa Yapısı ve Kullanıcı Akışı

### 2.1. Ana Sayfa (`/`)

- Siteyi tanıtan kısa bir alan (hero section):
  - Uygulamanın ne yaptığı
  - Öne çıkan basit görseller / açıklamalar
- "Giriş Yap" ve "Kayıt Ol" butonları.
- Kullanıcı login ise:
  - Kısa bir hoş geldin mesajı
  - "Profilime git" butonu.

### 2.2. Auth Sayfaları

- **`/login`**
  - Email + şifre ile giriş formu.
  - "Hesabın yok mu? Kayıt ol" linki.
- **`/register`**
  - Email, şifre (ve basit ek alanlar: kullanıcı adı vb.)
  - Kayıt sonrası otomatik giriş veya login sayfasına yönlendirme.

MVP için auth backend gerçek olmayabilir; başlangıçta **fake auth / localStorage tabanlı** bir çözüm düşünülebilir. İleride gerçek backend’e geçilebilir.

### 2.3. Profil Sayfası (`/profile`)

- Kullanıcının temel bilgileri (kullanıcı adı, email vb.)
- **İzlenen filmler listesi** (kullanıcının oyladığı / işaretlediği filmler):
  - Kısa özet: toplam film sayısı, ortalama puan, beğendiği film oranı.
- **Sonraki film önerisi alanı** (öneri sistemi entegrasyonu burada olacak):
  - "Sonraki film önerin" başlığı
  - Önerilen film kartı (poster, ad, yıl, türler, kısaca özet)
  - "İzledim" veya "Listeye ekle" butonu.

> Not: Öneri mantığı/modeli ayrı planlanacak. Frontend tarafında sadece "önerilen film" objesini alıp göstereceğiz.

### 2.4. Filmler Sayfası (`/movies`)

- Sistem kataloğundaki **tüm filmler** listelenir.
- Her film kartında:
  - Başlık, yıl, tür(ler), poster (varsa), kısa açıklama.
  - Kullanıcı etkileşimi:
    - Puanlama (1–10 veya 1–5)
    - "Beğendim" / "Beğenmedim" butonu (veya tek bir toggle + puan)
    - "İzledim" işareti (checkbox / toggle)
- Filtreler:
  - Türe göre filtre
  - Minimum puan filtresi (kullanıcı verdiği puanlara göre)
  - Sadece izlediklerim / izlemediklerim

---

## 3. Veri Modeli (Frontend Perspektifi)

> Gerçek veri modeli **öneri sistemi modeline bağlı olacak**, bu yüzden burada sadece frontend tarafının temel ihtiyaçlarına göre bir taslak veriyoruz.

### 3.1. Film Tipi (taslak)

```ts
export type Movie = {
  id: string;              // Modelin verdiği benzersiz ID
  title: string;
  year: number;
  genres: string[];
  description?: string;
  posterUrl?: string;
};
```

### 3.2. Kullanıcı-Film Etkileşimi

```ts
export type UserMovieInteraction = {
  movieId: string;
  watched: boolean;        // İzledim mi?
  liked?: boolean;         // Beğendim mi / beğenmedim mi? (undefined: karar vermemiş)
  rating?: number;         // Kullanıcının verdiği puan (örneğin 1–10)
  updatedAt: string;       // Son değişiklik zamanı (ISO string)
};
```

### 3.3. Kullanıcı Tipi (frontend)

```ts
export type User = {
  id: string;
  email: string;
  username?: string;
};
```

### 3.4. Uygulama State’i (kabaca)

```ts
export type AppState = {
  user: User | null;
  movies: Movie[];                      // Modelden gelen film kataloğu
  interactions: UserMovieInteraction[]; // Kullanıcının bu filmlerle ilişkisi
};
```

**Not:** `movies` listesini şimdilik statik bir JSON dosyasından veya mock veriden doldurabiliriz. Öneri modeli hazır olduğunda bu listeyi API’den çekebiliriz.

---

## 4. Teknoloji Seçimi

- **Framework:** Next.js (React + TypeScript, App Router)
  - Dosya bazlı routing, SSR/SSG, API Routes gibi özellikleri gömülü sunar.
  - Öneri modeli backend’iyle entegrasyon için elverişli bir yapı sağlar.
- **Render modeli:**
  - Varsayılan: SSR ve SSG birlikte kullanılabilir.
  - Bu projede çoğu sayfa için server components, etkileşimli kısımlar için client components kullanılabilir.
- **Routing:**
  - `app/` dizini üzerinden dosya bazlı routing:
    - `app/page.tsx` → `/`
    - `app/login/page.tsx` → `/login`
    - `app/register/page.tsx` → `/register`
    - `app/profile/page.tsx` → `/profile`
    - `app/movies/page.tsx` → `/movies`
- **State yönetimi:**
  - React state + context + hooks.
  - Gerekirse ileride Zustand / Redux gibi bir çözüm eklenebilir.
- **Stil:**
  - Tailwind CSS (Next.js ile sık kullanılan kombinasyon) önerilir.
  - İsteğe göre sade CSS / CSS Modules da kullanılabilir.

---

## 5. Klasör Yapısı (Öneri)

```text
app/
  layout.tsx            // Genel layout (Navbar + Footer)
  page.tsx              // Ana sayfa (/)
  login/
    page.tsx            // /login
  register/
    page.tsx            // /register
  profile/
    page.tsx            // /profile
  movies/
    page.tsx            // /movies
  api/
    movies/
      route.ts          // (Opsiyonel) /api/movies – film kataloğu endpoint’i
    interactions/
      route.ts          // (Opsiyonel) /api/interactions – kullanıcı etkileşimleri
    recommendation/
      route.ts          // (Opsiyonel) /api/recommendation – öneri modeli proxy
components/
  layout/
    Navbar.tsx
    Footer.tsx
  movies/
    MovieCard.tsx
    MovieFilters.tsx
  profile/
    StatsSummary.tsx
    RecommendationCard.tsx
lib/
  api.ts                // API helper fonksiyonları
  types.ts              // Movie, User, Interaction tipleri (veya ayrı klasör)
data/
  movies.mock.json      // Statik film listesi (model gelene kadar)
```

---

## 6. Adım Adım Geliştirme Planı

1. **Next.js (TypeScript) projesini oluştur**
   - `npx create-next-app@latest` komutu ile proje oluştur.
   - `app/` router’ını kullanan (default) yapı ile başla.
2. **Temel sayfaları ve layout’u ekle**
   - `app/layout.tsx` içinde Navbar + temel layout’u oluştur.
   - `app/page.tsx`, `app/login/page.tsx`, `app/register/page.tsx`, `app/profile/page.tsx`, `app/movies/page.tsx` dosyalarını ekle.
3. **Tipler ve temel veri modeli**
   - `Movie`, `UserMovieInteraction`, `User` tiplerini `lib/types.ts` (veya `types/` klasörü) altında tanımla.
4. **Mock film verisi ekle**
   - `data/movies.mock.json` oluşturarak örnek filmler ekle.
   - İlk aşamada sayfalar bu mock veriyi doğrudan import edip kullanabilir.
5. **State ve etkileşimler**
   - Client component içinde (örn. `MoviesPage`) film etkileşimlerini yönet (`watched`, `liked`, `rating`).
   - Gerekirse global context veya custom hook ile `interactions` state’ini merkezileştir.
6. **/movies sayfası UI ve etkileşimleri**
   - `MovieCard` componenti ile film kartlarını göster.
   - "İzledim", "Beğendim/Beğenmedim" ve puan verme kontrollerini ekle.
7. **/profile sayfası**
   - Kullanıcının izlediği filmler, özet istatistikler (toplam film, ortalama rating, beğenme oranı).
   - Öneri alanı için placeholder component (`RecommendationCard`) kullan.
8. **Auth (MVP)**
   - Şimdilik fake login/register (örneğin localStorage veya hard-coded kullanıcı) ile başlayabilirsin.
   - Sonraki aşamada gerçek auth backend’ine bağlanacak şekilde tasarla.
9. **Stil ve iyileştirmeler**
   - Tailwind veya tercih edilen stil çözümü ile responsive tasarım yap.

---

## 7. Sonraki Aşamalar (Öneri Modeli Entegrasyonu)

Bu kısım ayrı planlanacak, ancak frontend tarafında beklenenler:

- Belirli bir endpoint’ten:
  - Film kataloğunu almak (`GET /movies` gibi).
  - Kullanıcının etkileşimlerini göndermek (`POST /feedback` gibi).
  - Önerilen filmi almak (`GET /recommendation` gibi).
- Şimdilik bu endpoint’ler için mock servisler kullanacağız; gerçek model hazır olduğunda sadece API çağrılarını değiştirmek yeterli olacak.
