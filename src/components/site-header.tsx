import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const links = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#cortes', label: 'Cortes' },
  { href: '#barbers', label: 'Barberos' },
  { href: '#horarios', label: 'Horarios' }
];

export function SiteHeader({ onBooking }: { onBooking: () => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <a href="#inicio" className="font-display text-xl font-black uppercase tracking-[0.38em] text-white">
          Barber Gang MX
        </a>
        <nav className="hidden items-center gap-8 text-sm font-bold uppercase tracking-[0.22em] text-white/75 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-neon">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button onClick={onBooking}>Agendar Cita</Button>
          <button className="rounded-full border border-white/15 p-3 text-white md:hidden" aria-label="Abrir menú">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}