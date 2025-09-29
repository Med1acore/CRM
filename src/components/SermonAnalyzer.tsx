import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Brain, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

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
  const [results, setResults] = useState<RoleAnalysis[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ current: number; limit: number; month: string } | null>(null);

  // Handle analysis type change
  const handleAnalysisTypeChange = (type: AnalysisType) => {
    setAnalysisType(type);
    setError(null);
    setResults(null);
    
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
    setResults(null);

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

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
        setResults(response.analysis);
        setUsage(response.usage);
      } else if (Array.isArray(data)) {
        // Fallback for old format
        setResults(data);
      } else {
        throw new Error('Неверный формат ответа от сервера');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset function
  const handleReset = () => {
    setSermonText('');
    setAnalysisType('quick');
    setSelectedRoles(QUICK_ROLES);
    setResults(null);
    setError(null);
    setUsage(null);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Brain className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Улучшить проповедь</h3>
          <p className="text-sm text-gray-500">AI-анализ с разных точек зрения</p>
        </div>
      </div>

      {/* Usage Info */}
      {usage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">
              Использовано в {usage.month}: {usage.current}/{usage.limit}
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: usage.limit }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < usage.current ? 'bg-blue-600' : 'bg-blue-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-amber-800">Важно!</h4>
            <p className="text-sm text-amber-700 mt-1">
              Загружайте текст вашей проповеди, когда уверены в том, что он готов. 
              У вас есть ограничение: <strong>3 анализа в месяц</strong>. 
              Используйте эту возможность мудро для финальной доработки ваших проповедей.
            </p>
          </div>
        </div>
      </div>

      {/* Sermon Text Input */}
      <div className="space-y-2">
        <label htmlFor="sermon-text" className="block text-sm font-medium text-gray-700">
          Текст проповеди
        </label>
        <textarea
          id="sermon-text"
          value={sermonText}
          onChange={(e) => setSermonText(e.target.value)}
          placeholder="Введите текст проповеди для анализа..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-black"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          {sermonText.length} символов
        </p>
      </div>

      {/* Analysis Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Тип анализа
        </label>
        <div className="space-y-2">
          {[
            { value: 'quick', label: 'Быстрый анализ', description: '3 основные роли' },
            { value: 'deep', label: 'Глубокий анализ', description: '5 экспертных ролей' },
            { value: 'custom', label: 'Свой набор', description: 'Выберите роли самостоятельно' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="analysis-type"
                value={option.value}
                checked={analysisType === option.value}
                onChange={() => handleAnalysisTypeChange(option.value as AnalysisType)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                disabled={isLoading}
              />
              <div>
                <span className="text-sm font-medium text-gray-900">{option.label}</span>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Custom Roles Selection */}
      {analysisType === 'custom' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Выберите роли для анализа
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ALL_ROLES.map((role) => (
              <label key={role} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role)}
                  onChange={() => handleRoleToggle(role)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">{role}</span>
              </label>
            ))}
          </div>
          {selectedRoles.length === 0 && (
            <p className="text-xs text-red-500">Выберите хотя бы одну роль</p>
          )}
        </div>
      )}

      {/* Selected Roles Display */}
      {selectedRoles.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Выбранные роли ({selectedRoles.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedRoles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !sermonText.trim() || selectedRoles.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Улучшаем...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Улучшить
            </>
          )}
        </button>
        
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Сбросить
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Улучшаем проповедь...</p>
            <p className="text-xs text-gray-500 mt-1">Это может занять несколько секунд</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-red-800">Ошибка улучшения</h4>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {results && results.length > 0 && (
        <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <h4 className="text-lg font-semibold text-gray-900">Результаты улучшения</h4>
        </div>
          
          <div className="space-y-4">
            {results.map((analysis, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <h5 className="font-medium text-gray-900">{analysis.role}</h5>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-1">Фидбэк:</h6>
                    <p className="text-sm text-gray-600 leading-relaxed">{analysis.feedback}</p>
                  </div>
                  
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-1">Предложения по улучшению:</h6>
                    <p className="text-sm text-gray-600 leading-relaxed">{analysis.improvements}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SermonAnalyzer;
