import { Link } from "wouter";

export default function NavbarSimple() {
  return (
    <nav style={{ padding: '10px 16px', borderBottom: '1px solid #eee', display: 'flex', gap: 12 }}>
      <Link href="/">Home</Link>
      <Link href="/documents">Documents</Link>
      <Link href="/funding">Funding</Link>
      <Link href="/analytics">Analytics</Link>
      <Link href="/education">Education</Link>
      <Link href="/ecosystem">Ecosystem</Link>
    </nav>
  );
}
