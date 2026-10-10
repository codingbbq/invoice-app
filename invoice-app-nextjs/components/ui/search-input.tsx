'use client';

import { Input } from '@/components/ui/input';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  resultCount,
  totalCount,
}: SearchInputProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {value && (
          <Button
            onClick={onClear}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-100"
          >
            <X className="h-4 w-4 text-slate-400" />
          </Button>
        )}
      </div>
      {value && resultCount !== undefined && totalCount !== undefined && (
        <p className="text-sm text-slate-600 mt-2">
          Found <span className="font-semibold text-slate-900">{resultCount}</span> of{' '}
          <span className="font-semibold text-slate-900">{totalCount}</span> results
        </p>
      )}
    </div>
  );
}
