'use client';

import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort: (key: string) => void;
}

export function SortableHeader({
  label,
  sortKey,
  currentSortKey,
  sortDirection,
  onSort,
}: SortableHeaderProps) {
  const isActive = currentSortKey === sortKey;

  return (
    <Button
      onClick={() => onSort(sortKey)}
      variant="ghost"
      className="h-auto p-0 font-semibold text-gray-900 hover:bg-transparent hover:text-blue-600 flex items-center gap-1 group"
    >
      {label}
      {isActive && (
        <span className="ml-1">
          {sortDirection === 'asc' ? (
            <ArrowUp className="h-4 w-4 text-blue-600" />
          ) : (
            <ArrowDown className="h-4 w-4 text-blue-600" />
          )}
        </span>
      )}
      {!isActive && (
        <span className="ml-1 opacity-0 group-hover:opacity-50">
          <ArrowUp className="h-4 w-4 text-gray-400" />
        </span>
      )}
    </Button>
  );
}
