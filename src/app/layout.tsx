import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
