"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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


export default function HomePage() {
  const [env, setEnv] = useState("production");
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  const router = useRouter();

  useEffect(() => {
    const sessionRaw = sessionStorage.getItem("sfSession");
    if (sessionRaw) {
      console.log("No session found, redirecting to home");
      router.push("/dashboard");
      return;
    }
  }, [router]);

  const handleLogin = async () => {
    const clientId = process.env.NEXT_PUBLIC_SF_CONSUMER_KEY;
    const redirectUri = process.env.NEXT_PUBLIC_SF_REDIRECT_URI;
    const loginUrl =
      env === "production"
        ? process.env.NEXT_PUBLIC_SF_LOGIN_URL_PROD
        : process.env.NEXT_PUBLIC_SF_LOGIN_URL_SANDBOX;

    const scope = "api refresh_token";
    const state = Math.random().toString(36).substring(2);
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store securely in sessionStorage (better than localStorage for auth)
    sessionStorage.setItem("codeVerifier", codeVerifier);
    sessionStorage.setItem("oauthState", state);
    sessionStorage.setItem("loginEnv", env); // Save env for post-callback use

    const authUrl = `${loginUrl}/services/oauth2/authorize?` +
      new URLSearchParams({
        response_type: "code",
        client_id: clientId!,
        redirect_uri: redirectUri!,
        scope,
        state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      }).toString();

    window.location.href = authUrl;
  };

  function generateCodeVerifier() {
    return Array(56)
      .fill(0)
      .map(() => Math.random().toString(36).charAt(2))
      .join("");
  }

  async function generateCodeChallenge(codeVerifier: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
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
                  <Select value={env} onValueChange={setEnv}>
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
                  onClick={handleLogin}
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
          &copy; {year ?? "2025"}
          <span className="font-semibold text-foreground">SFDC Studio</span>. All rights reserved.
        </div>
      </footer>
    </div>
  );
}