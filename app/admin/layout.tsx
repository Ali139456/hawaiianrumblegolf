import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Admin",
};

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
