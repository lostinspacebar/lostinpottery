import type { Metadata } from "next";
import { Text_Me_One } from "next/font/google";
import "./globals.css";

const mainFont = Text_Me_One({
  weight: "400",
  subsets: ["latin"],
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
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.8em%22 font-size=%22100%22 fill=%22red%22>꩜</text></svg>"
        />
      </head>
      <body className={mainFont.className}>
        <main className="flex min-h-screen flex-col justify-between max-w-5xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
