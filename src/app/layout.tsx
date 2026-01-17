import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  title: "Amebo - AI-Powered Note Taking",
  description: "Your second brain, powered by advanced AI. Auto-summarize meetings, organize thoughts semantically, and never lose a great idea again.",
  keywords: ["note-taking", "AI", "meeting notes", "transcription", "semantic search", "productivity"],
  authors: [{ name: "Amebo" }],
  openGraph: {
    title: "Amebo - AI-Powered Note Taking",
    description: "Your second brain, powered by advanced AI. Auto-summarize meetings, organize thoughts semantically, and never lose a great idea again.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amebo - AI-Powered Note Taking",
    description: "Your second brain, powered by advanced AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${bricolage.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
