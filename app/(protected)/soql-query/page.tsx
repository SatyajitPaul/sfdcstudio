"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Icons
import { 
  Play, 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  ChevronDown,
  ChevronUp,
  Settings,
  Database,
  BookMarked,
  Plus,
  Filter
} from 'lucide-react';

// Types
interface SavedQuery {
  id: number;
  name: string;
  description: string;
  soql: string;
  createdAt: string;
}

interface QueryResult {
  [key: string]: any;
  rowIndex?: number;
}

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

interface FilterCondition {
  id: string;
  column: string;
  operator: 'contains' | 'equals' | 'notEquals' | 'startsWith' | 'endsWith';
  value: string;
}

interface AdvancedFilter {
  logic: 'AND' | 'OR';
  conditions: FilterCondition[];
}

// Mock SOQL suggestions
const SOQL_SUGGESTIONS = [
  'SELECT Id, Name FROM Account',
  'SELECT Id, Name, Email FROM Contact',
  'SELECT Id, Subject, Status FROM Case',
  'SELECT Id, Name, StageName, Amount FROM Opportunity',
  'SELECT Id, FirstName, LastName, Email FROM Lead',
  'SELECT Id, Name FROM User',
  'SELECT COUNT() FROM Account',
  'SELECT Id, Name FROM Account WHERE CreatedDate = TODAY',
  'SELECT Id, Name FROM Account ORDER BY Name ASC',
  'SELECT Id, Name FROM Account LIMIT 10'
];

// Mock data for demonstration
const generateMockData = (query: string): QueryResult[] => {
  const baseData: QueryResult[] = [
    { Id: '001XX000003DHP0', Name: 'Acme Corporation', Email: 'contact@acme.com', Industry: 'Technology', AnnualRevenue: 5000000, CreatedDate: '2024-01-15' },
    { Id: '001XX000003DHP1', Name: 'Global Industries', Email: 'info@global.com', Industry: 'Manufacturing', AnnualRevenue: 12000000, CreatedDate: '2024-02-20' },
    { Id: '001XX000003DHP2', Name: 'Tech Solutions Inc', Email: 'hello@techsol.com', Industry: 'Technology', AnnualRevenue: 8500000, CreatedDate: '2024-01-10' },
    { Id: '001XX000003DHP3', Name: 'Financial Services Co', Email: 'contact@finserv.com', Industry: 'Financial Services', AnnualRevenue: 15000000, CreatedDate: '2024-03-05' },
    { Id: '001XX000003DHP4', Name: 'Healthcare Plus', Email: 'info@healthplus.com', Industry: 'Healthcare', AnnualRevenue: 7500000, CreatedDate: '2024-02-28' }
  ];
  
  return baseData.map((item, index) => ({
    ...item,
    rowIndex: index + 1
  }));
};

