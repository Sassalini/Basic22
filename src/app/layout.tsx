import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Basic22",
  description: "A calm, ad-free, friends-only social media platform."
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
