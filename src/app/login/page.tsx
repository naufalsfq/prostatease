'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- SIMULASI LOGIN (TANPA DATABASE) ---
    setTimeout(() => {
      // 1. Validasi Input
      if (!formData.email || !formData.password) {
        setError('Email dan password harus diisi');
        setLoading(false);
        return;
      }

      // 2. Buat Data User Palsu
      const mockUser = {
        id: 1,
        name: 'Pengguna Demo',
        email: formData.email,
        role: 'user'
      };

      // 3. Simpan ke Browser
      localStorage.setItem('token', 'fake-jwt-token-12345');
      localStorage.setItem('user', JSON.stringify(mockUser));

      // 4. Masuk Dashboard
      router.push('/dashboard');
      router.refresh();
    }, 1500);
    // ---------------------------------------
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center items-center space-x-2">
          <Activity className="h-10 w-10 text-blue-600" />
          <span className="text-3xl font-bold text-gray-900">ProstatEase</span>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Masuk (Mode Demo)</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          <div className="mb-4 bg-green-50 border border-green-200 p-3 rounded text-xs text-green-800">
            <strong>Info:</strong> Masukkan email & password apa saja untuk masuk.
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" /> {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email" required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password" required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
             <p className="text-sm text-gray-600">Belum punya akun? <Link href="/register" className="text-blue-600 font-medium">Daftar</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}