'use client';
import { useState } from 'react';
import { API_BASE } from '../../lib/api';

export default function DocumentsPage() {
  const [employeeId, setEmployeeId] = useState('');
  const [type, setType] = useState('CONTRACT');
  const [file, setFile] = useState<File | null>(null);

  const upload = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append('type', type);
    fd.append('file', file);
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE}/documents/upload/${employeeId}`, { method: 'POST', headers: { Authorization: `Bearer ${token ?? ''}` }, body: fd });
    alert('Uploaded');
  };

  return <div className="card space-y-2"><input className="border p-2" placeholder="Employee ID" value={employeeId} onChange={e=>setEmployeeId(e.target.value)} /><input className="border p-2" value={type} onChange={e=>setType(e.target.value)} /><input type="file" onChange={e=>setFile(e.target.files?.[0] ?? null)} /><button className="bg-blue-700 text-white px-2" onClick={upload}>Upload</button></div>;
}
