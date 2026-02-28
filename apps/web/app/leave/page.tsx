'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function LeavePage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [policyId, setPolicyId] = useState('');
  useEffect(()=>{ api('/leave/queue').then(setQueue).catch(()=>{}); },[]);
  const apply = async () => {
    await api('/leave/apply',{method:'POST',body:JSON.stringify({policyId,startDate:new Date().toISOString(),endDate:new Date().toISOString(),days:1,reason:'Personal'})});
    alert('Applied');
  };
  return <div className="space-y-4"><div className="card"><input placeholder="Policy ID" className="border p-2" value={policyId} onChange={e=>setPolicyId(e.target.value)} /><button className="ml-2 bg-blue-600 text-white px-2" onClick={apply}>Apply Leave</button></div><div className="card">{queue.map(item=><div key={item.id}>{item.employee.fullName} - {item.status}</div>)}</div></div>;
}
