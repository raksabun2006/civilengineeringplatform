import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No records found',
  description = 'There is currently no data available to display.',
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-200">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-4 border border-slate-100">
        {icon || <FolderOpen className="h-7 w-7 text-slate-400" />}
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="default" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

