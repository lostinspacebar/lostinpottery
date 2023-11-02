import type { Metadata } from "next";
import { Text_Me_One } from "next/font/google";
import "./globals.css";

const mainFont = Text_Me_One({
  weight: "400",
  subsets: [ "latin" ]
});

export const metadata: Metadata = {
  title: "LOST.IN.POTTERY ~ 2023",
  description: "Just a boi lost in his pots.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={mainFont.className}>
        <main className="flex min-h-screen flex-col justify-between max-w-5xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
