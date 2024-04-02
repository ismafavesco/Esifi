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
                  var link = document.createElement('a');
                  link.href = 'https://www.esifi-ai.com';
                  link.target = '_blank';
                  link.innerHTML = 'Open in External Browser';
                  link.style.display = 'block';
                  link.style.textAlign = 'center';
                  link.style.padding = '10px';
                  link.style.backgroundColor = '#f2f2f2';
                  link.style.color = '#333';
                  link.style.textDecoration = 'none';
                  link.style.fontWeight = 'bold';
                  document.body.insertBefore(link, document.body.firstChild);
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