import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "../components/shared/Topbar";
import Bottombar from "../components/shared/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Footerz2.0",
  description: "Footerz reimagined in a react framework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <Topbar />
        <main className="flex flex-row">
          <div>
            {children}
          </div>
        </main>
        <Bottombar />
      </body>
    </html>
    </ClerkProvider>
  );
}
