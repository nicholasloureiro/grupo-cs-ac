'use client';

import {
  FileSpreadsheet,
  Package,
  FileText,
  Receipt,
  ClipboardList,
  CheckCircle,
  XCircle,
  Download,
  X,
  Store,
  RefreshCw,
  Edit3,
} from 'lucide-react';

export {
  FileSpreadsheet,
  Package,
  FileText,
  Receipt,
  ClipboardList,
  CheckCircle,
  XCircle,
  Download,
  X,
  Store,
  RefreshCw,
  Edit3,
};

// Icon wrapper with consistent sizing and styling
interface IconProps {
  className?: string;
  size?: number;
}

export const Icons = {
  spreadsheet: ({ className = '', size = 20 }: IconProps) => (
    <FileSpreadsheet className={`text-current ${className}`} size={size} strokeWidth={1.5} />
  ),
  package: ({ className = '', size = 20 }: IconProps) => (
    <Package className={`text-current ${className}`} size={size} strokeWidth={1.5} />
  ),
  document: ({ className = '', size = 20 }: IconProps) => (
    <FileText className={`text-current ${className}`} size={size} strokeWidth={1.5} />
  ),
  receipt: ({ className = '', size = 20 }: IconProps) => (
    <Receipt className={`text-current ${className}`} size={size} strokeWidth={1.5} />
  ),
  clipboard: ({ className = '', size = 20 }: IconProps) => (
    <ClipboardList className={`text-current ${className}`} size={size} strokeWidth={1.5} />
  ),
  success: ({ className = '', size = 20 }: IconProps) => (
    <CheckCircle className={`text-current ${className}`} size={size} strokeWidth={1.5} />
  ),
  error: ({ className = '', size = 20 }: IconProps) => (
    <XCircle className={`text-current ${className}`} size={size} strokeWidth={1.5} />
  ),
  download: ({ className = '', size = 20 }: IconProps) => (
    <Download className={`text-current ${className}`} size={size} strokeWidth={1.5} />
  ),
  close: ({ className = '', size = 20 }: IconProps) => (
    <X className={`text-current ${className}`} size={size} strokeWidth={1.5} />
  ),
  store: ({ className = '', size = 20 }: IconProps) => (
    <Store className={`text-current ${className}`} size={size} strokeWidth={1.5} />
  ),
  refresh: ({ className = '', size = 20 }: IconProps) => (
    <RefreshCw className={`text-current ${className}`} size={size} strokeWidth={1.5} />
  ),
  edit: ({ className = '', size = 20 }: IconProps) => (
    <Edit3 className={`text-current ${className}`} size={size} strokeWidth={1.5} />
  ),
};
