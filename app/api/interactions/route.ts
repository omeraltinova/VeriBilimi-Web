import { NextRequest, NextResponse } from "next/server";
import { upsertInteraction } from "@/lib/models/interaction";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, movieId, watched, liked, rating } = body;

    // Validasyon
    if (!userId || !movieId) {
      return NextResponse.json(
        { error: "userId ve movieId gerekli" },
        { status: 400 }
      );
    }

    // En az bir etkileşim verisi olmalı
    if (watched === undefined && liked === undefined && rating === undefined) {
      return NextResponse.json(
        { error: "En az bir etkileşim verisi gerekli" },
        { status: 400 }
      );
    }

    // Rating validasyonu
    if (rating !== undefined && (rating < 1 || rating > 10)) {
      return NextResponse.json(
        { error: "Rating 1-10 arasında olmalı" },
        { status: 400 }
      );
    }

    // Etkileşimi kaydet/güncelle
    const interaction = upsertInteraction(userId, movieId, {
      watched,
      liked,
      rating,
    });

    return NextResponse.json({
      interaction,
      message: "Etkileşim kaydedildi",
    });
  } catch (error) {
    console.error("Save interaction error:", error);
    return NextResponse.json(
      { error: "Etkileşim kaydedilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}
