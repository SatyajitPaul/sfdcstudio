"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Database, 
  Search, 
  Upload, 
  Download, 
  Globe, 
  Users,
  Shield,
  FileText
} from "lucide-react";
import { toast } from "sonner";

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

  // Memoized tools configuration
  const tools: Tool[] = [
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
  ];

  // Handle tool navigation with error handling
  const handleToolClick = useCallback((href: string, title: string) => {
    try {
      router.push(href);
    } catch (error) {
      console.error(`Error navigating to ${title}:`, error);
      toast.error(`Failed to open ${title}`);
    }
  }, [router]);

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
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
                  <tool.icon className="w-6 h-6" />
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
    </div>
  );
}