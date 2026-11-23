import './lib/localStorage-polyfill';
import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import "./styles/cross-browser.css";
import { AuthProvider } from "./components/AuthProvider";
import { Suspense } from 'react';
import Script from "next/script";
import ClientLayout from './components/ClientLayout';
import WhatsAppPopupWrapper from './components/WhatsAppPopupWrapper';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AVITO LUXURY | Premium Fragrances",
  description: "Discover luxury fragrances and premium perfumes at A V I T O   S C E N T S.",
  icons: {
    icon: '/avito3-12.png',
    apple: '/avito3-12.png',
  },

  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: true,
    url: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17157980266"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17157980266');
          `}
        </Script>
        {/* Microsoft Clarity Analytics */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xmzeeei7xe");
          `}
        </Script>
      </head>
      <body
        className={`${montserrat.variable} ${playfairDisplay.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <ClientLayout>
              {children}
              <Analytics />
              <SpeedInsights />
            </ClientLayout>
            <WhatsAppPopupWrapper phoneNumber="918905081411" />
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
