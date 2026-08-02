import React from 'react';
import {
  Building2,
  Globe,
  Search,
  Sparkles,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Zap,
  FileCheck,
  ShieldCheck,
  Bot,
} from 'lucide-react';

interface WelcomeHeroProps {
  onSelectExample: (value: string) => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onSelectExample }) => {
  const featuredCompanies = [
    { label: 'Stripe', category: 'Fintech & Payments', icon: Building2 },
    { label: 'Tesla', category: 'EV & Automotive', icon: Building2 },
    { label: 'Microsoft', category: 'Cloud & AI', icon: Building2 },
    { label: 'https://shadi.com', category: 'E-Commerce / Matrimony', icon: Globe },
    { label: 'https://shopify.com', category: 'Commerce Infrastructure', icon: Globe },
  ];

  const capabilities = [
    {
      title: '1. Intelligent Crawling',
      desc: 'Discovers official links, bypasses WAF 403s, and extracts clean metadata.',
      icon: Search,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400',
    },
    {
      title: '2. OpenRouter Deep Analysis',
      desc: 'Synthesizes pain points, products, competitors & strategic gaps.',
      icon: Sparkles,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400',
    },
    {
      title: '3. PDF Export & Discord Push',
      desc: 'Generates executive PDF reports and syncs directly to Discord webhooks.',
      icon: FileCheck,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400',
    },
  ];

  return (
    <div className="mx-auto my-auto flex max-w-3xl flex-col items-center justify-center p-4 py-8 text-center sm:p-6">
      {/* Top Badge */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-900 shadow-2xs backdrop-blur-md dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300">
        <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>Enterprise Corporate Intelligence Platform</span>
      </div>

      <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
        Research Any Company in Seconds
      </h2>

      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Enter a company name or website URL to launch live crawling, Serper search indexing, OpenRouter AI pain point evaluation, PDF reports & Discord notifications.
      </p>

      {/* Suggested Quick Cards Grid */}
      <div className="mt-8 w-full text-left">
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Suggested Research Targets
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            <Zap className="h-3 w-3 text-amber-500" /> One-click analysis
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCompanies.map((ex, i) => {
            const Icon = ex.icon;
            return (
              <button
                key={i}
                id={`example-card-${i}`}
                onClick={() => onSelectExample(ex.label)}
                className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3.5 text-left shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-blue-500"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-blue-400">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      {ex.label}
                    </span>
                    <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {ex.category}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600 dark:text-slate-600 dark:group-hover:text-blue-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Workflow Architecture Grid */}
      <div className="mt-8 grid grid-cols-1 gap-3.5 text-left sm:grid-cols-3">
        {capabilities.map((cap, i) => {
          const Icon = cap.icon;
          return (
            <div
              key={i}
              className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 transition-all dark:border-slate-800/80 dark:bg-slate-900/40"
            >
              <div className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg ${cap.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">{cap.title}</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                {cap.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
