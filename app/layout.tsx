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
                  document.body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f2f2f2;">' +
                    '<div style="text-align: center;">' +
                    '<h1 style="font-size: 24px; margin-bottom: 20px;">Welcome to Esifi</h1>' +
                    '<p style="font-size: 16px; margin-bottom: 20px;">To access the full Esifi website, please open it in your device\'s web browser.</p>' +
                    '<a href="https://www.esifi-ai.com" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Open in Browser</a>' +
                    '</div>' +
                    '</div>';
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