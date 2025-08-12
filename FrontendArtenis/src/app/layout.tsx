import type { Metadata } from 'next';

import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Toaster } from '@/components/ui/Toaster';

export const metadata: Metadata = {
  title: {
    default: 'Artenis - Plataforma para Tatuadores',
    template: '%s | Artenis',
  },
  description: 'La mejor plataforma para conectar tatuadores y clientes. Descubre, inspírate y agenda tu próximo tatuaje.',
  keywords: [
    'tatuajes',
    'tatuadores',
    'tattoo',
    'ink',
    'arte corporal',
    'inspiración',
    'diseños',
    'artistas',
  ],
  authors: [{ name: 'Artenis Team' }],
  creator: 'Artenis',
  publisher: 'Artenis',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/es',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    title: 'Artenis - Plataforma para Tatuadores',
    description: 'La mejor plataforma para conectar tatuadores y clientes. Descubre, inspírate y agenda tu próximo tatuaje.',
    siteName: 'Artenis',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Artenis - Plataforma para Tatuadores',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artenis - Plataforma para Tatuadores',
    description: 'La mejor plataforma para conectar tatuadores y clientes.',
    images: ['/og-image.jpg'],
    creator: '@artenis_app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },


};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="es" 
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="color-scheme" content="dark" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Artenis" />
        <meta name="application-name" content="Artenis" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-starturl" content="/" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Meta tags adicionales */}
      </head>
      <body 
        className="min-h-screen bg-dark-950 text-white antialiased selection:bg-primary-500/20 selection:text-primary-300"
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {/* Main content */}
            <main className="flex-1 relative">
              {children}
            </main>
            
            {/* Footer - Si necesario */}
            {/* <Footer /> */}
          </div>
          
          {/* Toast notifications */}
          <Toaster />
          
          {/* Contenedor temporal para toasts personalizados */}
          <div id="toast-container" className="fixed top-4 right-4 z-50 space-y-2"></div>
        </Providers>
      </body>
    </html>
  );
}
