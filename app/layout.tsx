import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ToasterProvider } from '@/components/toaster-provider';
import { ModalProvider } from '@/components/modal-provider';
import { CrispProvider } from '@/components/crisp-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Esifi',
  description: 'Most Advance AI software',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                var ua = navigator.userAgent || navigator.vendor;
                var isInstagram = (ua.indexOf('Instagram') > -1) ? true : false;

                if (isInstagram) {
                  if (/iPad|iPhone|iPod/.test(ua)) {
                    window.location.href = 'https://esifi-ai.com';
                  } else {
                    window.location.href = 'intent://esifi-ai.com#Intent;end';
                  }
                }
              `,
            }}
          />
        </head>
        <body className={inter.className}>
          <CrispProvider />
          <ToasterProvider />
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}