// Film tipi
export type Movie = {
  id: string;              // Modelin verdiği benzersiz ID
  title: string;
  year: number;
  genres: string[];
  description?: string;
  posterUrl?: string;
};

// Kullanıcı-Film etkileşimi
export type UserMovieInteraction = {
  id: string;
  userId: string;
  movieId: string;
  watched: boolean;        // İzledim mi?
  liked?: boolean;         // Beğendim mi / beğenmedim mi? (undefined: karar vermemiş)
  rating?: number;         // Kullanıcının verdiği puan (örneğin 1–10)
  updatedAt: string;       // Son değişiklik zamanı (ISO string)
};

// Kullanıcı tipi
export type User = {
  id: string;
  email: string;
  username?: string;
};

// Film yorumu
export type Review = {
  id: string;
  userId: string;
  movieId: string;
  reviewText: string;
  createdAt: string;
  updatedAt: string;
  username?: string;      // Join ile gelecek (kullanıcı adı gösterimi için)
};

// Uygulama state'i
export type AppState = {
  user: User | null;
  movies: Movie[];                      // Modelden gelen film kataloğu
  interactions: UserMovieInteraction[]; // Kullanıcının bu filmlerle ilişkisi
};
