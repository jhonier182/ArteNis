'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} className={`px-3 py-1.5 rounded ${pathname === href ? 'bg-white/10 text-white' : 'text-dark-300 hover:text-white'}`}>
      {children}
    </Link>
  );
  return (
    <nav className="bg-dark-900 border-b border-dark-700 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary-400">Artenis</Link>
        <div className="flex items-center space-x-2">
          <NavLink href="/">Feed</NavLink>
          <NavLink href="/profile">Profile</NavLink>
          <NavLink href="/premium">Premium</NavLink>
        </div>
      </div>
    </nav>
  );
}
