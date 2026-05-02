'use client';
import Link from 'next/link';
import { Leaf, Zap, ArrowRight, CheckCircle2, MessageSquare, LineChart, ChevronRight, Camera, ShieldCheck, Shield } from 'lucide-react';

const dotPattern = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%23cbd5e1' fill-opacity='0.4'/%3E%3C/svg%3E")`;

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff', color: 'var(--text-primary)' }}>
      {/* ── Navbar ─────────────────────────────────────── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, padding: '1rem 0', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)' }}>
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--green-600)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
            }}>
              <Leaf size={18} color="#fff" />
            </div>
            <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
              AgriAI <span style={{ color: 'var(--green-600)' }}>Africa</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="btn btn-ghost btn-sm" style={{ fontWeight: 500 }}>Connexion</Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm" style={{ borderRadius: '999px', padding: '0.5rem 1.25rem' }}>Démarrer gratuitement</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section style={{ padding: '6rem 0 0', position: 'relative', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, 
          backgroundImage: dotPattern, 
          maskImage: 'linear-gradient(to bottom, white 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, white 40%, transparent 100%)',
          zIndex: 0
        }} />

        <div className="container" style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', border: '1px solid var(--border)', padding: '0.35rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            <span style={{ display: 'flex', width: 8, height: 8, borderRadius: '50%', background: 'var(--green-500)', boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }} /> 
            La nouvelle référence pour vos récoltes
          </div>

          <h1 style={{ marginBottom: '1.5rem', letterSpacing: '-0.03em', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1 }}>
            Protégez vos cultures.<br />
            <span style={{ color: 'var(--green-600)' }}>Maximisez vos rendements.</span>
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: 650, margin: '0 auto 2.5rem' }}>
            La plateforme intelligente qui vous accompagne au quotidien. Détectez les maladies en un instant, obtenez des plans de traitement précis et gérez l'ensemble de votre exploitation au même endroit.
          </p>

          <div className="flex justify-center gap-4" style={{ marginBottom: '4rem', flexWrap: 'wrap' }}>
            <Link href="/auth/register" className="btn btn-primary btn-lg" style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem', borderRadius: '999px', boxShadow: '0 8px 20px -6px rgba(16, 185, 129, 0.5)' }}>
              Commencer l'analyse <ArrowRight size={18} />
            </Link>
          </div>

          {/* SaaS Mockup Window */}
          <div style={{ 
            maxWidth: 900, margin: '0 auto', background: '#ffffff', borderRadius: '16px 16px 0 0', 
            border: '1px solid var(--border)', borderBottom: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', 
            overflow: 'hidden', position: 'relative', zIndex: 20 
          }}>
            <div style={{ height: 48, background: '#f8fafc', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '0.5rem' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fca5a5' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fde047' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#86efac' }} />
            </div>
            <div style={{ padding: '2rem', background: '#fafafa', display: 'flex', gap: '2rem', height: 400 }}>
              <div style={{ width: 220, display: 'none', '@media (min-width: 768px)': { display: 'flex' } } as any} className="mockup-sidebar">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid var(--border)', paddingRight: '1rem', width: '100%' }}>
                  <div style={{ height: 28, background: '#e2e8f0', borderRadius: 6, width: '100%', marginBottom: '1rem' }} />
                  <div style={{ height: 20, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 4, width: '80%' }} />
                  <div style={{ height: 20, background: '#e2e8f0', borderRadius: 4, width: '90%' }} />
                  <div style={{ height: 20, background: '#e2e8f0', borderRadius: 4, width: '70%' }} />
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ height: 160, background: '#ffffff', border: '1px solid var(--border)', borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
                  <div style={{ flex: 1, background: '#ffffff', border: '1px solid var(--border)', borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                  <div style={{ flex: 1, background: '#ffffff', border: '1px solid var(--border)', borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof ───────────────────────────────── */}
      

      {/* ── How it works ───────────────────────────────── */}
      <section style={{ padding: '7rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 4rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Comment ça marche ?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: 1.6 }}>
              Une technologie complexe rendue extrêmement simple pour vous faire gagner un temps précieux et sauver vos récoltes.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { icon: Camera, title: '1. Photographiez', desc: 'Prenez une photo claire de la plante ou de la feuille qui présente des symptômes suspects.' },
              { icon: Zap, title: '2. Analysez', desc: 'Notre algorithme de pointe détecte instantanément l\'agent pathogène responsable de la maladie.' },
              { icon: ShieldCheck, title: '3. Agissez', desc: 'Recevez un plan de traitement détaillé, adapté à votre culture et à votre région géographique.' }
            ].map((step, i) => (
              <div key={i} style={{ padding: '2.5rem 2rem', background: '#ffffff', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--green-600)' }}>
                  <step.icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bento Box Features ─────────────────────────── */}
      <section style={{ padding: '7rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 650, margin: '0 auto 5rem' }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Bien plus qu'un simple diagnostic
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: 1.6 }}>
              Tout ce dont vous avez besoin pour sécuriser et optimiser vos rendements réuni dans une interface fluide et performante.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Row 1 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ flex: '2 1 400px', padding: '3rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#ffffff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--green-600)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <MessageSquare size={24} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Assistant AgriBot 24/7</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '1.05rem', maxWidth: 400 }}>Un expert toujours dans votre poche. Posez vos questions sur la fertilité des sols, les saisons de semis ou les pesticides, et obtenez des réponses immédiates.</p>
              </div>
              <div style={{ flex: '1 1 300px', padding: '3rem', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--green-600)' }}>
                  <Shield size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Historique sécurisé</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Conservez la trace de tous vos diagnostics pour observer l'évolution de vos parcelles année après année.</p>
              </div>
            </div>
            {/* Row 2 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div style={{ flex: '1 1 300px', padding: '3rem', background: '#ffffff', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--green-600)' }}>
                  <LineChart size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Suivi des rendements</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Visualisez l'état de santé global de vos cultures via des tableaux de bord clairs et synthétiques.</p>
              </div>
              <div style={{ flex: '2 1 400px', padding: '3.5rem 3rem', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', borderRadius: '24px', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Conçu pour le terrain.</h3>
                <p style={{ fontSize: '1.15rem', opacity: 0.9, lineHeight: 1.6, maxWidth: 450 }}>
                  AgriAI est pensé pour fonctionner avec fluidité. Son design épuré assure que l'outil reste fiable et rapide, là où vous en avez le plus besoin.
                </p>
                <div style={{ marginTop: '2rem' }}>
                  <Link href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', color: '#059669', padding: '0.75rem 1.75rem', borderRadius: '999px', fontWeight: 600, textDecoration: 'none', transition: 'transform 0.2s' }}>
                    Essayer maintenant <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section style={{ padding: '6rem 0 7rem', background: '#f8fafc', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Prêt à transformer vos cultures ?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.25rem', lineHeight: 1.6 }}>
            Rejoignez la communauté d'agriculteurs qui utilisent déjà AgriAI Africa pour prendre des décisions plus intelligentes chaque jour.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/auth/register" className="btn btn-primary btn-lg" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '999px', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)' }}>
              Commencer gratuitement <ArrowRight size={18} />
            </Link>
            <Link href="/auth/login" className="btn btn-outline btn-lg" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '999px', background: '#ffffff' }}>
              Contacter l'équipe
            </Link>
          </div>
          <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--green-500)" /> Sans engagement</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--green-500)" /> 100% gratuit</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18} color="var(--green-500)" /> Support réactif</span>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer style={{ padding: '2rem 0', background: '#ffffff', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <div className="container flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div className="flex items-center gap-2">
            <Leaf size={18} color="var(--green-600)" />
            <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 700 }}>
              AgriAI Africa
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '0.5rem' }}>
              © 2026 Tous droits réservés.
            </span>
          </div>
          <div className="flex gap-6" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
            <Link href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Mentions légales</Link>
            <Link href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
