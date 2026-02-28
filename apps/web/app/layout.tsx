import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html><body>
      <nav className="p-3 bg-slate-800 text-white flex gap-4">
        <Link href="/">Dashboard</Link><Link href="/employees">Employees</Link><Link href="/leave">Leave</Link><Link href="/attendance">Attendance</Link><Link href="/documents">Documents</Link><Link href="/admin">Admin</Link>
      </nav>
      <main className="p-6">{children}</main>
    </body></html>
  );
}
