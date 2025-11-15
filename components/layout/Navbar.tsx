"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth/context";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!user;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo ve Ana Navigasyon */}
          <div className="flex">
            {/* Logo/Site Adı */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">🎬 FilmÖneri</span>
            </Link>

            {/* Desktop Navigasyon */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 transition"
              >
                Ana Sayfa
              </Link>
              <Link
                href="/movies"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 transition"
              >
                Filmler
              </Link>
              {isLoggedIn && (
                <Link
                  href="/profile"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 transition"
                >
                  Profilim
                </Link>
              )}
            </div>
          </div>

          {/* Auth Butonları - Desktop */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-700">
                  Merhaba, {user?.username || user?.email}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <span className="sr-only">Menüyü aç</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              Ana Sayfa
            </Link>
            <Link
              href="/movies"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            >
              Filmler
            </Link>
            {isLoggedIn && (
              <Link
                href="/profile"
                className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                Profilim
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isLoggedIn ? (
              <>
                <div className="pl-3 pr-4 py-2 text-base font-medium text-gray-900">
                  {user?.username || user?.email}
                </div>
                <button
                  onClick={logout}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <div className="space-y-1">
                <Link
                  href="/login"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="block pl-3 pr-4 py-2 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 mx-3 rounded-lg text-center"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
