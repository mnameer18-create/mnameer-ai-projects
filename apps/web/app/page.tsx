'use client';
import { useState } from 'react';
import { api } from '../lib/api';

export default function Home() {
  const [form, setForm] = useState({ email: 'admin@startup.local', password: 'Password123!' });
  const [me, setMe] = useState<any>(null);

  const login = async () => {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(form) });
    localStorage.setItem('token', data.accessToken);
    setMe(data.user);
  };

  return <div className="space-y-4"><div className="card"><h1 className="font-bold text-xl">HR System MVP</h1>
    <input className="border p-2 mr-2" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
    <input className="border p-2 mr-2" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
    <button className="bg-blue-600 text-white px-3 py-2" onClick={login}>Login</button></div>
    {me && <div className="card">Logged in as {me.email} ({me.role})</div>}
  </div>;
}
