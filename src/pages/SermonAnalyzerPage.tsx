import React from 'react';
import { SermonAnalyzer } from '../components/SermonAnalyzer';

export default function SermonAnalyzerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Улучшить проповедь
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Используйте AI для улучшения ваших проповедей с разных точек зрения
          </p>
        </div>
        
        <SermonAnalyzer />
      </div>
    </div>
  );
}
