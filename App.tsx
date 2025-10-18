import React, { useState } from 'react';
import RaceInputForm from './components/RaceInputForm';
import PredictionResult from './components/PredictionResult';
import LoadingSpinner from './components/LoadingSpinner';
import { getRacePrediction } from './services/geminiService';
import type { RaceInfo, PredictionResultData } from './types';

const App: React.FC = () => {
  const [prediction, setPrediction] = useState<PredictionResultData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async (raceInfo: RaceInfo) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await getRacePrediction(raceInfo);
      setPrediction(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("不明なエラーが発生しました。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setPrediction(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <div 
        className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8"
        style={{
            backgroundImage: `linear-gradient(rgba(26, 32, 44, 0.9), rgba(26, 32, 44, 1)), url('https://picsum.photos/1920/1080?grayscale&blur=2&random=1')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
        }}
    >
        <header className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">
                AI競馬予想
            </span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">
            Gemini AIによる競馬予想。レース情報を入力して、AIの分析結果を確認しましょう。
            </p>
      </header>
      <main className="flex flex-col items-center justify-center">
        {!prediction && !isLoading && !error && (
            <RaceInputForm onSubmit={handlePredict} isLoading={isLoading} />
        )}

        {isLoading && <LoadingSpinner />}
        
        {error && (
            <div className="text-center bg-red-900/50 border border-red-500 p-6 rounded-lg max-w-md">
                <h2 className="text-2xl font-bold text-red-300 mb-2">エラーが発生しました</h2>
                <p className="text-red-200">{error}</p>
                <button 
                    onClick={resetState} 
                    className="mt-6 bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition"
                >
                    もう一度試す
                </button>
            </div>
        )}

        {prediction && (
            <div className="w-full flex flex-col items-center">
                <PredictionResult result={prediction} />
                <button 
                    onClick={resetState} 
                    className="mt-8 bg-green-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-green-700 transition"
                >
                    別のレースを予想する
                </button>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
