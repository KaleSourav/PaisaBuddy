import {
  Home,
  TrendingUp,
  BookOpen,
  Wallet,
  ShieldCheck,
  User,
} from 'lucide-react';
import { MainNav } from '@/components/main-nav';
import { Logo } from '@/components/logo';

const navItems = [
  { href: '/dashboard', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/dashboard-analytics', label: 'Dashboard' },
  { href: '/budgeting', label: 'Budget' },
  { href: '/fraud-prevention', label: 'Protect' },
  { href: '#', label: 'Profile' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Logo />
        <div className="flex flex-1 items-center justify-end">
          {/* Future user menu can go here */}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="fixed bottom-0 left-0 z-10 w-full border-t bg-background">
        <MainNav items={navItems} />
      </footer>
    </div>
  );
}
