'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function EmployeesPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { api('/employees').then(setRows).catch(()=>{}); }, []);
  return <div className="card"><h2 className="font-semibold">Employees</h2>{rows.map(r=><div key={r.id}>{r.fullName} - {r.user.email}</div>)}</div>;
}
