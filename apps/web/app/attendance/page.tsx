'use client';
import { useState } from 'react';
import { api } from '../../lib/api';

export default function AttendancePage() {
  const [logs, setLogs] = useState<any[]>([]);
  return <div className="card space-x-2"><button className="bg-green-600 text-white px-2" onClick={()=>api('/attendance/clock-in',{method:'POST'})}>Clock In</button><button className="bg-red-600 text-white px-2" onClick={()=>api('/attendance/clock-out',{method:'POST'})}>Clock Out</button><button className="bg-slate-700 text-white px-2" onClick={()=>api('/attendance/history').then(setLogs)}>Refresh</button>{logs.map(l=><div key={l.id}>{l.date} in:{l.clockInAt} out:{l.clockOutAt}</div>)}</div>;
}
