import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import BrainIcon from './icons/BrainIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface StreamingPredictionProps {
  text: string;
}

const StreamingPrediction: React.FC<StreamingPredictionProps> = ({ text }) => {
  const [isThinkingProcessOpen, setIsThinkingProcessOpen] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8">
      <LoadingSpinner />
      <div className="w-full bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-700">
        <button
          onClick={() => setIsThinkingProcessOpen(!isThinkingProcessOpen)}
          className="w-full flex items-center justify-between text-xl font-semibold text-gray-200"
          aria-expanded={isThinkingProcessOpen}
          aria-controls="thinking-process-content"
        >
          <div className="flex items-center">
            <BrainIcon className="w-6 h-6 mr-3 text-green-400" />
            <span>AIの思考プロセス (リアルタイム)</span>
          </div>
          <ChevronDownIcon
            className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
              isThinkingProcessOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div
          id="thinking-process-content"
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isThinkingProcessOpen ? 'max-h-96 mt-4' : 'max-h-0'
          }`}
        >
          <pre className="w-full bg-gray-900/70 p-4 rounded-md border border-gray-600 text-gray-300 whitespace-pre-wrap text-sm max-h-60 overflow-y-auto">
            <code>{text || "AIからの応答を待っています..."}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default StreamingPrediction;
