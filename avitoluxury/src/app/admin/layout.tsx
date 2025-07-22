'use client';

import { Montserrat } from "next/font/google";
import "../globals.css";
import dynamic from 'next/dynamic';

// Dynamically import the AdminTokenMonitor component with no SSR
const AdminTokenMonitor = dynamic(
  () => import('../components/AdminTokenMonitor'),
  { ssr: false }
);

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${montserrat.variable} font-sans`}>
      {/* Token expiry monitor */}
      <AdminTokenMonitor />
      
      {/* Main content */}
      {children}
    </div>
  );
} 