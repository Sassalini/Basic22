import type { Metadata } from "next";
import "./globals.css";

const siteUrl = new URL("https://www.basic22.com");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Basic22",
  description: "A calm, ad-free, friends-only social media platform.",
  applicationName: "Basic22",
  icons: {
    icon: "/icon.svg"
  },
  openGraph: {
    siteName: "Basic22",
    type: "website"
  },
  twitter: {
    card: "summary"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.classList.toggle('light',localStorage.getItem('basic22-theme')==='light')}catch(e){}"
          }}
        />
      </head>
      <body className="calm-scrollbar antialiased">{children}</body>
    </html>
  );
}
