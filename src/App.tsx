import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatInput } from './components/ChatInput';
import { ProgressTracker } from './components/ProgressTracker';
import { CompanyReportCard } from './components/CompanyReportCard';
import { WelcomeHero } from './components/WelcomeHero';
import { DiscordSettingsModal } from './components/DiscordSettingsModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import ReactMarkdown from 'react-markdown';
import {
  ChatMessage,
  ApiKeysConfig,
  DiscordConfig,
  OpenRouterModel,
  ResearchProgressStep,
  CompanyReport,
} from './types';
import {
  runFullResearchPipeline,
  getOpenRouterModels,
  generateAiCompletion,
  sendDiscordNotification,
} from './services/api';
import { generateCompanyReportPDF } from './utils/pdfGenerator';
import { Bot, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // API Config State
  const [apiKeys, setApiKeys] = useState<ApiKeysConfig>(() => {
    const saved = localStorage.getItem('company_ai_api_keys');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      openrouterKey: '',
      serperKey: '',
      selectedModel: 'openai/gpt-4o-mini',
    };
  });

  // Discord Config State
  const [discordConfig, setDiscordConfig] = useState<DiscordConfig>(() => {
    const saved = localStorage.getItem('company_ai_discord_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      botToken: '',
      channelId: '',
      applicantName: 'Applicant Evaluator',
      applicantEmail: 'evaluator@example.com',
    };
  });

  const [availableModels, setAvailableModels] = useState<OpenRouterModel[]>([]);

  // Chat Conversations State
  const [chats, setChats] = useState<
    Array<{
      id: string;
      title: string;
      timestamp: string;
      messages: ChatMessage[];
      report?: CompanyReport;
    }>
  >(() => {
    const saved = localStorage.getItem('company_ai_chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProgressSteps, setCurrentProgressSteps] = useState<ResearchProgressStep[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Save Configs to LocalStorage
  useEffect(() => {
    localStorage.setItem('company_ai_api_keys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem('company_ai_discord_config', JSON.stringify(discordConfig));
  }, [discordConfig]);

  useEffect(() => {
    localStorage.setItem('company_ai_chats', JSON.stringify(chats));
  }, [chats]);

  // Load OpenRouter Models on mount
  useEffect(() => {
    getOpenRouterModels(apiKeys.openrouterKey).then((models) => {
      setAvailableModels(models);
    });
  }, [apiKeys.openrouterKey]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId, currentProgressSteps, isLoading]);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const handleNewChat = () => {
    setActiveChatId(null);
    setCurrentProgressSteps([]);
  };

  const handleClearHistory = () => {
    setChats([]);
    setActiveChatId(null);
    localStorage.removeItem('company_ai_chats');
  };

  // Submit new research or follow-up question
  const handleInputSubmit = async (inputVal: string) => {
    if (isLoading) return;

    let targetChatId = activeChatId;
    let isFollowUp = false;
    let existingReport = activeChat?.report;

    if (activeChat && existingReport) {
      isFollowUp = true;
    }

    if (!isFollowUp) {
      // Create new chat session
      const newChatId = `chat_${Date.now()}`;
      targetChatId = newChatId;

      const userMsg: ChatMessage = {
        id: `msg_user_${Date.now()}`,
        sender: 'user',
        content: inputVal,
        timestamp: new Date().toISOString(),
      };

      const newChatObj = {
        id: newChatId,
        title: inputVal,
        timestamp: new Date().toISOString(),
        messages: [userMsg],
      };

      setChats((prev) => [newChatObj, ...prev]);
      setActiveChatId(newChatId);
      setIsLoading(true);

      try {
        // Run full company research pipeline
        const { report } = await runFullResearchPipeline(inputVal, {
          openrouterKey: apiKeys.openrouterKey,
          serperKey: apiKeys.serperKey,
          model: apiKeys.selectedModel,
          onProgress: (steps) => {
            setCurrentProgressSteps(steps);
          },
        });

        // Assistant response message with report
        const assistantMsg: ChatMessage = {
          id: `msg_ast_${Date.now()}`,
          sender: 'assistant',
          content: `Here is the comprehensive intelligence report for **${report.companyName}**.`,
          timestamp: new Date().toISOString(),
          report,
        };

        setChats((prev) =>
          prev.map((c) =>
            c.id === targetChatId
              ? {
                  ...c,
                  report,
                  messages: [...c.messages, assistantMsg],
                }
              : c
          )
        );

        // Auto-post to Discord if Discord Bot Token and Channel ID are configured
        if (discordConfig.botToken && discordConfig.channelId) {
          try {
            const { base64 } = await generateCompanyReportPDF(report);
            await sendDiscordNotification({
              botToken: discordConfig.botToken,
              channelId: discordConfig.channelId,
              applicantName: discordConfig.applicantName || 'Applicant Evaluator',
              applicantEmail: discordConfig.applicantEmail || 'evaluator@example.com',
              report,
              pdfBase64: base64,
            });
          } catch (discordErr) {
            console.warn('Auto Discord notification error:', discordErr);
          }
        }
      } catch (error: any) {
        const errorMsg: ChatMessage = {
          id: `msg_err_${Date.now()}`,
          sender: 'assistant',
          content: `⚠️ Failed to complete research pipeline: ${error.message || 'Unknown error'}. Please check your connection or API keys.`,
          timestamp: new Date().toISOString(),
        };

        setChats((prev) =>
          prev.map((c) =>
            c.id === targetChatId
              ? {
                  ...c,
                  messages: [...c.messages, errorMsg],
                }
              : c
          )
        );
      } finally {
        setIsLoading(false);
        setCurrentProgressSteps([]);
      }
    } else {
      // Handle follow-up Q&A conversation about the analyzed company
      if (!targetChatId) return;

      const userMsg: ChatMessage = {
        id: `msg_user_${Date.now()}`,
        sender: 'user',
        content: inputVal,
        timestamp: new Date().toISOString(),
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === targetChatId
            ? { ...c, messages: [...c.messages, userMsg] }
            : c
        )
      );

      setIsLoading(true);

      try {
        const reportContext = existingReport
          ? `COMPANY REPORT CONTEXT:
Name: ${existingReport.companyName}
Website: ${existingReport.website}
Summary: ${existingReport.summary}
Products: ${existingReport.productsServices.join(', ')}
Pain Points: ${existingReport.painPoints.join(', ')}`
          : '';

        const aiResponse = await generateAiCompletion(
          inputVal,
          apiKeys.selectedModel,
          apiKeys.openrouterKey,
          `You are an expert corporate strategist assisting with research on this company:\n${reportContext}`
        );

        const assistantMsg: ChatMessage = {
          id: `msg_ast_${Date.now()}`,
          sender: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        };

        setChats((prev) =>
          prev.map((c) =>
            c.id === targetChatId
              ? { ...c, messages: [...c.messages, assistantMsg] }
              : c
          )
        );
      } catch (err: any) {
        const errorMsg: ChatMessage = {
          id: `msg_err_${Date.now()}`,
          sender: 'assistant',
          content: `⚠️ Error generating answer: ${err.message}`,
          timestamp: new Date().toISOString(),
        };

        setChats((prev) =>
          prev.map((c) =>
            c.id === targetChatId
              ? { ...c, messages: [...c.messages, errorMsg] }
              : c
          )
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRerunQuery = (queryText: string) => {
    setActiveChatId(null);
    setCurrentProgressSteps([]);
    handleInputSubmit(queryText);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chatHistory={chats.map((c) => ({ id: c.id, title: c.title, timestamp: c.timestamp }))}
        activeChatId={activeChatId}
        onSelectChat={(id) => setActiveChatId(id)}
        onRerunQuery={handleRerunQuery}
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
        apiKeys={apiKeys}
        availableModels={availableModels}
        onSelectModel={(modelId) => setApiKeys((prev) => ({ ...prev, selectedModel: modelId }))}
        onOpenDiscordSettings={() => setIsDiscordModalOpen(true)}
        onOpenApiSettings={() => setIsApiModalOpen(true)}
        discordConfig={discordConfig}
      />

      {/* Main Workspace Area */}
      <div className={`flex flex-1 flex-col overflow-hidden transition-all duration-200 ${isSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        {/* Navigation Header */}
        <Header
          apiKeys={apiKeys}
          discordConfig={discordConfig}
          onOpenApiSettings={() => setIsApiModalOpen(true)}
          onOpenDiscordSettings={() => setIsDiscordModalOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Scrollable Conversation Workspace */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          {!activeChat ? (
            <WelcomeHero onSelectExample={handleInputSubmit} />
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {activeChat.messages.map((msg) => (
                <div key={msg.id} className="space-y-4">
                  {/* Message Bubble */}
                  <div
                    className={`flex items-start gap-3 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/15 font-bold">
                        <Bot className="h-4.5 w-4.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm font-medium leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-md shadow-blue-500/15'
                          : 'border border-slate-200/80 bg-white/90 text-slate-800 shadow-xs backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200'
                      }`}
                    >
                      {msg.sender === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="markdown-body leading-relaxed">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>

                    {msg.sender === 'user' && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-200/80 text-slate-700 font-bold dark:bg-slate-800 dark:text-slate-300">
                        <User className="h-4.5 w-4.5" />
                      </div>
                    )}
                  </div>

                  {/* Company Report Card Embed */}
                  {msg.report && (
                    <CompanyReportCard
                      report={msg.report}
                      discordConfig={discordConfig}
                      onOpenDiscordSettings={() => setIsDiscordModalOpen(true)}
                    />
                  )}
                </div>
              ))}

              {/* Live Progress Indicators when researching */}
              {isLoading && currentProgressSteps.length > 0 && (
                <ProgressTracker steps={currentProgressSteps} />
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </main>

        {/* Bottom Input Area */}
        <ChatInput onSubmit={handleInputSubmit} isLoading={isLoading} />
      </div>

      {/* Modals */}
      <DiscordSettingsModal
        isOpen={isDiscordModalOpen}
        onClose={() => setIsDiscordModalOpen(false)}
        config={discordConfig}
        onSave={(updated) => setDiscordConfig(updated)}
      />

      <ApiSettingsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        config={apiKeys}
        onSave={(updated) => setApiKeys(updated)}
        availableModels={availableModels}
      />
    </div>
  );
}
