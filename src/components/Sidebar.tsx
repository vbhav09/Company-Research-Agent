import React, { useMemo } from 'react';
import { Plus, MessageSquare, Bot, Key, Trash2, Sparkles, Cpu, ShieldCheck, Clock, RotateCw, Search, X } from 'lucide-react';
import { ApiKeysConfig, DiscordConfig, OpenRouterModel } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: Array<{ id: string; title: string; timestamp: string }>;
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onRerunQuery: (query: string) => void;
  onNewChat: () => void;
  onClearHistory: () => void;
  apiKeys: ApiKeysConfig;
  availableModels: OpenRouterModel[];
  onSelectModel: (modelId: string) => void;
  onOpenDiscordSettings: () => void;
  onOpenApiSettings: () => void;
  discordConfig: DiscordConfig;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  chatHistory,
  activeChatId,
  onSelectChat,
  onRerunQuery,
  onNewChat,
  onClearHistory,
  apiKeys,
  availableModels,
  onSelectModel,
  onOpenDiscordSettings,
  onOpenApiSettings,
  discordConfig,
}) => {
  const isDiscordReady = Boolean(discordConfig.botToken && discordConfig.channelId);

  // Derive unique search queries for quick access
  const recentSearches = useMemo(() => {
    const seen = new Set<string>();
    const list: { query: string; chatId: string }[] = [];
    for (const chat of chatHistory) {
      const cleanTitle = chat.title.trim();
      if (cleanTitle && !seen.has(cleanTitle.toLowerCase())) {
        seen.add(cleanTitle.toLowerCase());
        list.push({ query: cleanTitle, chatId: chat.id });
      }
    }
    return list.slice(0, 6);
  }, [chatHistory]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        id="sidebar-container"
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200/80 bg-slate-50/90 backdrop-blur-xl transition-transform duration-200 dark:border-slate-800/80 dark:bg-slate-900/95 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: New Research Primary Action + Close Sidebar Button */}
        <div className="flex items-center justify-between gap-2 p-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <button
            id="btn-sidebar-new-research"
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="group flex flex-1 items-center justify-between rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/15 transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>New Research</span>
            </div>
            <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-mono">⌘N</span>
          </button>

          <button
            id="btn-close-sidebar"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100 text-slate-600 shadow-2xs transition hover:bg-slate-200/80 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Close Sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* AI Model Selector Card */}
        <div className="px-4 py-3">
          <label className="mb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <span>LLM Model Engine</span>
            <Cpu className="h-3 w-3 text-indigo-500" />
          </label>
          <div className="relative">
            <select
              id="select-sidebar-model"
              value={apiKeys.selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2 pr-8 pl-3 text-xs font-semibold text-slate-800 shadow-2xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-hidden dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200"
            >
              {availableModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <Bot className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5">
          {/* Recent Searches Quick-Access List */}
          {recentSearches.length > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-emerald-500" />
                  Recent Searches
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Quick Re-run</span>
              </div>
              <div className="space-y-1">
                {recentSearches.map((item, idx) => (
                  <div
                    key={`recent_${idx}_${item.query}`}
                    id={`recent-search-item-${idx}`}
                    onClick={() => {
                      onSelectChat(item.chatId);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="group flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/60 px-2.5 py-1.5 text-left text-xs font-semibold shadow-2xs transition hover:border-emerald-400/80 hover:bg-emerald-50/50 dark:border-slate-800/80 dark:bg-slate-800/40 dark:hover:border-emerald-500/50 dark:hover:bg-slate-800/80 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-1">
                      <Search className="h-3 w-3 text-slate-400 shrink-0 group-hover:text-emerald-500 transition-colors" />
                      <span className="truncate text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">
                        {item.query}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRerunQuery(item.query);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-500"
                      title={`Re-run live research pipeline for "${item.query}"`}
                    >
                      <RotateCw className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Research History */}
          <div>
            <div className="mb-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span>Research History ({chatHistory.length})</span>
              {chatHistory.length > 0 && (
                <button
                  id="btn-clear-history"
                  onClick={onClearHistory}
                  className="text-slate-400 transition hover:text-red-500"
                  title="Clear History"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {chatHistory.length === 0 ? (
              <div className="my-6 rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
                <Sparkles className="mx-auto mb-2 h-5 w-5 text-indigo-400 opacity-80" />
                <p className="font-semibold text-slate-600 dark:text-slate-400">No research history</p>
                <p className="mt-0.5 text-[11px] text-slate-400">Search a company name or website URL to begin!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {chatHistory.map((chat) => {
                  const isActive = activeChatId === chat.id;
                  return (
                    <button
                      key={chat.id}
                      id={`chat-history-item-${chat.id}`}
                      onClick={() => {
                        onSelectChat(chat.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                          : 'text-slate-700 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                        <span className="truncate">{chat.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Integration Settings */}
        <div className="border-t border-slate-200 p-3 space-y-2 dark:border-slate-800">
          <button
            id="btn-sidebar-discord-settings"
            onClick={() => {
              onOpenDiscordSettings();
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex w-full items-center justify-between rounded-xl border border-indigo-200/80 bg-indigo-50/60 px-3 py-2 text-xs font-semibold text-indigo-900 transition hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <MessageSquare className="h-3.5 w-3.5" />
              </div>
              <span>Discord Integration</span>
            </div>
            {isDiscordReady ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3" /> Ready
              </span>
            ) : (
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            id="btn-sidebar-api-settings"
            onClick={() => {
              onOpenApiSettings();
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <Key className="h-3.5 w-3.5 text-blue-500" />
            <span>OpenRouter & Serper API Keys</span>
          </button>
        </div>
      </aside>
    </>
  );
};
