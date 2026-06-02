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

export type ToolCategory = 'analyzer' | 'cleaner' | 'converter';

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
