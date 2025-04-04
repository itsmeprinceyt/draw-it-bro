import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Draw It Bro - ItsMe Prince",
  description: "A personalized web drawing tool for you to brainstorm ideas or just scribble around!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
