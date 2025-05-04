// components/header.tsx
import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function Header() {
  return (
    <header className="bg-background shadow-sm py-4 px-6">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-xl font-bold text-primary">FacultyAppraisal</div>
        <ul className="flex space-x-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={cn(
                  "text-muted-foreground hover:text-primary transition-colors",
                  item.href === '/' && "font-medium"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}