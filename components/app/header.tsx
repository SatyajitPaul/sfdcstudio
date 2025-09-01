"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Clock, 
  Zap, 
  LogOut
} from "lucide-react";

interface SessionData {
  instanceUrl: string;
  userId: string;
  orgId: string;
  env: string;
  expiresAt: number;
}

interface HeaderProps {
  session: SessionData;
  timeRemaining: string;
  onLogout: () => void;
}

export function Header({ session, timeRemaining, onLogout }: HeaderProps) {
  const instanceHostname = useMemo(() => {
    try {
      return new URL(session.instanceUrl).hostname;
    } catch {
      return session.instanceUrl;
    }
  }, [session]);

  const isProduction = session.env === "Production";

  return (
    <header className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-6 py-3 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          {/* Make the logo clickable to redirect to dashboard */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-md hover:opacity-90 transition-opacity">
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
          </Link>
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
            onClick={onLogout} 
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
  );
}