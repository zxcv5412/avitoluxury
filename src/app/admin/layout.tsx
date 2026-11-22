import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin Dashboard | A V I T O   S C E N T S",
  description: "Admin dashboard for A V I T O   S C E N T S perfume store",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-sans">
      {/* No Nav or Footer here */}
      {children}
    </div>
  );
} 