"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface SessionData {
  instanceUrl: string;
  userId: string;
  orgId: string;
  env: string;
  expiresAt: number;
}

interface FooterProps {
  session: SessionData;
  onCopyUserId: () => void;
  onCopyOrgId: () => void;
}

export function Footer({ session, onCopyUserId, onCopyOrgId }: FooterProps) {
  const isProduction = session.env === "Production";
  const ribbonColor = isProduction 
    ? "bg-gradient-to-r from-green-600 to-green-700" 
    : "bg-gradient-to-r from-blue-600 to-blue-700";

  const instanceHostname = useMemo(() => {
    try {
      return new URL(session.instanceUrl).hostname;
    } catch {
      return session.instanceUrl;
    }
  }, [session]);

  return (
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
            <span className="truncate mr-1">
              <a 
                href={`${session.instanceUrl}/${session.userId}`} 
                target="_blank" 
                rel="noopener noreferrer"
                title={session.userId}
              >
                {session.userId}
              </a>
            </span>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 hover:bg-white/20 flex-shrink-0"
              onClick={onCopyUserId}
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
              onClick={onCopyOrgId}
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
  );
}