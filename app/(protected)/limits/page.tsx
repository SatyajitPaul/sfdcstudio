

"use client";

import { useSession } from "@/context/SessionContext";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, BarChart3, Database, RefreshCw, TrendingUp, Users, Zap } from "lucide-react";

interface LimitData {
    Max: number;
    Remaining: number;
}

interface LimitsResponse {
    [key: string]: LimitData;
}

export default function LimitsPage() {
    const { session } = useSession();
    const [limitsData, setLimitsData] = useState<LimitsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchLimits = async () => {
        if (!session?.accessToken) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/salesforce/limits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ session }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API error: ${response.status}`);
            }

            const data = await response.json();
            setLimitsData(data);
        } catch (err: any) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLimits();
    }, [session?.accessToken]);

    const getUsagePercentage = (limit: LimitData): number => {
        if (limit.Max === 0) return 0;
        return Math.round(((limit.Max - limit.Remaining) / limit.Max) * 100);
    };

    const getUsageStatus = (percentage: number): { color: string; label: string } => {
        if (percentage >= 90) return { color: "destructive", label: "Critical" };
        if (percentage >= 75) return { color: "secondary", label: "High" };
        if (percentage >= 50) return { color: "outline", label: "Medium" };
        return { color: "default", label: "Low" };
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const getCategoryIcon = (limitName: string) => {
        const name = limitName.toLowerCase();
        if (name.includes('api') || name.includes('callout')) return <Zap className="w-5 h-5" />;
        if (name.includes('data') || name.includes('storage')) return <Database className="w-5 h-5" />;
        if (name.includes('user') || name.includes('license')) return <Users className="w-5 h-5" />;
        if (name.includes('report') || name.includes('dashboard')) return <BarChart3 className="w-5 h-5" />;
        return <TrendingUp className="w-5 h-5" />;
    };

    const formatLimitName = (name: string): string => {
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    };

    const criticalLimits = limitsData ? Object.entries(limitsData).filter(([_, limit]) =>
        getUsagePercentage(limit) >= 75
    ) : [];

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-red-800">Error Loading Limits</h3>
                                    <p className="text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                            <Button
                                onClick={fetchLimits}
                                className="mt-4"
                                variant="outline"
                                disabled={loading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Organization Limits
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Monitor your Salesforce org's resource usage and limits
                        </p>
                    </div>
                    <Button
                        onClick={fetchLimits}
                        variant="outline"
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {/* Critical Limits Alert */}
                {criticalLimits.length > 0 && (
                    <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                                <AlertCircle className="w-5 h-5" />
                                Critical Limits Alert
                            </CardTitle>
                            <CardDescription className="text-amber-700 dark:text-amber-300">
                                {criticalLimits.length} limit{criticalLimits.length > 1 ? 's' : ''} approaching capacity
                            </CardDescription>
                        </CardHeader>
                    </Card>
                )}

                {/* Loading State */}
                {loading && !limitsData && (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="text-sm text-muted-foreground">Loading organization limits...</p>
                        </div>
                    </div>
                )}

                {/* Limits Grid */}
                {limitsData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(limitsData).map(([limitName, limitData]) => {
                            const usagePercentage = getUsagePercentage(limitData);
                            const usageStatus = getUsageStatus(usagePercentage);
                            const used = limitData.Max - limitData.Remaining;

                            return (
                                <Card key={limitName} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    {getCategoryIcon(limitName)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-sm font-medium leading-tight">
                                                        {formatLimitName(limitName)}
                                                    </CardTitle>
                                                </div>
                                            </div>
                                            <Badge variant={usageStatus.color as any} className="ml-2 flex-shrink-0">
                                                {usageStatus.label}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <div className="space-y-3">
                                            {/* Usage Bar */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Usage</span>
                                                    <span className="font-medium">{usagePercentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all ${usagePercentage >= 90
                                                                ? 'bg-red-500'
                                                                : usagePercentage >= 75
                                                                    ? 'bg-yellow-500'
                                                                    : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div>
                                                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                                        {formatNumber(used)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">Used</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                        {formatNumber(limitData.Remaining)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">Available</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                                                        {formatNumber(limitData.Max)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">Total</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !limitsData && !error && (
                    <div className="text-center py-12">
                        <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            No Limits Data
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Unable to load organization limits at this time.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
