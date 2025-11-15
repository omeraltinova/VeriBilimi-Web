import { NextRequest, NextResponse } from "next/server";
import { createUser, isEmailTaken } from "@/lib/models/user";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    // Validasyon
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Tüm alanlar gerekli" },
        { status: 400 }
      );
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Geçersiz email formatı" },
        { status: 400 }
      );
    }

    // Şifre uzunluğu kontrolü
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalı" },
        { status: 400 }
      );
    }

    // Email kullanımda mı kontrol et
    if (isEmailTaken(email)) {
      return NextResponse.json(
        { error: "Bu email zaten kullanımda" },
        { status: 409 }
      );
    }

    // Kullanıcı oluştur
    const user = createUser(email, username, password);

    return NextResponse.json({
      user,
      message: "Kayıt başarılı",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}
