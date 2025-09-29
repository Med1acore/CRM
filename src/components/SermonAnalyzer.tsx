import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Brain, Loader2, AlertCircle, User, Bot } from 'lucide-react';

// Footsteps icon component
const FootstepsIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center text-blue-500`}>
    <span className="text-xs font-bold">👣</span>
  </div>
);

// Types
type AnalysisType = 'quick' | 'deep' | 'custom';

interface RoleAnalysis {
  role: string;
  feedback: string;
  improvements: string;
}

interface AnalysisResponse {
  analysis: RoleAnalysis[];
  usage: {
    current: number;
    limit: number;
    month: string;
  };
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  role?: string;
  feedback?: string;
  improvements?: string;
}

interface SermonAnalyzerProps {
  className?: string;
}

// Predefined role sets
const QUICK_ROLES = ['Теолог-догматист', 'Практический психолог-консультант', 'Критик-секулярист'];
const DEEP_ROLES = ['Теолог-догматист', 'Практический психолог-консультант', 'Критик-секулярист', 'Философ', 'Богослов'];
const ALL_ROLES = ['Теолог-догматист', 'Практический психолог-консультант', 'Критик-секулярист', 'Философ', 'Богослов', 'Историк', 'Пастор', 'Прихожанин'];

export const SermonAnalyzer: React.FC<SermonAnalyzerProps> = ({ className = '' }) => {
  // State
  const [sermonText, setSermonText] = useState<string>('');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('quick');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(QUICK_ROLES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Результаты храним в сообщениях чата; отдельное состояние не требуется
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ current: number; limit: number; month: string } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add message to chat
  const addMessage = (type: 'user' | 'ai' | 'system', content: string, role?: string, feedback?: string, improvements?: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      role,
      feedback,
      improvements
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Handle analysis type change
  const handleAnalysisTypeChange = (type: AnalysisType) => {
    setAnalysisType(type);
    setError(null);
    // no-op
    
    switch (type) {
      case 'quick':
        setSelectedRoles(QUICK_ROLES);
        break;
      case 'deep':
        setSelectedRoles(DEEP_ROLES);
        break;
      case 'custom':
        setSelectedRoles([]);
        break;
    }
  };

  // Handle role selection for custom analysis
  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  // Main analysis function
  const handleAnalyze = async () => {
    if (!sermonText.trim()) {
      setError('Пожалуйста, введите текст проповеди');
      return;
    }

    if (selectedRoles.length === 0) {
      setError('Пожалуйста, выберите хотя бы одну роль для анализа');
      return;
    }

    setIsLoading(true);
    setError(null);
    // no-op
    setIsTyping(true);

    // Add moderator message first
    addMessage('ai', `🤖 Консилиум начал работу. Получен текст проповеди. Начинаю анализ с точки зрения выбранных ролей: ${selectedRoles.join(', ')}.`, 'Михаил Владимирович');

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      // Check if function is available
      console.log('Attempting to call improve-sermon function...');
      
      const { data, error: functionError } = await supabase.functions.invoke('improve-sermon', {
        body: {
          sermonText: sermonText.trim(),
          roles: selectedRoles
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Ошибка при вызове функции анализа');
      }

      // Handle new response format with usage info
      if (data && typeof data === 'object' && 'analysis' in data) {
        const response = data as AnalysisResponse;
        // no-op: выводим напрямую в чат
        setUsage(response.usage);
        
        // Add AI messages to chat with staggered timing
        response.analysis.forEach((analysis, index) => {
          setTimeout(() => {
            addMessage('ai', `📝 Анализ завершен`, analysis.role, analysis.feedback, analysis.improvements);
          }, (index + 1) * 2000); // 2 seconds between each role
        });
      } else if (Array.isArray(data)) {
        // Fallback for old format
        // no-op: выводим напрямую в чат
        data.forEach((analysis, index) => {
          setTimeout(() => {
            addMessage('ai', `📝 Анализ завершен`, analysis.role, analysis.feedback, analysis.improvements);
          }, (index + 1) * 2000);
        });
      } else {
        throw new Error('Неверный формат ответа от сервера');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      
      // More detailed error handling
      if (err instanceof Error) {
        if (err.message.includes('Failed to send a request to the Edge Function')) {
          setError('Функция анализа недоступна. Проверьте подключение к интернету или обратитесь к администратору.');
        } else if (err.message.includes('Превышен лимит')) {
          setError(err.message);
        } else if (err.message.includes('Google AI API')) {
          setError('Ошибка AI сервиса. Попробуйте позже.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Произошла неизвестная ошибка');
      }
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Reset function
  // reset helper (не используется в текущем UI)
  // const handleReset = () => {
  //   setSermonText('');
  //   setAnalysisType('quick');
  //   setSelectedRoles(QUICK_ROLES);
  //   setError(null);
  //   setUsage(null);
  //   setMessages([]);
  // };

  return (
    <div className={`flex h-full max-h-[800px] bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Left Panel - Input */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col">
        {/* Input Panel Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 pt-sans-bold">Ввод проповеди</h3>
              <p className="text-sm text-gray-500 pt-sans-regular">Подготовьте текст для анализа</p>
            </div>
          </div>
        </div>

        {/* Input Content */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-amber-700 pt-sans-regular">
                  <span className="pt-sans-bold">Важно:</span> Загружайте текст, когда он готов. 
                  Ограничение: <span className="pt-sans-bold">3 анализа в месяц</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Sermon Text Input */}
          <div className="space-y-2">
            <label htmlFor="sermon-text" className="block text-sm font-medium text-gray-700 pt-sans-bold">
              Текст проповеди
            </label>
            <textarea
              id="sermon-text"
              value={sermonText}
              onChange={(e) => setSermonText(e.target.value)}
              placeholder="Введите текст проповеди для анализа..."
              className="w-full h-40 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black placeholder-gray-500 pt-sans-regular"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="pt-sans-regular">{sermonText.length} символов</span>
              {usage && (
                <span className="pt-sans-regular">Использовано: {usage.current}/{usage.limit}</span>
              )}
            </div>
          </div>

          {/* Analysis Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 pt-sans-bold">
              Тип анализа
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'quick', label: 'Быстрый', description: '3 роли' },
                { value: 'deep', label: 'Глубокий', description: '5 ролей' },
                { value: 'custom', label: 'Свой', description: 'Выбор' }
              ].map((option) => (
                <label key={option.value} className="flex flex-col items-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="analysis-type"
                    value={option.value}
                    checked={analysisType === option.value}
                    onChange={() => handleAnalysisTypeChange(option.value as AnalysisType)}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <span className={`text-sm font-medium pt-sans-bold ${analysisType === option.value ? 'text-blue-600' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                  <span className="text-xs text-gray-500 pt-sans-regular">{option.description}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Roles Selection */}
          {analysisType === 'custom' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 pt-sans-bold">
                Выберите роли
              </label>
              <div className="grid grid-cols-1 gap-2">
                {ALL_ROLES.map((role) => (
                  <label key={role} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-700 pt-sans-regular">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Selected Roles Display */}
          {selectedRoles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 pt-sans-bold">
                  Выбранные роли ({selectedRoles.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedRoles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 pt-sans-regular"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !sermonText.trim() || selectedRoles.length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium pt-sans-bold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="pt-sans-regular">Анализируем...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span className="pt-sans-bold">Начать анализ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="w-1/2 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="p-2 bg-white/20 rounded-full">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold pt-sans-bold">Консилиум экспертов</h3>
            <p className="text-sm text-blue-100 pt-sans-regular">AI-анализ проповедей</p>
          </div>
          <div className="ml-auto">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Bot className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium pt-sans-bold">Добро пожаловать!</p>
              <p className="text-sm text-center max-w-sm pt-sans-regular">
                Введите текст проповеди слева и нажмите "Начать анализ". 
                Консилиум экспертов поможет улучшить вашу проповедь.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                    {message.role === 'Михаил Владимирович' ? (
                      <img 
                        src="/fonts/mikhail-avatar.webp" 
                        alt="Михаил Владимирович" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-blue-600 pt-sans-bold">{message.role}</span>
                        {message.role === 'Михаил Владимирович' && (
                          <FootstepsIcon className="w-5 h-5 text-blue-500 ml-1" />
                        )}
                      </div>
                    )}
                    <span className="text-xs opacity-70 pt-sans-regular">
                      {message.timestamp.toLocaleTimeString('ru-RU', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <p className="text-sm whitespace-pre-wrap pt-sans-regular">{message.content}</p>
                  
                  {message.feedback && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-600 mb-1 pt-sans-bold">Фидбэк:</p>
                      <p className="text-sm text-gray-700 pt-sans-regular">{message.feedback}</p>
                    </div>
                  )}
                  
                  {message.improvements && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-600 mb-1 pt-sans-bold">Улучшения:</p>
                      <p className="text-sm text-gray-700 pt-sans-regular">{message.improvements}</p>
                    </div>
                  )}
                </div>
                
                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src="/fonts/mikhail-avatar.webp" 
                  alt="Михаил Владимирович" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 pt-sans-regular">Консилиум анализирует...</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mx-4 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800 pt-sans-bold">Ошибка</h4>
                <p className="text-sm text-red-700 mt-1 pt-sans-regular">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SermonAnalyzer;
