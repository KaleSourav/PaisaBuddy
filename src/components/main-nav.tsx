'use client';

import {
  Home,
  TrendingUp,
  BookOpen,
  Wallet,
  ShieldCheck,
  User,
  BarChart,
  type LucideIcon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
};

const iconMap: { [key: string]: LucideIcon } = {
  Home,
  Portfolio: TrendingUp,
  Dashboard: BarChart,
  Budget: Wallet,
  Protect: ShieldCheck,
  Profile: User,
};

type MainNavProps = {
  items: NavItem[];
};

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav className="grid grid-cols-6 gap-1 p-2">
      {items.map((item) => {
        const Icon = iconMap[item.label];
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-muted-foreground transition-colors hover:text-primary',
              pathname === item.href && 'bg-primary/10 text-primary'
            )}
          >
            {Icon && <Icon className="h-5 w-5" />}
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
