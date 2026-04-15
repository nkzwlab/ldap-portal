import NavBar from "@/lib/components/NavBar";
import "./globals.css";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LDAP Portal",
  description: "LDAP Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <NavBar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
