'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Leaf, Brain, Shield, Zap, ArrowRight, CheckCircle, Globe, Users } from 'lucide-react';

const STATS = [
  { label: 'Agriculteurs soutenus', value: '10K+', icon: Users },
  { label: 'Diagnostics effectués', value: '50K+', icon: Brain },
  { label: 'Pays africains', value: '15+', icon: Globe },
  { label: 'Précision IA', value: '94%', icon: Shield },
];

const FEATURES = [
  {
    icon: Brain,
    title: 'Diagnostic IA Instantané',
    desc: 'Photographiez votre culture et obtenez un diagnostic précis en secondes grâce à Gemini Vision de Google.',
    color: '#22c55e',
  },
  {
    icon: Leaf,
    title: 'Assistant Agricole AgriBot',
    desc: 'Posez toutes vos questions agricoles à notre chatbot alimenté par Gemini 1.5 Pro, disponible 24h/24.',
    color: '#4ade80',
  },
  {
    icon: Zap,
    title: 'Suivi en Temps Réel',
    desc: 'Suivez l\'état de santé de vos cultures, recevez des alertes et gérez votre historique d\'analyses.',
    color: '#fbbf24',
  },
  {
    icon: Shield,
    title: 'Données Sécurisées',
    desc: 'Vos données sont protégées par Firebase et chiffrées de bout en bout. Votre vie privée est notre priorité.',
    color: '#86efac',
  },
];

const CROPS = ['🌽 Maïs', '🍠 Manioc', '🌾 Riz', '🥜 Arachide', '☕ Café', '🍫 Cacao', '🧅 Mil', '🌿 Sorgho'];

export default function LandingPage() {
  const [activeCrop, setActiveCrop] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActiveCrop((p) => (p + 1) % CROPS.length), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '1rem 0' }}>
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--gradient-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Leaf size={18} color="#fff" />
            </div>
            <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              AgriAI <span style={{ color: 'var(--green-400)' }}>Africa</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="btn btn-ghost btn-sm">Connexion</Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm">Commencer gratuitement</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section style={{ padding: '6rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '5%', width: 300, height: 300,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div className="container" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          {/* Badge */}
          <div className="badge badge-green fade-in" style={{ marginBottom: '1.5rem', fontSize: '0.8rem', padding: '0.35rem 1rem' }}>
            <Brain size={14} /> Propulsé par Google Gemini 1.5 Pro
          </div>

          <h1 className="fade-in" style={{ marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            L&apos;IA au service de{' '}
            <span style={{ background: 'var(--gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              l&apos;agriculture africaine
            </span>
          </h1>

          <p className="fade-in" style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Diagnostiquez les maladies de vos cultures en photo, obtenez des conseils agricoles personnalisés
            et suivez la santé de vos plantations — gratuitement.
          </p>

          {/* Crop carousel */}
          <div className="fade-in" style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem',
          }}>
            {CROPS.map((crop, i) => (
              <span key={crop} style={{
                padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)',
                background: i === activeCrop ? 'rgba(34,197,94,0.15)' : 'transparent',
                border: `1px solid ${i === activeCrop ? 'rgba(34,197,94,0.5)' : 'var(--border)'}`,
                color: i === activeCrop ? 'var(--green-400)' : 'var(--text-muted)',
                fontSize: '0.85rem', fontWeight: 500,
                transition: 'all 0.4s ease',
              }}>
                {crop}
              </span>
            ))}
          </div>

          <div className="flex justify-center gap-4 fade-in">
            <Link href="/auth/register" className="btn btn-primary btn-lg glow-pulse">
              Démarrer maintenant <ArrowRight size={18} />
            </Link>
            <Link href="/auth/login" className="btn btn-outline btn-lg">
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────── */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                <Icon size={24} color="var(--green-400)" style={{ margin: '0 auto 0.75rem' }} />
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--green-400)' }}>
                  {value}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2>Tout ce dont vous avez besoin</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              Une plateforme complète pour moderniser votre agriculture
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card" style={{ padding: '2rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: '1.25rem',
                  background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color={color} />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 650, margin: '0 auto' }}>
          <div className="card" style={{
            padding: '3.5rem 2rem',
            background: 'linear-gradient(135deg, rgba(22,163,74,0.1) 0%, rgba(15,34,20,0.9) 100%)',
            borderColor: 'rgba(34,197,94,0.3)',
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Prêt à transformer votre agriculture ?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Rejoignez des milliers d'agriculteurs africains qui utilisent déjà AgriAI Africa.
            </p>
            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              {['Diagnostic IA gratuit', 'Chatbot agricole 24/7', 'Aucune expertise technique requise'].map((item) => (
                <div key={item} className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <CheckCircle size={16} color="var(--green-400)" /> {item}
                </div>
              ))}
            </div>
            <br />
            <Link href="/auth/register" className="btn btn-primary btn-lg">
              Créer mon compte gratuit <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="glass" style={{ padding: '1.5rem 0', marginTop: 'auto' }}>
        <div className="container flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div className="flex items-center gap-2">
            <Leaf size={16} color="var(--green-400)" />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              © 2026 AgriAI Africa · Propulsé par Google Gemini
            </span>
          </div>
          <div className="flex gap-4" style={{ fontSize: '0.85rem' }}>
            <Link href="/auth/login" style={{ color: 'var(--text-muted)' }}>Connexion</Link>
            <Link href="/auth/register" style={{ color: 'var(--text-muted)' }}>Inscription</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
