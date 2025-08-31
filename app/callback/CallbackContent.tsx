"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExpandIcon, Loader2 } from "lucide-react";

export default function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const savedState = sessionStorage.getItem("oauthState");
    const loginEnv = sessionStorage.getItem("loginEnv");
    const codeVerifier = sessionStorage.getItem("codeVerifier");

    if (!code || !state || state !== savedState) {
      setError("Invalid authentication response.");
      setTimeout(() => router.push("/"), 3000);
      return;
    }

    if (!codeVerifier) {
      setError("Missing code verifier. Please try logging in again.");
      setTimeout(() => router.push("/"), 3000);
      return;
    }

    fetch("/api/auth/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, env: loginEnv, codeVerifier, state }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Authentication failed");
        }
        return res.json();
      })
      .then((data) => {
        const now = Date.now();
        const expiresIn = data.expiresIn || 7200;
        const expiresAt = now + expiresIn * 1000;

        const session = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          instanceUrl: data.instanceUrl,
          userId: data.userId,
          orgId: data.orgId,
          env: loginEnv,
          loginTime: now,
          expiresAt,
          expiresIn,
        };

        sessionStorage.setItem("sfSession", JSON.stringify(session));
        ["oauthState", "loginEnv", "codeVerifier"].forEach((key) =>
          sessionStorage.removeItem(key)
        );

        router.push("/dashboard");
      })
      .catch((err) => {
        console.error("Login failed:", err);
        setError(`Authentication failed: ${err.message}`);
        setTimeout(() => router.push("/"), 5000);
      });
  }, [router, searchParams]);

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg text-red-600">Authentication Error</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <ExpandIcon className="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground mt-4">
            Redirecting to home page in a few seconds...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Completing Login</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground text-center">
          Authenticating with Salesforce. Please wait...
        </p>
      </CardContent>
    </Card>
  );
}