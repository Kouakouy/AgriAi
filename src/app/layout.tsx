import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'AgriAI Africa — IA Agricole pour l\'Afrique',
  description: 'Plateforme intelligente d\'aide à la décision agricole pour les agriculteurs africains. Diagnostic des cultures via l\'IA AgriBot, conseils personnalisés et suivi des plantations.',
  keywords: 'agriculture, IA, Afrique, diagnostic plantes, AgriBot, maladies cultures',
  authors: [{ name: 'AgriAI Africa Team' }],
  openGraph: {
    title: 'AgriAI Africa',
    description: 'L\'IA au service des agriculteurs africains',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Animated AI orbs */}
        <div className="orb-1" />
        <div className="orb-2" />

        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: 'var(--bg-card)', color: '#fff', border: '1px solid var(--border)' }
          }}
        />
      </body>
    </html>
  );
}
