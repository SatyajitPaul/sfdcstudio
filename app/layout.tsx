import "./globals.css";
import type { Metadata } from "next";
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: {
    template: "%s | SFDC Studio - Salesforce Workbench Alternative",
    default: "SFDC Studio - Modern Salesforce Workbench & Data Loader Alternative"
  },
  description: "The best Salesforce Workbench alternative for developers. Query, explore, and manage Salesforce data with our fast, secure Workbench tool. Free Data Loader replacement with no setup required.",
  keywords: [
    "Salesforce Workbench",
    "Workbench",
    "Data Loader",
    "Salesforce",
    "SFDC",
    "Salesforce tools",
    "Salesforce data management",
    "SOQL query tool",
    "Salesforce Workbench alternative",
    "Data Loader alternative",
    "free Salesforce tools",
    "online Salesforce Workbench",
    "browser-based Workbench"
  ],
  authors: [{ name: "Satyajit Paul" }],
  creator: "Satyajit Paul",
  publisher: "Satyajit Paul",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://satyajitpaul.github.io/sfdcstudio/",
    title: "SFDC Studio - Salesforce Workbench & Data Loader Alternative",
    description: "Modern alternative to Salesforce Workbench and Data Loader. Fast, secure, and intuitive tool for querying and managing Salesforce data.",
    siteName: "SFDC Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "SFDC Studio - Modern Salesforce Workbench Alternative",
    description: "The best Workbench and Data Loader replacement for Salesforce developers. Query and manage data with ease.",
  },
  alternates: {
    canonical: "https://satyajitpaul.github.io/sfdcstudio/",
  },
  manifest: "/manifest.json",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
      <GoogleAnalytics gaId="G-8VNJCHMP8X" />
    </html>
  );
}