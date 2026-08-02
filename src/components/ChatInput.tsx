import React, { useState } from 'react';
import { Send, Building2, Globe, Sparkles, Command } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isLoading }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isLoading) return;
    onSubmit(value.trim());
    setValue('');
  };

  // Determine if input resembles URL or company name
  const isUrl = value.includes('.') && !value.includes(' ');

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-1.5 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none dark:focus-within:border-blue-500">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {isUrl ? (
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            ) : (
              <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>

          <input
            id="input-company-search"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isLoading}
            placeholder="Search company name (e.g. Stripe) or paste website URL (e.g. https://tesla.com)..."
            className="w-full bg-transparent px-3 py-2.5 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-hidden dark:text-slate-100 dark:placeholder-slate-500"
          />

          <button
            id="btn-submit-search"
            type="submit"
            disabled={!value.trim() || isLoading}
            className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:from-blue-700 hover:to-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            title="Start Research"
          >
            {isLoading ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Analyzing...</span>
              </>
            ) : (
              <>
                <span>Research</span>
                <Send className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Format & Mode Indicators */}
        <div className="mt-2.5 flex items-center justify-between px-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Command className="h-3 w-3 text-slate-400" /> Research Mode
            </span>
            <span>•</span>
            <span>Crawling + OpenRouter AI + Discord Sync</span>
          </div>

          {value.trim() && (
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              Detected: {isUrl ? 'Website Domain' : 'Company Name'}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
