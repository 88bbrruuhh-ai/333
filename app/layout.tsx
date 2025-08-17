import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'A Next.js blog managed with PagesCMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
          <h1 style={{ margin: 0 }}><a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>My Blog</a></h1>
        </header>
        <main style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>{children}</main>
        <footer style={{ textAlign: 'center', color: '#666', padding: '2rem 0' }}>&copy; {new Date().getFullYear()} My Blog</footer>
      </body>
    </html>
  );
}


