// app/callback/page.tsx
import CallbackContent from "./CallbackContent";
import { Suspense } from "react";

export default function CallbackPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Suspense
        fallback={
          <div className="flex flex-col items-center">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading...</p>
          </div>
        }
      >
        <CallbackContent />
      </Suspense>
    </div>
  );
}