"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Database, 
  Search, 
  Upload, 
  Download, 
  Globe, 
  Users, 
  LogOut,
  Clock,
  Server,
  Shield,
  Zap,
  FileText,
  Copy,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

// Types for better TypeScript support
interface SessionData {
  instanceUrl: string;
  userId: string;
  orgId: string;
  env: string;
  expiresAt: number;
  accessToken?: string; // Note: Consider if this should be stored
}

interface Tool {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
  category?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  // All hooks must be called in the same order on every render
  // Memoized tools configuration
  const tools: Tool[] = useMemo(() => [
    {
      title: "Object Analysis",
      description: "Explore objects, fields & relationships",
      icon: Database,
      color: "bg-blue-500",
      href: "/object-analysis",
      category: "analysis"
    },
    {
      title: "SOQL Query",
      description: "Execute SOQL queries with syntax highlighting",
      icon: FileText,
      color: "bg-green-500",
      href: "/soql-query",
      category: "query"
    },
    {
      title: "SOSL Search",
      description: "Search across multiple objects efficiently",
      icon: Search,
      color: "bg-purple-500",
      href: "/sosl-search",
      category: "query"
    },
    {
      title: "Data Import",
      description: "Bulk insert, update, or delete records",
      icon: Upload,
      color: "bg-orange-500",
      href: "/data-import",
      category: "data"
    },
    {
      title: "REST Explorer",
      description: "Interactive REST API endpoint testing",
      icon: Globe,
      color: "bg-cyan-500",
      href: "/rest-explorer",
      category: "api"
    },
    {
      title: "Data Export",
      description: "Export data in CSV, JSON, and XML formats",
      icon: Download,
      color: "bg-indigo-500",
      href: "/data-export",
      category: "data"
    }
  ], []);

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

  // Handle session expiry - moved up to avoid dependency issues
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
      // Clear any other sensitive data if needed
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

  // Handle tool navigation with error handling
  const handleToolClick = useCallback((href: string, title: string) => {
    try {
      router.push(href);
    } catch (error) {
      console.error(`Error navigating to ${title}:`, error);
      toast.error(`Failed to open ${title}`);
    }
  }, [router]);

  // Memoized hostname calculation - moved here to ensure hook order
  const instanceHostname = useMemo(() => {
    if (!session) return "";
    try {
      return new URL(session.instanceUrl).hostname;
    } catch {
      return session.instanceUrl;
    }
  }, [session]);

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

  const isProduction = session.env === "Production";
  const ribbonColor = isProduction 
    ? "bg-gradient-to-r from-green-600 to-green-700" 
    : "bg-gradient-to-r from-blue-600 to-blue-700";


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Enhanced Header */}
      <header className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-6 py-3 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                SFDC Studio
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">
                Professional Salesforce Workbench
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700">
                <Server className="w-3 h-3" />
                <span className="font-medium">{instanceHostname}</span>
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs px-3 py-1 font-medium border-0 ${
                  isProduction 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200" 
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                }`}
              >
                {session.env}
              </Badge>
              <div className="flex items-center space-x-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700">
                <Clock className="w-3 h-3" />
                <span className="font-medium">{timeRemaining}</span>
              </div>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="sm" 
              className="h-9 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        {/* Enhanced Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
              <AvatarFallback className="text-sm bg-gradient-to-br from-primary/20 to-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Dashboard
              </h2>
              <p className="text-muted-foreground">
                Choose a tool to manage your Salesforce data
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Securely Connected</span>
          </div>
        </div>

        {/* Enhanced Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
          {tools.map((tool, index) => (
            <Card 
              key={`${tool.href}-${index}`}
              className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group border-0 shadow-md bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800"
              onClick={() => handleToolClick(tool.href, tool.title)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200`}>
                    <tool.icon className="w-6 h-6 " />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200 mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground capitalize">
                      {tool.category || 'tool'}
                    </span>
                    <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-primary transition-colors duration-200"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Enhanced Footer Ribbon */}
      <footer className="sticky bottom-0 z-30">
        <div className={`${ribbonColor} text-white py-3 px-4 text-sm shadow-lg`}>
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center min-w-0">
              <span className="font-medium mr-2 flex-shrink-0">Instance:</span>
              <a 
                href={session.instanceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:no-underline truncate flex-1"
                title={instanceHostname}
              >
                {instanceHostname}
              </a>
            </div>
            
            <div className="flex items-center min-w-0">
              <span className="font-medium mr-2 flex-shrink-0">User:</span>
              <span className="truncate mr-1"><a 
                href={`${session.instanceUrl}/${session.userId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                title={session.userId}
              >
                {session.userId}
              </a></span>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 hover:bg-white/20 flex-shrink-0"
                onClick={() => copyToClipboard(session.userId, "User ID")}
                title="Copy User ID"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="flex items-center min-w-0">
              <span className="font-medium mr-2 flex-shrink-0">Org:</span>
              <span className="truncate mr-1">
              <a 
                href={`${session.instanceUrl}/${session.orgId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                title={session.orgId}
              >
                {session.orgId}
              </a>
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 hover:bg-white/20 flex-shrink-0"
                onClick={() => copyToClipboard(session.orgId, "Organization ID")}
                title="Copy Organization ID"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="flex items-center min-w-0">
              <span className="font-medium mr-2 flex-shrink-0">Expires:</span>
              <span className="truncate" title={new Date(session.expiresAt).toLocaleString()}>
                {new Date(session.expiresAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}