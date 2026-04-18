import { Instrument_Serif, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Word Ladder — a search-algorithm puzzle",
  description:
    "Climb from one word to another, one letter at a time. Solved with UCS, Greedy BFS, and A*.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body className="font-sans bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
