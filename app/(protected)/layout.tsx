"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/app/header";
import { Footer } from "@/components/app/footer";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

import { SessionProvider } from "@/context/SessionContext";
import { SessionData } from "@/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const calculateTimeRemaining = useCallback((expiresAt: number): string => {
    const now = Date.now();
    const diffMs = expiresAt - now;
    
    if (diffMs <= 0) return "Expired";
    
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }, []);

  const handleSessionExpiry = useCallback(() => {
    toast.error("Session expired. Please log in again.");
    sessionStorage.clear();
    router.push("/");
  }, [router]);

  const loadSession = useCallback(() => {
    try {
      const sessionRaw = sessionStorage.getItem("sfSession");
      if (!sessionRaw) {
        console.log("No session found");
        router.push("/");
        return;
      }

      const sess: SessionData = JSON.parse(sessionRaw);
      const now = Date.now();

      if (!sess.instanceUrl || !sess.userId || !sess.orgId || !sess.expiresAt) {
        console.error("Invalid session structure");
        handleSessionExpiry();
        return;
      }

      if (sess.expiresAt < now) {
        handleSessionExpiry();
        return;
      }

      setSession(sess);
      setTimeRemaining(calculateTimeRemaining(sess.expiresAt));
    } catch (error) {
      console.error("Error loading session:", error);
      handleSessionExpiry();
    } finally {
      setIsSessionLoading(false);
    }
  }, [router, calculateTimeRemaining, handleSessionExpiry]);

  const handleLogout = useCallback(() => {
    try {
      sessionStorage.clear();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      router.push("/");
    }
  }, [router]);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error(`Failed to copy ${label}`);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (!session || !isClient) return;

    const updateTimer = () => {
      const newTime = calculateTimeRemaining(session.expiresAt);
      setTimeRemaining(newTime);
      if (newTime === "Expired") handleSessionExpiry();
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [session, isClient, calculateTimeRemaining, handleSessionExpiry]);

  if (!isClient || isSessionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500" />
          <p className="text-lg font-medium">Session not found</p>
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Value provided to all children via context
  const sessionContextValue = {
    session,
    timeRemaining,
    copyToClipboard,
    handleLogout,
  };

  return (
    <SessionProvider value={sessionContextValue}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
        <Header 
          session={session} 
          timeRemaining={timeRemaining} 
          onLogout={handleLogout} 
        />
        
        <main className="flex-grow">
          {children}
        </main>

        <Footer 
          session={session} 
          onCopyUserId={() => copyToClipboard(session.userId, "User ID")}
          onCopyOrgId={() => copyToClipboard(session.orgId, "Organization ID")}
        />
      </div>
    </SessionProvider>
  );
}