import React, { useState } from 'react';
import { X, MessageSquare, Save, CheckCircle2, AlertCircle, Send, User, Mail, ShieldCheck } from 'lucide-react';
import { DiscordConfig } from '../types';

interface DiscordSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DiscordConfig;
  onSave: (config: DiscordConfig) => void;
}

export const DiscordSettingsModal: React.FC<DiscordSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [botToken, setBotToken] = useState(config.botToken);
  const [channelId, setChannelId] = useState(config.channelId);
  const [applicantName, setApplicantName] = useState(config.applicantName || 'Applicant Evaluator');
  const [applicantEmail, setApplicantEmail] = useState(config.applicantEmail || 'evaluator@example.com');

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      botToken: botToken.trim(),
      channelId: channelId.trim(),
      applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.trim(),
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Discord Integration Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure Bot Token, Channel ID & Applicant details
              </p>
            </div>
          </div>
          <button
            id="btn-close-discord-modal"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Section: Applicant Details */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-indigo-500" /> Applicant Details
            </h4>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Applicant Name
              </label>
              <div className="relative">
                <input
                  id="input-applicant-name"
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Applicant Email Address
              </label>
              <div className="relative">
                <input
                  id="input-applicant-email"
                  type="email"
                  required
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  placeholder="e.g. john@example.com"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Section: Discord Credentials */}
          <div className="rounded-xl border border-indigo-200/80 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20 space-y-3">
            <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" /> Discord Bot Configuration
            </h4>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Discord Bot Token
              </label>
              <input
                id="input-discord-bot-token"
                type="password"
                required
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="Paste Discord Bot Token here..."
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Discord Channel ID
              </label>
              <input
                id="input-discord-channel-id"
                type="text"
                required
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="Paste Discord Channel ID here..."
                className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
              Discord Settings Saved Successfully!
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
              id="btn-save-discord-config"
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
