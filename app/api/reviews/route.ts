import { NextRequest, NextResponse } from "next/server";
import { upsertReview, getMovieReviews, deleteReview } from "@/lib/models/review";

// Film için yorumları getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get("movieId");

    if (!movieId) {
      return NextResponse.json(
        { error: "movieId gerekli" },
        { status: 400 }
      );
    }

    const reviews = getMovieReviews(movieId);

    return NextResponse.json({
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { error: "Yorumlar yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yorum ekle/güncelle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, movieId, reviewText } = body;

    // Validasyon
    if (!userId || !movieId || !reviewText) {
      return NextResponse.json(
        { error: "userId, movieId ve reviewText gerekli" },
        { status: 400 }
      );
    }

    // Yorum çok kısa mı?
    if (reviewText.trim().length < 10) {
      return NextResponse.json(
        { error: "Yorum en az 10 karakter olmalı" },
        { status: 400 }
      );
    }

    // Yorum çok uzun mu?
    if (reviewText.length > 1000) {
      return NextResponse.json(
        { error: "Yorum en fazla 1000 karakter olabilir" },
        { status: 400 }
      );
    }

    const review = upsertReview(userId, movieId, reviewText.trim());

    return NextResponse.json({
      review,
      message: "Yorum kaydedildi",
    });
  } catch (error) {
    console.error("Save review error:", error);
    return NextResponse.json(
      { error: "Yorum kaydedilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yorum sil
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, movieId } = body;

    if (!userId || !movieId) {
      return NextResponse.json(
        { error: "userId ve movieId gerekli" },
        { status: 400 }
      );
    }

    const deleted = deleteReview(userId, movieId);

    if (deleted) {
      return NextResponse.json({
        message: "Yorum silindi",
      });
    } else {
      return NextResponse.json(
        { error: "Yorum bulunamadı" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json(
      { error: "Yorum silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
