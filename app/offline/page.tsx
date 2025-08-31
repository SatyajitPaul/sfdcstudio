'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function OfflinePage() {

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Offline Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>No Internet Connection</AlertTitle>
            <AlertDescription>
              You are currently offline. We’ll take you back home once you're back online.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </main>
  )
}
