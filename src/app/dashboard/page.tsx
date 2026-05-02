'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Microscope, MessageCircle, Sprout, TrendingUp, Clock, AlertTriangle, CheckCircle, ArrowRight, Brain, Hand } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

interface Stats {
  totalDiagnoses: number;
  totalCrops: number;
  recentDiagnoses: any[];
  healthScore: number;
}

const QUICK_ACTIONS = [
  { href: '/dashboard/diagnosis', icon: Microscope, label: 'Nouveau Diagnostic', desc: 'Analyser une culture via IA', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  { href: '/dashboard/chat',      icon: MessageCircle, label: 'AgriBot', desc: 'Poser une question agricole', color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
  { href: '/dashboard/crops',     icon: Sprout,        label: 'Mes Cultures', desc: 'Gérer mes plantations', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
];

const SEVERITY_COLOR: Record<string, string> = {
  low: 'badge-green', medium: 'badge-amber', high: 'severity-high', critical: 'badge-red',
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({ totalDiagnoses: 0, totalCrops: 0, recentDiagnoses: [], healthScore: 100 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [diagRes, cropRes] = await Promise.all([
          api.get('/diagnosis'),
          api.get('/crops')
        ]);
        
        const diagnoses = diagRes.data.diagnoses || [];
        const crops = cropRes.data.crops || [];
        
        let totalScore = 0;
        let validCrops = 0;
        crops.forEach((c: any) => {
          if (c.status === 'healthy') { totalScore += 100; validCrops++; }
          else if (c.status === 'at_risk') { totalScore += 50; validCrops++; }
          else if (c.status === 'diseased') { totalScore += 0; validCrops++; }
        });
        
        const avgScore = validCrops > 0 ? Math.round(totalScore / validCrops) : 100;

        setStats({
          totalDiagnoses: diagnoses.length,
          totalCrops: crops.length,
          recentDiagnoses: diagnoses.slice(0, 4),
          healthScore: avgScore,
        });
      } catch { /* ignore */ } finally { setLoading(false); }
    }
    fetchStats();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <div className="badge badge-green" style={{ fontSize: '0.75rem' }}>
            <Brain size={12} /> AgriBot Intelligence
          </div>
        </div>
        <h1 style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {greeting}, <span style={{ color: 'var(--green-400)' }}>{user?.name?.split(' ')[0]}</span> <Hand size={28} />
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Votre tableau de bord agricole intelligent</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: Microscope, label: 'Diagnostics', value: loading ? '—' : stats.totalDiagnoses, color: '#22c55e' },
          { icon: Sprout,     label: 'Cultures',    value: loading ? '—' : stats.totalCrops,     color: '#fbbf24' },
          { icon: TrendingUp, label: 'Score santé', value: loading ? '—' : `${stats.healthScore}%`, color: stats.healthScore < 50 ? '#ef4444' : stats.healthScore < 80 ? '#fbbf24' : '#4ade80' },
          { icon: CheckCircle,label: 'Traités',      value: loading ? '—' : stats.recentDiagnoses.filter((d) => d.status === 'completed').length, color: '#86efac' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card glass" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'Outfit', color }}>{value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-secondary)' }}>Actions rapides</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {QUICK_ACTIONS.map(({ href, icon: Icon, label, desc, color, bg }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div className="card glass" style={{ padding: '1.5rem', cursor: 'pointer', height: '100%', transition: 'all 0.3s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ fontWeight: 700, marginBottom: '0.3rem', fontSize: '0.95rem' }}>{label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{desc}</div>
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color, fontSize: '0.8rem', fontWeight: 600 }}>
                Ouvrir <ArrowRight size={12} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Diagnoses */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Diagnostics récents</h3>
        <Link href="/dashboard/diagnosis" className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>
          Voir tout <ArrowRight size={12} />
        </Link>
      </div>
      <div className="card glass" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <span className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : stats.recentDiagnoses.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Microscope size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <p style={{ fontSize: '0.9rem' }}>Aucun diagnostic pour l&apos;instant</p>
            <Link href="/dashboard/diagnosis" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              Faire mon premier diagnostic
            </Link>
          </div>
        ) : (
          stats.recentDiagnoses.map((d, i) => (
            <div key={d._id} style={{
              display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 1.25rem',
              borderBottom: i < stats.recentDiagnoses.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              {d.status === 'completed' ? (
                <CheckCircle size={16} color="var(--green-400)" />
              ) : d.status === 'pending' ? (
                <Clock size={16} color="var(--amber-400)" />
              ) : (
                <AlertTriangle size={16} color="#f87171" />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {d.disease || 'Analyse en cours...'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(d.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
              {d.severity && (
                <span className={`badge ${SEVERITY_COLOR[d.severity] || 'badge-gray'}`} style={{ fontSize: '0.7rem' }}>
                  {d.severity}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
