import type { Metadata } from "next";
import "./globals.css";

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
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
