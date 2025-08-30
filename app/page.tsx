import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Metadata } from "next";

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
};


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8" role="banner">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">SFDC Studio</h1>
          <nav className="hidden md:block" aria-label="Main Navigation">
            <ul className="flex space-x-8">
              <li>
                <a
                  href="#features"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#docs"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#support"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Support
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Modern Salesforce Workbench Alternative
            </h2>
            <p className="text-xl text-muted-foreground">
              Streamlined browser-based tool for Salesforce data management and SOQL queries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                {
                  title: "Enhanced Data Loader",
                  desc: "Import, export, and manage Salesforce records with improved performance.",
                },
                {
                  title: "Workbench Features",
                  desc: "Execute SOQL/SOSL queries and explore Salesforce schema.",
                },
                {
                  title: "Secure Authentication",
                  desc: "Direct Salesforce integration with OAuth 2.0.",
                },
                {
                  title: "No Installation",
                  desc: "Browser-based access from any device — no setup required.",
                },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div
                    className="mt-1 w-2 h-2 bg-primary rounded-full flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login Card */}
          <div className="flex justify-center">
            <Card
              className="w-full max-w-md shadow-xl"
              aria-labelledby="login-title"
            >
              <CardHeader className="text-center">
                <CardTitle id="login-title" className="text-2xl">
                  Connect to Salesforce
                </CardTitle>
                <CardDescription>
                  Select your environment and authenticate securely.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="salesforce-env" className="text-sm font-medium">
                    Salesforce Environment
                  </label>
                  <Select defaultValue="production">
                    <SelectTrigger
                      id="salesforce-env"
                      className="w-full py-6"
                      aria-label="Select Salesforce environment"
                    >
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* T&C Agreement */}
                <p className="text-sm text-center text-muted-foreground">
                  By logging in, you agree to our{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium focus:underline focus:outline-none"
                  >
                    Terms and Conditions
                  </a>.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full py-6 text-base"
                  aria-label="Sign in with Salesforce"
                >
                  Login With Salesforce
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-8 px-4 sm:px-6 lg:px-8 border-t"
        role="contentinfo"
      >
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold text-foreground">SFDC Studio</span>. All rights reserved.
        </div>
      </footer>
    </div>
  );
}