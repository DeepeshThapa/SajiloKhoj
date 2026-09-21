import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSession } from '@/lib/auth/session';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Sajilo Khoj — Find Trusted Technicians Near You in Nepal',
    template: '%s | Sajilo Khoj',
  },
  description:
    'Sajilo Khoj is Nepal’s premier technician marketplace. Discover, compare, and book verified plumbers, electricians, AC repair pros, appliance mechanics, and carpenters in Kathmandu, Lalitpur, Pokhara, and nationwide.',
  keywords: [
    'Technicians in Nepal',
    'Plumber Kathmandu',
    'Electrician Lalitpur',
    'AC Repair Nepal',
    'Appliance Repair Pokhara',
    'Handyman Kathmandu',
    'Home Services Nepal',
    'Sajilo Khoj',
  ],
  authors: [{ name: 'Sajilo Khoj Technologies' }],
  openGraph: {
    title: 'Sajilo Khoj — Find Trusted Technicians Near You in Nepal',
    description:
      'Discover, compare, and book verified plumbers, electricians, AC repair pros, appliance mechanics, and carpenters across Nepal.',
    type: 'website',
    locale: 'en_NP',
    siteName: 'Sajilo Khoj',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafbfc] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Navbar
          initialSession={
            session
              ? {
                  id: session.id,
                  name: session.name,
                  email: session.email,
                  role: session.role,
                }
              : null
          }
        />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
