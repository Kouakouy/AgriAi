'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Leaf, LayoutDashboard, Microscope, MessageCircle, Sprout, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const NAV = [
  { href: '/dashboard',           icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/dashboard/diagnosis', icon: Microscope,       label: 'Diagnostic IA'  },
  { href: '/dashboard/chat',      icon: MessageCircle,    label: 'AgriBot Chat'   },
  { href: '/dashboard/crops',     icon: Sprout,           label: 'Mes cultures'   },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, clearAuth } = useAuthStore();

  useEffect(() => {
    // Prevent redirect before Zustand hydrates by checking localStorage directly
    const storedToken = localStorage.getItem('agri_token');
    if (!storedToken && !token) {
      router.push('/auth/login');
    }
  }, [token, router]);

  // Don't render dashboard until we are sure we have a token (either in store or localStorage)
  if (!token && typeof window !== 'undefined' && !localStorage.getItem('agri_token')) return null;

  const handleLogout = () => {
    clearAuth();
    router.push('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Sidebar ───────────────────────────────────── */}
      <aside className="glass" style={{
        width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column',
        borderRight: '1px solid var(--border)', padding: '1.5rem 1rem',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem', textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
            AgriAI <span style={{ color: 'var(--green-400)' }}>Africa</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)',
                color: active ? 'var(--green-400)' : 'var(--text-muted)',
                background: active ? 'rgba(34,197,94,0.12)' : 'transparent',
                border: active ? '1px solid rgba(34,197,94,0.2)' : '1px solid transparent',
                fontWeight: active ? 600 : 400, fontSize: '0.875rem',
                transition: 'all var(--transition)', textDecoration: 'none',
              }}>
                <Icon size={16} /> {label}
              </Link>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={14} color="#fff" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', gap: '0.6rem', color: 'var(--text-muted)' }}>
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
