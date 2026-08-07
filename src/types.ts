export type ActivePage = 'home' | 'about' | 'contact' | 'privacy' | 'terms' | string; // 'string' for tool IDs like 'word-counter'

export interface Tool {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  iconName: string; // Dynamic Lucide icon key
  category: ToolCategory;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
}

export type ToolCategory = 
  | 'pdf-utilities'
  | 'image-media'
  | 'text-writing'
  | 'developer-encoding'
  | 'generators'
  | 'analyzer' 
  | 'cleaner' 
  | 'converter' 
  | 'encoding' 
  | 'generator';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  colorClass: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export function isDevSession(): boolean {
  try {
    return (
      import.meta.env.DEV || 
      (typeof window !== 'undefined' && (
        window.location.hostname.includes('localhost') || 
        window.location.hostname.includes('127.0.0.1') ||
        window.location.hostname.includes('ais-dev-') ||
        window.location.hostname.includes('ais-pre-') ||
        window.location.search.includes('dev=true')
      ))
    );
  } catch {
    return import.meta.env.DEV || false;
  }
}

export function getCleanPath(page: string): string {
  if (!page || page === 'home') return '/';
  if (page === 'privacy') return '/privacy-policy';
  if (page.startsWith('tools/')) {
    return `/${page.substring(6)}`;
  }
  return `/${page}`;
}

