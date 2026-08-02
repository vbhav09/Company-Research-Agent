import React, { useState, useEffect } from 'react';
import { Bot, Key, MessageSquare, Sparkles, Menu, ShieldCheck, Sun, Moon, Cpu, Activity } from 'lucide-react';
import { ApiKeysConfig, DiscordConfig } from '../types';

interface HeaderProps {
  apiKeys: ApiKeysConfig;
  discordConfig: DiscordConfig;
  onOpenApiSettings: () => void;
  onOpenDiscordSettings: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  apiKeys,
  discordConfig,
  onOpenApiSettings,
  onOpenDiscordSettings,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const isDiscordConfigured = Boolean(discordConfig.botToken && discordConfig.channelId);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return (
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const modelShortName = apiKeys.selectedModel.split('/')[1] || apiKeys.selectedModel;

  return (
    <header id="main-app-header" className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-900/85 sm:px-6">
      <div className="flex items-center gap-3">
        {!isSidebarOpen && (
          <button
            id="btn-toggle-sidebar"
            onClick={onToggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-700 shadow-2xs transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Open Sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/10">
            <Sparkles className="h-4.5 w-4.5" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Relu Intelligence Agent
              </h1>
              <span className="hidden items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 md:inline-flex">
                <Activity className="h-2.5 w-2.5" /> v2.4 Live
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-slate-500 sm:block dark:text-slate-400">
              Company Research & Crawling Engine
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Model Badge Button */}
        <button
          id="btn-model-badge"
          onClick={onOpenApiSettings}
          className="hidden items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-blue-300 hover:bg-slate-100 sm:flex dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Cpu className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="max-w-[130px] truncate">{modelShortName}</span>
        </button>

        {/* Discord Badge Button */}
        <button
          id="btn-discord-badge"
          onClick={onOpenDiscordSettings}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
            isDiscordConfigured
              ? 'border-emerald-200 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'border-indigo-200 bg-indigo-50/80 text-indigo-800 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300'
          }`}
          title="Discord Integration Settings"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Discord</span>
          {isDiscordConfigured ? (
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          id="btn-theme-toggle"
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-700 shadow-2xs transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
          title="Toggle Dark/Light Theme"
        >
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
        </button>

        {/* API Settings Trigger Button */}
        <button
          id="btn-api-settings-trigger"
          onClick={onOpenApiSettings}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
          title="API Keys & Models Settings"
        >
          <Key className="h-3.5 w-3.5 text-blue-400" />
          <span className="hidden md:inline">API Keys</span>
        </button>
      </div>
    </header>
  );
};

