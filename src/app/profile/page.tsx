"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', dob: '', gender: '', avatar: '' });

  const calculateAge = (dobStr?: string | null) => {
    if (!dobStr) return null;
    try {
      const dob = new Date(dobStr);
      if (Number.isNaN(dob.getTime())) return null;
      const diff = Date.now() - dob.getTime();
      const ageDt = new Date(diff);
      return Math.abs(ageDt.getUTCFullYear() - 1970);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setForm({ name: data.user.name || '', dob: data.user.dob || '', gender: data.user.gender || '', avatar: data.user.avatar || '' });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, avatar: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    setLoading(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
          // Inform other components (e.g. Navigation) that user updated
          try {
            window.dispatchEvent(new CustomEvent('user-updated', { detail: data.user }));
          } catch (e) {
            // fallback: nothing
          }
        // also dispatch a simple event so listeners that expect no-detail can react
        try {
          window.dispatchEvent(new Event('user-updated'));
        } catch (e) {
          // ignore
        }
        console.debug('Profile saved and user-updated dispatched', data.user);
          setEditing(false);
      } else {
        alert(data.error || 'Gagal menyimpan profil');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Memuat profil...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex items-center space-x-6">
          <div className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            {form.avatar ? (
              <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : user?.name ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-xl">{user.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
            ) : (
              <div className="text-gray-400">No Foto</div>
            )}
          </div>
          <div className="flex-1">
            {!editing ? (
              <>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-sm text-gray-600">Email: {user?.email}</p>
                <p className="text-sm text-gray-600">Tanggal Lahir: {user?.dob || '-'}</p>
                <p className="text-sm text-gray-600">Umur: {calculateAge(user?.dob) ?? '-' } tahun</p>
                <p className="text-sm text-gray-600">Jenis Kelamin: {user?.gender || '-'}</p>
                <div className="mt-4 flex items-center gap-3">
                  <button onClick={() => setEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded">Edit Profil</button>
                  <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded">Logout</button>
                </div>
              </>
            ) : (
              <div>
                <div className="grid grid-cols-1 gap-3">
                  <label className="text-sm">Nama</label>
                  <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="border px-3 py-2 rounded" />
                  <label className="text-sm">Tanggal Lahir</label>
                  <input type="date" value={form.dob} onChange={(e) => setForm({...form, dob: e.target.value})} className="border px-3 py-2 rounded" />
                  <label className="text-sm">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})} className="border px-3 py-2 rounded">
                    <option value="">-- Pilih --</option>
                    <option value="Pria">Pria</option>
                    <option value="Wanita">Wanita</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  <label className="text-sm">Foto Profil</label>
                  <input type="file" accept="image/*" onChange={handleFile} />
                  {form.avatar && (
                    <div className="mt-2 w-24 h-24 rounded-md overflow-hidden border">
                      <img src={form.avatar} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div className="mt-4 space-x-3">
                  <button onClick={handleSave} disabled={loading || !form.name} className={`px-4 py-2 rounded ${loading || !form.name ? 'bg-green-300 text-white cursor-not-allowed' : 'bg-green-600 text-white'}`}>
                    {loading ? 'Menyimpan...' : 'Simpan'}
                  </button>
                  <button onClick={() => { setEditing(false); setForm({ name: user?.name || '', dob: user?.dob || '', gender: user?.gender || '', avatar: user?.avatar || '' }); }} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
