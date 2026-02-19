import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Smart Notes",
  description: "A smart notes app powered by Firebase and Gemini AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
