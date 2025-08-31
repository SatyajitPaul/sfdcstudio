"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const sessionRaw = sessionStorage.getItem("sfSession");
    if (!sessionRaw) {
      console.log("No session found, redirecting to home");
      router.push("/");
      return;
    }

    const sess = JSON.parse(sessionRaw);
    const now = Date.now();
    
    console.log("Session check:", {
      currentTime: new Date(now).toISOString(),
      expiresAt: new Date(sess.expiresAt).toISOString(),
      isExpired: sess.expiresAt < now,
      timeRemaining: Math.round((sess.expiresAt - now) / 1000 / 60) + " minutes"
    });
    
    if (sess.expiresAt < now) {
      alert("Session expired. Please log in again.");
      sessionStorage.clear();
      router.push("/");
      return;
    }

    setSession(sess);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear all auth data
    router.push("/");
  };

  if (!session) return <p>Redirecting...</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="bg-muted p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Session Details</h2>
        <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto max-h-60">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
      <div className="mt-6">
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
    </div>
  );
}