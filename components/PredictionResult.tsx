import React from 'react';
import type { PredictionResultData, PredictedHorse } from '../types';
import TrophyIcon from './icons/TrophyIcon';
import LinkIcon from './icons/LinkIcon';

interface PredictionResultProps {
  result: PredictionResultData;
}

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'text-yellow-400 border-yellow-400';
    case 2:
      return 'text-gray-300 border-gray-300';
    case 3:
      return 'text-amber-600 border-amber-600';
    default:
      return 'text-gray-500 border-gray-500';
  }
};

const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case '高':
        return 'bg-green-500/20 text-green-300 border-green-500';
      case '中':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
      case '低':
        return 'bg-red-500/20 text-red-300 border-red-500';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500';
    }
}

const PredictedHorseCard: React.FC<{ horse: PredictedHorse }> = ({ horse }) => {
    return (
        <div className="bg-gray-800/60 p-6 rounded-lg border border-gray-700 transform transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/10">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getRankColor(horse.rank)}`}>
                        <TrophyIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{horse.horseName} <span className="text-gray-400 font-normal">#{horse.horseNumber}</span></h3>
                        <p className={`text-lg font-semibold ${getRankColor(horse.rank)}`}>予測順位: {horse.rank}位</p>
                    </div>
                </div>
                <div className={`text-sm font-bold px-3 py-1 border rounded-full ${getConfidenceColor(horse.confidence)}`}>
                    信頼度: {horse.confidence}
                </div>
            </div>
            <p className="text-gray-300 text-md">
                <span className="font-semibold text-gray-200">理由:</span> {horse.reason}
            </p>
        </div>
    )
}


const PredictionResult: React.FC<PredictionResultProps> = ({ result }) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-teal-400">
            AI予測分析
        </h2>
      
        <div className="space-y-6 mb-8">
            {result.topPicks.sort((a, b) => a.rank - b.rank).map((horse) => (
                <PredictedHorseCard key={horse.horseNumber} horse={horse} />
            ))}
        </div>

        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700 mb-8">
            <h3 className="text-xl font-semibold text-gray-200 mb-3">レース総合分析</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{result.analysis}</p>
        </div>

        {result.sources && result.sources.length > 0 && (
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold text-gray-200 mb-4">参照した情報源</h3>
                <ul className="space-y-2">
                    {result.sources.map((source, index) => (
                        <li key={index}>
                            <a 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-green-400 hover:text-green-300 hover:underline transition-colors"
                            >
                                <LinkIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{source.title || source.uri}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
};

export default PredictionResult;
