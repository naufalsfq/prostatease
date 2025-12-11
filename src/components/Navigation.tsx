'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Activity, Home, FileText, Book, LogOut, User, Menu, X, ArrowLeft } from 'lucide-react';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Cek status login saat mount
  useEffect(() => {
    setIsMounted(true);
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || null);
        setUserAvatar(user.avatar || null);
      } catch (e) {
        console.error('Data user rusak', e);
      }
    }
  }, []);

  // 2. Listen untuk update user dari bagian lain aplikasi
  useEffect(() => {
    const handleUserUpdate = (ev: any) => {
      const payload = ev?.detail;
      if (payload) {
        setUserName(payload.name || null);
        setUserAvatar(payload.avatar || null);
      } else {
        // Jika tidak ada detail, cek localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            setUserName(user.name || null);
            setUserAvatar(user.avatar || null);
          } catch (e) {
            // ignore
          }
        }
      }
    };

    window.addEventListener('user-updated', handleUserUpdate as EventListener);
    return () => {
      window.removeEventListener('user-updated', handleUserUpdate as EventListener);
    };
  }, []);

  // 3. Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserName(null);
    setUserAvatar(null);
    setIsMobileMenuOpen(false);
    router.push('/login');
    router.refresh();
  };

  // Hindari hydration mismatch
  if (!isMounted) return null;

  // Jangan tampilkan navbar di halaman login, register, landing, ipss
  if (pathname === '/' || pathname === '/login' || pathname === '/register' || pathname === '/ipss') {
    return null;
  }

  const isEdukasi = pathname === '/edukasi' || pathname?.startsWith('/edukasi');

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO atau Tombol Kembali */}
          {isEdukasi ? (
            <button
              onClick={() => {
                try {
                  router.back();
                } catch (e) {
                  router.push('/dashboard');
                }
              }}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition"
            >
              <ArrowLeft className="h-6 w-6" />
              <span className="text-lg font-medium">Kembali</span>
            </button>
          ) : (
            <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ProstatEase</span>
            </Link>
          )}

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/dashboard" 
              className={`flex items-center space-x-1 hover:text-blue-600 transition ${
                pathname === '/dashboard' ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }`}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              href="/ipss" 
              className={`flex items-center space-x-1 hover:text-blue-600 transition ${
                pathname === '/ipss' ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }`}
            >
              <FileText size={18} />
              <span>Asesmen</span>
            </Link>
            
            <Link 
              href="/edukasi" 
              className={`flex items-center space-x-1 hover:text-blue-600 transition ${
                pathname === '/edukasi' ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }`}
            >
              <Book size={18} />
              <span>Edukasi</span>
            </Link>

            {/* Profil / Logout */}
            <div className="border-l border-gray-300 pl-6 ml-2">
              {userName ? (
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="flex items-center space-x-3 hover:opacity-80 transition">
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{userName}</p>
                      <p className="text-xs text-green-600">Online</p>
                    </div>
                    {userAvatar ? (
                      <img src={userAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <User size={20} />
                      </div>
                    )}
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition shadow-sm">
                  Masuk
                </Link>
              )}
            </div>
          </div>

          {/* TOMBOL MENU MOBILE */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isEdukasi && (
              <button
                onClick={() => {
                  try { router.back(); } catch (e) { router.push('/dashboard'); }
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft size={16} />
                <span>Kembali</span>
              </button>
            )}
            
            <Link 
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)} 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              Dashboard
            </Link>
            
            <Link 
              href="/ipss"
              onClick={() => setIsMobileMenuOpen(false)} 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              Asesmen
            </Link>
            
            <Link 
              href="/edukasi"
              onClick={() => setIsMobileMenuOpen(false)} 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              Edukasi
            </Link>
            
            <div className="border-t border-gray-200 mt-4 pt-4 px-3">
              {userName ? (
                <>
                  <Link 
                    href="/profile" 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="flex items-center space-x-3 mb-3 p-2 rounded-md hover:bg-blue-50"
                  >
                    {userAvatar ? (
                      <img src={userAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <User size={20} />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{userName}</p>
                      <p className="text-xs text-gray-500">Pengguna</p>
                    </div>
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition"
                  >
                    <LogOut size={16} className="mr-2" /> Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}