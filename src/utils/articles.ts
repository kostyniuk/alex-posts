import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export interface ArticleMetadata {
  title: string;
  publishDate: string;
  description: string;
  readingTime: string;
  tags?: string[];
}

export interface ArticleData extends ArticleMetadata {
  slug: string;
}

// Define metadata for articles - SINGLE SOURCE OF TRUTH
const articleMetadata: Record<string, ArticleMetadata> = {
  'test': {
    title: 'Sample Article: ArticleMeta Component Demo',
    publishDate: '2025-07-18',
    description: 'A demonstration of the ArticleMeta component showing how to display article metadata including title, publish date, description, and tags.',
    readingTime: '3 min read',
    tags: ['component', 'demo', 'metadata']
  }
};

// Get all articles from the html-articles directory
export async function getAllArticles(): Promise<ArticleData[]> {
  const htmlDir = fileURLToPath(new URL('../html-articles', import.meta.url));
  const files = await readdir(htmlDir);

  return files
    .filter(file => file.endsWith('.html'))
    .map(filename => {
      const slug = path.basename(filename, '.html');
      const metadata = articleMetadata[slug];
      
      if (!metadata) {
        throw new Error(`No metadata found for article: ${slug}. Please add it to the articleMetadata object in src/utils/articles.ts`);
      }
      
      return {
        slug,
        ...metadata
      };
    })
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

// Get metadata for a specific article
export function getArticleMetadata(slug: string): ArticleMetadata {
  const metadata = articleMetadata[slug];
  
  if (!metadata) {
    throw new Error(`No metadata found for article: ${slug}. Please add it to the articleMetadata object in src/utils/articles.ts`);
  }
  
  return metadata;
}

// Calculate reading time from content
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Format date for display
export function formatDate(dateString: string, format: 'short' | 'long' = 'long'): string {
  const date = new Date(dateString);
  
  if (format === 'short') {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 