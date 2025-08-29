import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">SFDC Studio</h1>
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li><a href="#" className="text-sm font-medium hover:text-primary">Features</a></li>
              <li><a href="#" className="text-sm font-medium hover:text-primary">Documentation</a></li>
              <li><a href="#" className="text-sm font-medium hover:text-primary">Support</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Modern Salesforce Workbench Alternative
            </h1>
            <p className="text-xl text-muted-foreground">
              Streamlined browser-based tool for Salesforce data management and SOQL queries
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1 w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold">Enhanced Data Loader</h3>
                  <p className="text-sm text-muted-foreground">
                    Import, export, and manage Salesforce records with improved performance
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold">Workbench Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Execute SOQL/SOSL queries and explore Salesforce schema
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold">Secure Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Direct Salesforce integration with OAuth 2.0
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold">No Installation</h3>
                  <p className="text-sm text-muted-foreground">
                    Browser-based access from any device
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Connect to Salesforce</CardTitle>
                <CardDescription>
                  Select your environment and authenticate with Salesforce
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Salesforce Environment
                  </label>
                  <Select defaultValue="production">
                    <SelectTrigger className="w-full py-6">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full py-6 text-base">
                  Login With Salesforce
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SFDC Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}