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
          <script
            dangerouslySetInnerHTML={{
              __html: `
                var ua = navigator.userAgent || navigator.vendor;
                var isInstagram = (ua.indexOf('Instagram') > -1) ? true : false;

                if (isInstagram) {
                  if (/iPad|iPhone|iPod/.test(ua)) {
                    window.location.href = 'x-web-search://esifi-ai.com';
                  } else {
                    window.location.href = 'intent:https://yourwebsite.com#Intent;end';
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