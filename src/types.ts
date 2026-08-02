export interface CompanyInput {
  value: string;
  type: 'name' | 'url';
}

export interface SearchSnippet {
  title: string;
  link: string;
  snippet: string;
  attributes?: Record<string, string>;
}

export interface SerperResult {
  officialWebsite?: string;
  phone?: string;
  address?: string;
  organic: SearchSnippet[];
  knowledgeGraph?: {
    title?: string;
    type?: string;
    website?: string;
    phone?: string;
    address?: string;
    description?: string;
    attributes?: Record<string, string>;
  };
}

export interface CrawledPage {
  title: string;
  url: string;
  category: 'home' | 'about' | 'products' | 'services' | 'solutions' | 'contact' | 'pricing' | 'other';
  content: string;
}

export interface CrawlResult {
  targetUrl: string;
  domain: string;
  discoveredUrls: string[];
  pages: CrawledPage[];
  extractedMetadata: {
    title?: string;
    description?: string;
    phone?: string;
    address?: string;
    email?: string;
    socialLinks?: string[];
  };
}

export interface CompetitorInfo {
  name: string;
  website: string;
  country?: string;
  industry?: string;
  summary?: string;
}

export interface TrendDataPoint {
  month: string;
  sentimentScore: number;
  mentionVolume: number;
  growthScore: number;
}

export interface CompanyReport {
  id: string;
  companyName: string;
  website: string;
  phoneNumber: string;
  address: string;
  summary: string;
  productsServices: string[];
  painPoints: string[];
  competitors: CompetitorInfo[];
  rawCrawledPagesCount: number;
  sources: string[];
  crawledPages?: CrawledPage[];
  timestamp: string;
  modelUsed: string;
  trendData?: TrendDataPoint[];
  socialMentionFrequency?: string;
  globalWebFootprint?: string;
  techStack?: string[];
  employeeCountEstimate?: string;
  swotAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface OpenRouterModel {
  id: string;
  name: string;
  provider: string;
  description?: string;
  contextLength?: number;
}

export interface ResearchProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  detail?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  report?: CompanyReport;
  progressSteps?: ResearchProgressStep[];
  isGenerating?: boolean;
}

export interface DiscordConfig {
  botToken: string;
  channelId: string;
  applicantName: string;
  applicantEmail: string;
}

export interface ApiKeysConfig {
  openrouterKey: string;
  serperKey: string;
  selectedModel: string;
}