const SOQLQueryExecutor: React.FC = () => {
  const [query, setQuery] = useState<string>('SELECT Id, Name FROM Account LIMIT 10');
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());
  const [advancedFilter, setAdvancedFilter] = useState<AdvancedFilter>({ logic: 'AND', conditions: [] });
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  
  // Dialog states
  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
  const [savedQueriesDialogOpen, setSavedQueriesDialogOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [queryName, setQueryName] = useState<string>('');
  const [queryDescription, setQueryDescription] = useState<string>('');
  const [editingQuery, setEditingQuery] = useState<SavedQuery | null>(null);

  // Load saved queries from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('soql-saved-queries');
      if (saved) {
        setSavedQueries(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load saved queries:', error);
    }
  }, []);

  // Initialize visible columns when results change
  useEffect(() => {
    if (queryResults.length > 0) {
      const columns = Object.keys(queryResults[0]);
      setVisibleColumns(new Set(columns));
    }
  }, [queryResults]);

  const saveQuery = useCallback(() => {
    if (!queryName.trim()) return;
    
    const newQuery: SavedQuery = {
      id: Date.now(),
      name: queryName,
      description: queryDescription,
      soql: query,
      createdAt: new Date().toISOString()
    };
    
    const updated = [...savedQueries, newQuery];
    setSavedQueries(updated);
    try {
      localStorage.setItem('soql-saved-queries', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save query:', error);
    }
    
    setQueryName('');
    setQueryDescription('');
    setSaveDialogOpen(false);
  }, [queryName, queryDescription, query, savedQueries]);

  const deleteQuery = useCallback((id: number) => {
    const updated = savedQueries.filter(q => q.id !== id);
    setSavedQueries(updated);
    try {
      localStorage.setItem('soql-saved-queries', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to delete query:', error);
    }
  }, [savedQueries]);

  const editQuery = useCallback((queryToEdit: SavedQuery) => {
    setEditingQuery(queryToEdit);
    setQueryName(queryToEdit.name);
    setQueryDescription(queryToEdit.description);
    setQuery(queryToEdit.soql);
    setEditDialogOpen(true);
  }, []);

  const updateQuery = useCallback(() => {
    if (!queryName.trim() || !editingQuery) return;
    
    const updated = savedQueries.map(q => 
      q.id === editingQuery.id 
        ? { ...q, name: queryName, description: queryDescription, soql: query }
        : q
    );
    
    setSavedQueries(updated);
    try {
      localStorage.setItem('soql-saved-queries', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update query:', error);
    }
    
    setQueryName('');
    setQueryDescription('');
    setEditingQuery(null);
    setEditDialogOpen(false);
  }, [queryName, queryDescription, query, savedQueries, editingQuery]);

  const executeQuery = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = generateMockData(query);
      setQueryResults(mockData);
      setCurrentPage(1);
    } catch (error) {
      console.error('Query execution failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const loadSavedQuery = useCallback((savedQuery: SavedQuery) => {
    setQuery(savedQuery.soql);
    setSavedQueriesDialogOpen(false);
  }, []);

  const handleSort = useCallback((key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const toggleColumnVisibility = useCallback((column: string) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(column)) {
      newVisible.delete(column);
    } else {
      newVisible.add(column);
    }
    setVisibleColumns(newVisible);
  }, [visibleColumns]);

  const downloadFile = useCallback((content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // Get available columns from query results
  const availableColumns = useMemo(() => {
    return queryResults.length > 0 ? Object.keys(queryResults[0]) : [];
  }, [queryResults]);

  // Add new filter condition
  const addFilterCondition = useCallback(() => {
    const newCondition: FilterCondition = {
      id: Math.random().toString(36).substr(2, 9),
      column: availableColumns[0] || '',
      operator: 'contains',
      value: ''
    };
    setAdvancedFilter(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
  }, [availableColumns]);

  // Update filter condition
  const updateFilterCondition = useCallback((id: string, field: keyof FilterCondition, value: any) => {
    setAdvancedFilter(prev => ({
      ...prev,
      conditions: prev.conditions.map(cond => 
        cond.id === id ? { ...cond, [field]: value } : cond
      )
    }));
  }, []);

  // Remove filter condition
  const removeFilterCondition = useCallback((id: string) => {
    setAdvancedFilter(prev => ({
      ...prev,
      conditions: prev.conditions.filter(cond => cond.id !== id)
    }));
  }, []);

  // Apply advanced filter logic
  const applyAdvancedFilter = useCallback((data: QueryResult[]): QueryResult[] => {
    if (advancedFilter.conditions.length === 0) return data;
    
    return data.filter(row => {
      const results = advancedFilter.conditions.map(condition => {
        const cellValue = String(row[condition.column] || '').toLowerCase();
        const filterValue = condition.value.toLowerCase();
        
        switch (condition.operator) {
          case 'equals':
            return cellValue === filterValue;
          case 'notEquals':
            return cellValue !== filterValue;
          case 'startsWith':
            return cellValue.startsWith(filterValue);
          case 'endsWith':
            return cellValue.endsWith(filterValue);
          case 'contains':
          default:
            return cellValue.includes(filterValue);
        }
      });
      
      if (advancedFilter.logic === 'AND') {
        return results.every(Boolean);
      } else {
        return results.some(Boolean);
      }
    });
  }, [advancedFilter]);

  // Process data in a single memoized computation
  const processedData = useMemo(() => {
    // Apply advanced filter first
    let filtered = applyAdvancedFilter(queryResults);
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(row => 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort data
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // Paginate data
    const totalResults = filtered.length;
    const totalPages = Math.ceil(totalResults / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return {
      filteredData: filtered,
      paginatedData: paginated,
      totalResults,
      totalPages
    };
  }, [queryResults, searchTerm, sortConfig, currentPage, pageSize, applyAdvancedFilter, advancedFilter]);

  const exportData = useCallback((format: 'csv' | 'json' | 'excel') => {
    const dataToExport = processedData.filteredData;
    const filename = `soql-results-${new Date().toISOString().split('T')[0]}`;
    
    try {
      switch (format) {
        case 'csv':
          const csv = [
            Object.keys(dataToExport[0] || {}).join(','),
            ...dataToExport.map(row => Object.values(row).join(','))
          ].join('\n');
          downloadFile(csv, `${filename}.csv`, 'text/csv');
          break;
        case 'json':
          downloadFile(JSON.stringify(dataToExport, null, 2), `${filename}.json`, 'application/json');
          break;
        case 'excel':
          // For demo purposes, we'll export as CSV with .xlsx extension
          const csvForExcel = [
            Object.keys(dataToExport[0] || {}).join(','),
            ...dataToExport.map(row => Object.values(row).join(','))
          ].join('\n');
          downloadFile(csvForExcel, `${filename}.xlsx`, 'text/csv');
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [processedData, downloadFile]);

  const visibleColumnsArray = useMemo(() => {
    return availableColumns.filter(col => visibleColumns.has(col));
  }, [availableColumns, visibleColumns]);

  const filteredSuggestions = useMemo(() => {
    return SOQL_SUGGESTIONS.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Query Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            SOQL Query Executor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Label htmlFor="query">SOQL Query</Label>
            <Textarea
              id="query"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Enter your SOQL query here..."
              className="min-h-[120px] font-mono"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <Card className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto">
                <CardContent className="p-2">
                  {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer rounded text-sm font-mono"
                      onClick={() => {
                        setQuery(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button onClick={executeQuery} disabled={isLoading}>
              <Play className="w-4 h-4 mr-2" />
              {isLoading ? 'Running...' : 'Run Query'}
            </Button>
            
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <BookMarked className="w-4 h-4 mr-2" />
                  Save Query
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save SOQL Query</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Query Name</Label>
                    <Input
                      id="name"
                      value={queryName}
                      onChange={(e) => setQueryName(e.target.value)}
                      placeholder="Enter query name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={queryDescription}
                      onChange={(e) => setQueryDescription(e.target.value)}
                      placeholder="Enter query description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="soql">SOQL Query</Label>
                    <Textarea
                      id="soql"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="font-mono"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveQuery}>Save Query</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={savedQueriesDialogOpen} onOpenChange={setSavedQueriesDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <BookMarked className="w-4 h-4 mr-2" />
                  Saved Queries
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Saved Queries</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Button 
                    onClick={() => {
                      setQueryName('');
                      setQueryDescription('');
                      setQuery('');
                      setSaveDialogOpen(true);
                    }}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Query
                  </Button>
                  
                  {savedQueries.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No saved queries found
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {savedQueries.map((savedQuery) => (
                        <div key={savedQuery.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{savedQuery.name}</h3>
                              {savedQuery.description && (
                                <p className="text-sm text-gray-600 mt-1">{savedQuery.description}</p>
                              )}
                              <div className="mt-2 text-xs font-mono bg-gray-100 p-2 rounded">
                                {savedQuery.soql}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => loadSavedQuery(savedQuery)}
                              >
                                Run
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => editQuery(savedQuery)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => deleteQuery(savedQuery.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSavedQueriesDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {queryResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Query Results</CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              {/* Search */}
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <Input
                  placeholder="Search results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>

              {/* Advanced Filter */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Advanced Filters</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Label>Logic:</Label>
                      <Select 
                        value={advancedFilter.logic} 
                        onValueChange={(value: 'AND' | 'OR') => 
                          setAdvancedFilter(prev => ({ ...prev, logic: value }))
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AND">AND</SelectItem>
                          <SelectItem value="OR">OR</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={addFilterCondition} size="sm">
                        <Plus className="w-4 h-4 mr-1" /> Add Condition
                      </Button>
                    </div>
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {advancedFilter.conditions.map((condition) => (
                        <div key={condition.id} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Label>Column</Label>
                            <Select
                              value={condition.column}
                              onValueChange={(value) => updateFilterCondition(condition.id, 'column', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableColumns.map(col => (
                                  <SelectItem key={col} value={col}>{col}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex-1">
                            <Label>Operator</Label>
                            <Select
                              value={condition.operator}
                              onValueChange={(value: any) => updateFilterCondition(condition.id, 'operator', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="contains">Contains</SelectItem>
                                <SelectItem value="equals">Equals</SelectItem>
                                <SelectItem value="notEquals">Not Equals</SelectItem>
                                <SelectItem value="startsWith">Starts With</SelectItem>
                                <SelectItem value="endsWith">Ends With</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex-1">
                            <Label>Value</Label>
                            <Input
                              value={condition.value}
                              onChange={(e) => updateFilterCondition(condition.id, 'value', e.target.value)}
                              placeholder="Enter value"
                            />
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeFilterCondition(condition.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      
                      {advancedFilter.conditions.length === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          No filter conditions added
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setAdvancedFilter({ logic: 'AND', conditions: [] })}
                    >
                      Clear All
                    </Button>
                    <Button>Apply Filters</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Column Selection */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Columns ({visibleColumns.size})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {availableColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column}
                      checked={visibleColumns.has(column)}
                      onCheckedChange={() => toggleColumnVisibility(column)}
                    >
                      {column}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Export */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => exportData('csv')}>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportData('excel')}>
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportData('json')}>
                    Export as JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Results count */}
              <Badge variant="secondary">
                {processedData.totalResults} results
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Data Table */}
            <div className="border rounded-md overflow-auto">
              <div className="min-w-full">
                {/* Table Header */}
                <div className="bg-gray-50 border-b">
                  <div className="flex">
                    {visibleColumnsArray.map((column) => (
                      <div
                        key={column}
                        className="flex-1 min-w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100"
                        onClick={() => handleSort(column)}
                      >
                        <div className="flex items-center gap-2">
                          {column}
                          {sortConfig.key === column && (
                            sortConfig.direction === 'asc' 
                              ? <ChevronUp className="w-4 h-4" />
                              : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Table Body */}
                <div className="bg-white divide-y divide-gray-200">
                  {processedData.paginatedData.length > 0 ? (
                    processedData.paginatedData.map((row, index) => (
                      <div key={index} className="flex hover:bg-gray-50">
                        {visibleColumnsArray.map((column) => (
                          <div key={column} className="flex-1 min-w-32 px-4 py-3 text-sm text-gray-900">
                            {String(row[column])}
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No data found
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pagination */}
            {processedData.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Label>Rows per page:</Label>
                  <Select 
                    value={String(pageSize)} 
                    onValueChange={(value) => setPageSize(Number(value))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {processedData.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(processedData.totalPages, p + 1))}
                    disabled={currentPage === processedData.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Query Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit SOQL Query</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Query Name</Label>
              <Input
                id="edit-name"
                value={queryName}
                onChange={(e) => setQueryName(e.target.value)}
                placeholder="Enter query name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                value={queryDescription}
                onChange={(e) => setQueryDescription(e.target.value)}
                placeholder="Enter query description"
              />
            </div>
            <div>
              <Label htmlFor="edit-soql">SOQL Query</Label>
              <Textarea
                id="edit-soql"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="font-mono"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateQuery}>Update Query</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SOQLQueryExecutor;