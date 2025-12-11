'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi input tidak boleh kosong
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Email dan password tidak boleh kosong');
      return;
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid');
      return;
    }

    setLoading(true);

    // Simulasi delay 1.5 detik (mock API call)
    setTimeout(() => {
      try {
        // Dummy token dan user object
        const dummyToken = 'dummy-jwt-token-' + Math.random().toString(36).substr(2, 9);
        const dummyUser = {
          id: 1,
          name: 'Demo User',
          email: formData.email,
          avatar: null,
          dob: null,
          gender: null
        };

        // Simpan ke localStorage
        localStorage.setItem('token', dummyToken);
        localStorage.setItem('user', JSON.stringify(dummyUser));

        // Dispatch event untuk sinkronisasi navbar
        window.dispatchEvent(new CustomEvent('user-updated', { detail: dummyUser }));
        window.dispatchEvent(new Event('user-updated'));

        // Redirect ke dashboard
        router.push('/dashboard');
        router.refresh();
      } catch (err: any) {
        setError('Terjadi kesalahan saat login');
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <Activity className="h-10 w-10 text-blue-600" />
          <span className="text-3xl font-bold text-gray-900">ProstatEase</span>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-center">
          <p className="text-sm text-blue-800 font-medium">
            🔧 Mode Demo - Gunakan email apapun dengan password apapun
          </p>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Masuk ke akun Anda
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="nama@contoh.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Belum punya akun?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/register" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 transition-colors">
                Daftar Sekarang
              </Link>
            </div>
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              <strong>Demo Info:</strong> Mode demo ini menggunakan localStorage untuk simulasi login. Tidak ada database yang terlibat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}