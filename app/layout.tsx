import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quantum Fun | IBM Quantum Experiments",
  description:
    "Daily quantum computing experiments on IBM Quantum hardware — learn quantum mechanics one fun project at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-deep)" }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-purple-900/30 py-6 text-center text-sm text-slate-500">
          <p>
            Powered by{" "}
            <a
              href="https://quantum.cloud.ibm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              IBM Quantum
            </a>{" "}
            · Built with{" "}
            <a
              href="https://qiskit.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Qiskit
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
