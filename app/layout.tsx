import Footer from "@/components/Footer";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minesweeper!",
  description: "Clear the minefield as fast as you can.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex w-screen h-screen justify-start">
          <main className="mx-auto md:h-auto p-4 md:p-8 pb-24">
            <div className="relative bg-white w-full h-full md:h-auto p-8 md:rounded-xl md:shadow-xl">
              {children}
            </div>
          </main>
          <div className="absolute w-full bottom-10 flex flex-col items-center">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
