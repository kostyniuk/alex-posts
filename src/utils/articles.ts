import { readdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export interface ArticleMetadata {
  title: string;
  publishDate: string;
  description: string;
  tags?: string[];
}

export interface ArticleData extends ArticleMetadata {
  slug: string;
  readingTime: string;
}

const articleMetadata: Record<string, ArticleMetadata> = {
  'test': {
    title: 'Sample Article: ArticleMeta Component Demo',
    publishDate: '2025-07-18',
    description: 'A demonstration of the ArticleMeta component showing how to display article metadata including title, publish date, description, and tags.',
    tags: ['component', 'demo', 'metadata']
  }
};

const htmlDir = fileURLToPath(new URL('../html-articles', import.meta.url));

function getArticleContent(slug: string): string {
  const filePath = path.join(htmlDir, `${slug}.html`);
  return readFileSync(filePath, 'utf-8');
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export async function getAllArticles(): Promise<ArticleData[]> {
  const files = await readdir(htmlDir);

  return files
    .filter(file => file.endsWith('.html'))
    .map(filename => {
      const slug = path.basename(filename, '.html');
      const metadata = articleMetadata[slug];
      
      if (!metadata) {
        throw new Error(`No metadata found for article: ${slug}. Please add it to the articleMetadata object in src/utils/articles.ts`);
      }
      
      const htmlContent = getArticleContent(slug);
      const readingTime = calculateReadingTime(htmlContent);
      
      return {
        slug,
        ...metadata,
        readingTime
      };
    })
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

export function getArticleMetadata(slug: string): ArticleData {
  const metadata = articleMetadata[slug];
  
  if (!metadata) {
    throw new Error(`No metadata found for article: ${slug}. Please add it to the articleMetadata object in src/utils/articles.ts`);
  }
  
  const htmlContent = getArticleContent(slug);
  const readingTime = calculateReadingTime(htmlContent);
  
  return {
    slug,
    ...metadata,
    readingTime
  };
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