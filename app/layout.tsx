import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Dum & Co. — Premium Artisanal Handi Biryani Ordering',
  description: 'Slow-cooked. Soul-approved. Authentic clay handi dum biryani delivered hot in sealed terracotta pots with real-time temperature tracking.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Dum & Co. — Premium Artisanal Handi Biryani Ordering',
    description: 'Slow-cooked. Soul-approved. Authentic clay handi dum biryani delivered hot in sealed terracotta pots with real-time temperature tracking.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dum & Co. — Premium Artisanal Handi Biryani Ordering',
    description: 'Slow-cooked. Soul-approved. Authentic clay handi dum biryani delivered hot in sealed terracotta pots with real-time temperature tracking.',
  },
};

const RESTAURANT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Dum & Co.',
  image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop',
  description: 'Slow-cooked. Soul-approved. Artisanal Handi Biryani cooked in terracotta clay pots sealed with whole-wheat dough purdah.',
  servesCuisine: ['Mughlai', 'Awadhi', 'Hyderabadi', 'Biryani'],
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '12th Main Road, Indiranagar',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560038',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 12.9719,
    longitude: 77.6412,
  },
  telephone: '+918049201834',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '11:30',
      closes: '23:30',
    },
  ],
  hasMenu: {
    '@type': 'Menu',
    name: 'Dum & Co. Artisanal Menu',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(RESTAURANT_JSON_LD) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#FFFAF2] text-[#282017]">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
