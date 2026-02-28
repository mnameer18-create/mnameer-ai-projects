'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function AdminPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [name, setName] = useState('');
  useEffect(()=>{ api('/admin/departments').then(setDepartments).catch(()=>{}); },[]);
  const add = async () => { await api('/admin/departments',{method:'POST', body: JSON.stringify({name})}); setDepartments(await api('/admin/departments')); };
  return <div className="card"><h2>Admin Settings</h2><input className="border p-2" value={name} onChange={e=>setName(e.target.value)}/><button className="ml-2 bg-slate-900 text-white px-2" onClick={add}>Add Department</button>{departments.map(d=><div key={d.id}>{d.name}</div>)}</div>;
}
