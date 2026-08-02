import React, { useState } from 'react';
import { X, Key, Bot, Save, CheckCircle2, Sparkles, Globe } from 'lucide-react';
import { ApiKeysConfig, OpenRouterModel } from '../types';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiKeysConfig;
  onSave: (config: ApiKeysConfig) => void;
  availableModels: OpenRouterModel[];
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  availableModels,
}) => {
  const [openrouterKey, setOpenrouterKey] = useState(config.openrouterKey);
  const [serperKey, setSerperKey] = useState(config.serperKey);
  const [selectedModel, setSelectedModel] = useState(config.selectedModel);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      openrouterKey: openrouterKey.trim(),
      serperKey: serperKey.trim(),
      selectedModel,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                AI & Search Provider Keys
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure OpenRouter, Serper.dev & Model Choice
              </p>
            </div>
          </div>
          <button
            id="btn-close-api-modal"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* OpenRouter API Key */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              OpenRouter API Key (Supports GPT-4o, Claude 3.5, Gemini 2.5, DeepSeek)
            </label>
            <div className="relative">
              <input
                id="input-openrouter-key"
                type="password"
                value={openrouterKey}
                onChange={(e) => setOpenrouterKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 pl-9 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <Sparkles className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Leave blank to use server default / Gemini AI fallback.
            </p>
          </div>

          {/* Serper.dev API Key */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Serper.dev Search API Key
            </label>
            <div className="relative">
              <input
                id="input-serper-key"
                type="password"
                value={serperKey}
                onChange={(e) => setSerperKey(e.target.value)}
                placeholder="Serper API Key..."
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 pl-9 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <Globe className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Provides live Google Search organic results & Knowledge Graph extraction.
            </p>
          </div>

          {/* Model Selector */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Active AI Research Model
            </label>
            <select
              id="select-api-modal-model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {availableModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
              API Settings Updated Successfully!
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              id="btn-save-api-config"
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-700 active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
