'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChartSpline, LayoutGrid, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/1', icon: LayoutGrid, label: 'Workouts' },
  { href: '/2', icon: ChartSpline, label: 'Stats' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 pt-1 pb-6 left-1/2 -translate-x-1/2 w-full px-10 bg-bgBase flex items-center justify-center">
      <nav className="w-full max-w-[430px] flex justify-between items-center ">
        {navItems.map(({ href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center">
              <div
                className={`p-4 rounded-full transition-all ${
                  isActive ? 'text-accent' : 'text-muted'
                }`}>
                <Icon size={24} strokeWidth={2} />
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
