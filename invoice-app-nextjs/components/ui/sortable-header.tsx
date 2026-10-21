'use client';

import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';

export interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort: (key: string) => void;
  icon?: LucideIcon;
}

export function SortableHeader({
  label,
  sortKey,
  currentSortKey,
  sortDirection,
  onSort,
  icon: Icon,
}: SortableHeaderProps) {
  const isActive = currentSortKey === sortKey;

  return (
    <Button
      onClick={() => onSort(sortKey)}
      variant="ghost"
      className="h-auto p-0 font-medium text-gray-500 hover:bg-transparent hover:text-gray-900 flex items-center gap-2 group"
    >
      {Icon && <Icon className="h-4 w-4" />}
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
