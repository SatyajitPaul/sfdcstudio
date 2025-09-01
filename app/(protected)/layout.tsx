"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/app/header";
import { Footer } from "@/components/app/footer";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

interface SessionData {
  instanceUrl: string;
  userId: string;
  orgId: string;
  env: string;
  expiresAt: number;
  accessToken?: string;
}

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

  // Memoized time calculation function
  const calculateTimeRemaining = useCallback((expiresAt: number): string => {
    const now = Date.now();
    const diffMs = expiresAt - now;
    
    if (diffMs <= 0) {
      return "Expired";
    }
    
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }, []);

  // Handle session expiry
  const handleSessionExpiry = useCallback(() => {
    toast.error("Session expired. Please log in again.");
    sessionStorage.clear();
    router.push("/");
  }, [router]);

  // Session management with better error handling
  const loadSession = useCallback(() => {
    try {
      const sessionRaw = sessionStorage.getItem("sfSession");
      if (!sessionRaw) {
        console.log("No session found, redirecting to home");
        router.push("/");
        return;
      }

      const sess: SessionData = JSON.parse(sessionRaw);
      const now = Date.now();
      
      // Validate session structure
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

  // Secure logout function
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

  // Secure clipboard copy with error handling
  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        toast.success(`${label} copied to clipboard`);
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      toast.error(`Failed to copy ${label}`);
    }
  }, []);

  // Initialize client-side only code
  useEffect(() => {
    setIsClient(true);
    loadSession();
  }, [loadSession]);

  // Time remaining updater
  useEffect(() => {
    if (!session || !isClient) return;

    const updateTimer = () => {
      const newTimeRemaining = calculateTimeRemaining(session.expiresAt);
      setTimeRemaining(newTimeRemaining);
      
      // Auto-logout when session expires
      if (newTimeRemaining === "Expired") {
        handleSessionExpiry();
      }
    };

    // Update immediately and then every minute
    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    
    return () => clearInterval(interval);
  }, [session, isClient, calculateTimeRemaining, handleSessionExpiry]);

  // Loading state for SSR/CSR mismatch prevention
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

  return (
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
  );
}