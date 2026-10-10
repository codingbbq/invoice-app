import { useState, useMemo } from 'react';

export interface SearchConfig<T> {
  searchFields: (keyof T)[];
  data: T[];
}

export interface SearchResult<T> {
  items: T[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  resultCount: number;
}

export function useSearch<T>({ searchFields, data }: SearchConfig<T>): SearchResult<T> {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase();

    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) {
          return false;
        }
        return String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchFields]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return {
    items: filteredItems,
    searchQuery,
    setSearchQuery,
    clearSearch,
    resultCount: filteredItems.length,
  };
}
