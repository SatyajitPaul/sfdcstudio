"use client";

import { createContext, useContext } from "react";

import { SessionData } from "@/types"; // Adjust path as needed

// Define the context type
interface SessionContextType {
  session: SessionData;
  timeRemaining: string;
  copyToClipboard: (text: string, label: string) => Promise<void>;
  handleLogout: () => void;
}

// Create the context
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Custom hook to use the session context
export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

// Provider component
export const SessionProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SessionContextType;
}) => {
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};