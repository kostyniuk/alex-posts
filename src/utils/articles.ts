import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFileSync } from 'node:fs';

export interface ArticleMetadata {
  title: string;
  publishDate: string;
  description: string;
  readingTime?: string;
  tags?: string[];
}

export interface ArticleData extends ArticleMetadata {
  slug: string;
}

const articleMetadata: Record<string, ArticleMetadata> = {
  'test': {
    title: 'Sample Article: ArticleMeta Component Demo',
    publishDate: '2025-07-18',
    description: 'A demonstration of the ArticleMeta component showing how to display article metadata including title, publish date, description, and tags.',
    tags: ['component', 'demo', 'metadata']
  }
};

export async function getAllArticles(): Promise<ArticleData[]> {
  const htmlDir = fileURLToPath(new URL('../html-articles', import.meta.url));
  const files = await readdir(htmlDir);

  return files
    .filter(file => file.endsWith('.html'))
    .map(filename => {
      const slug = path.basename(filename, '.html');
      const filePath = path.join(htmlDir, filename);
      const htmlContent = readFileSync(filePath, 'utf-8');
      const metadata = articleMetadata[slug];
      
      if (!metadata) {
        throw new Error(`No metadata found for article: ${slug}. Please add it to the articleMetadata object in src/utils/articles.ts`);
      }
      
      // Calculate reading time from actual content
      const readingTime = calculateReadingTime(htmlContent);
      
      return {
        slug,
        ...metadata,
        readingTime
      };
    })
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

export function getArticleMetadata(slug: string): ArticleMetadata {
  const metadata = articleMetadata[slug];
  
  if (!metadata) {
    throw new Error(`No metadata found for article: ${slug}. Please add it to the articleMetadata object in src/utils/articles.ts`);
  }
  
  // Read the actual content to calculate reading time
  const htmlDir = fileURLToPath(new URL('../html-articles', import.meta.url));
  const filePath = path.join(htmlDir, `${slug}.html`);
  const htmlContent = readFileSync(filePath, 'utf-8');
  const readingTime = calculateReadingTime(htmlContent);
  
  return {
    ...metadata,
    readingTime
  };
}

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

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