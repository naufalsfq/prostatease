'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- SIMULASI REGISTER (TANPA DATABASE) ---
    setTimeout(() => {
      if (formData.password !== formData.confirmPassword) {
        setError('Password tidak sama');
        setLoading(false);
        return;
      }

      // Auto Login Palsu
      const newUser = {
        id: 2,
        name: formData.name,
        email: formData.email,
        role: 'user'
      };

      localStorage.setItem('token', 'fake-jwt-token-register');
      localStorage.setItem('user', JSON.stringify(newUser));

      router.push('/dashboard');
      router.refresh();
    }, 1500);
    // ------------------------------------------
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center items-center space-x-2">
          <Activity className="h-10 w-10 text-blue-600" />
          <span className="text-3xl font-bold text-gray-900">ProstatEase</span>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Daftar Akun Baru</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 p-3 rounded text-sm text-red-700">{error}</div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700">Nama</label>
                <input type="text" required className="mt-1 block w-full px-3 py-2 border rounded-md" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" required className="mt-1 block w-full px-3 py-2 border rounded-md" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" required className="mt-1 block w-full px-3 py-2 border rounded-md" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                <input type="password" required className="mt-1 block w-full px-3 py-2 border rounded-md" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>
          </form>
          <div className="mt-6 text-center">
             <p className="text-sm text-gray-600">Sudah punya akun? <Link href="/login" className="text-blue-600 font-medium">Masuk</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}