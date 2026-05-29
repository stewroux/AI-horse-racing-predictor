import React, { useState } from 'react';
import type { RaceInfo, Horse } from '../types';
import Tooltip from './Tooltip';
import InfoIcon from './icons/InfoIcon';

interface RaceInputFormProps {
  onSubmit: (raceInfo: RaceInfo) => void;
  isLoading: boolean;
}

const RaceInputForm: React.FC<RaceInputFormProps> = ({ onSubmit, isLoading }) => {
  const [raceName, setRaceName] = useState('有馬記念');
  const [racecourse, setRacecourse] = useState('中山競馬場');
  const [distance, setDistance] = useState(2500);
  const [horses, setHorses] = useState<Horse[]>([
    { horseNumber: 1, horseName: 'イクイノックス', jockey: 'C.ルメール', performance: '天皇賞(秋)1着。現役最強馬。' },
    { horseNumber: 2, horseName: 'タイトルホルダー', jockey: '横山和生', performance: '前走ジャパンカップ5着。スタミナ豊富。' },
    { horseNumber: 3, horseName: 'ジャスティンパレス', jockey: '横山武史', performance: '天皇賞(春)1着。長距離適性高い。' },
    { horseNumber: 4, horseName: 'ドウデュース', jockey: '武豊', performance: '前走ジャパンカップ4着。末脚に期待。' },
    { horseNumber: 5, horseName: 'スルーセブンシーズ', jockey: '池添謙一', performance: '宝塚記念2着。中山コース得意。' },
  ]);

  const handleHorseChange = (index: number, field: keyof Horse, value: string | number) => {
    setHorses(horses.map((horse, i) =>
      i === index ? { ...horse, [field]: value } : horse
    ));
  };

  const addHorse = () => {
    if (horses.length < 18) {
        setHorses([...horses, { horseNumber: horses.length + 1, horseName: '', jockey: '', performance: '' }]);
    }
  };

  const removeHorse = (index: number) => {
    const newHorses = horses.filter((_, i) => i !== index);
    const renumberedHorses = newHorses.map((horse, i) => ({ ...horse, horseNumber: i + 1 }));
    setHorses(renumberedHorses);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (horses.length < 2) {
      alert('出走馬を2頭以上入力してください。');
      return;
    }
    const raceInfo: RaceInfo = { raceName, racecourse, distance, horses };
    onSubmit(raceInfo);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="raceName" className="flex items-center text-sm font-medium text-gray-300 mb-1">
              レース名
              <Tooltip text="予測したいレースの正式名称を入力してください。(例: 有馬記念、日本ダービー)">
                <InfoIcon className="w-4 h-4 ml-1 text-gray-400" />
              </Tooltip>
            </label>
            <input
              type="text"
              id="raceName"
              value={raceName}
              onChange={(e) => setRaceName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 focus:ring-green-500 focus:border-green-500 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="racecourse" className="flex items-center text-sm font-medium text-gray-300 mb-1">
              競馬場
              <Tooltip text="レースが開催される競馬場の名前を入力してください。(例: 東京競馬場、中山競馬場)">
                <InfoIcon className="w-4 h-4 ml-1 text-gray-400" />
              </Tooltip>
            </label>
            <input
              type="text"
              id="racecourse"
              value={racecourse}
              onChange={(e) => setRacecourse(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 focus:ring-green-500 focus:border-green-500 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="distance" className="flex items-center text-sm font-medium text-gray-300 mb-1">
              距離 (m)
              <Tooltip text="レースの距離をメートル単位で入力します。(例: 芝2500mの場合は「2500」と入力)">
                <InfoIcon className="w-4 h-4 ml-1 text-gray-400" />
              </Tooltip>
            </label>
            <input
              type="number"
              id="distance"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 focus:ring-green-500 focus:border-green-500 transition"
              required
              min="800"
              max="9999"
              step="100"
            />
          </div>
        </div>
        
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-600 pb-2">出走馬リスト</h3>
            {horses.map((horse, index) => (
                <div key={index} className="p-4 bg-gray-900/50 rounded-md border border-gray-700">
                    <div className="grid grid-cols-12 gap-x-3 gap-y-2 items-center">
                        <div className="col-span-12 sm:col-span-1">
                            <label className="flex items-center text-xs text-gray-400">
                                馬番
                                <Tooltip text="出走馬のゼッケン番号です。">
                                    <InfoIcon className="w-3 h-3 ml-1" />
                                </Tooltip>
                            </label>
                            <input
                                type="number"
                                placeholder="#"
                                value={horse.horseNumber}
                                onChange={(e) => handleHorseChange(index, 'horseNumber', Number(e.target.value))}
                                className="w-full text-center bg-gray-800 border border-gray-600 rounded-md py-2 px-1 focus:ring-green-500 focus:border-green-500 transition"
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                             <label className="flex items-center text-xs text-gray-400">
                                馬名
                                <Tooltip text="出走する競走馬の正式名称を入力してください。">
                                    <InfoIcon className="w-3 h-3 ml-1" />
                                </Tooltip>
                            </label>
                            <input
                                type="text"
                                placeholder="馬名"
                                value={horse.horseName}
                                onChange={(e) => handleHorseChange(index, 'horseName', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 focus:ring-green-500 focus:border-green-500 transition"
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                             <label className="flex items-center text-xs text-gray-400">
                                騎手
                                <Tooltip text="その馬に騎乗する騎手のフルネームを入力してください。">
                                    <InfoIcon className="w-3 h-3 ml-1" />
                                </Tooltip>
                            </label>
                            <input
                                type="text"
                                placeholder="騎手"
                                value={horse.jockey}
                                onChange={(e) => handleHorseChange(index, 'jockey', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 focus:ring-green-500 focus:border-green-500 transition"
                            />
                        </div>
                        <div className="col-span-11 sm:col-span-4">
                            <label className="flex items-center text-xs text-gray-400">
                                過去の成績・近走の状態
                                <Tooltip text="AIの重要な予測材料になります。前走の結果、最近の調子、得意なコースなど、具体的な情報を入力するほど予測精度が向上します。(例: 天皇賞(秋)で1着、調教の動きも抜群)">
                                    <InfoIcon className="w-3 h-3 ml-1" />
                                </Tooltip>
                            </label>
                            <input
                                type="text"
                                placeholder="例: 前走1着、調子良好"
                                value={horse.performance}
                                onChange={(e) => handleHorseChange(index, 'performance', e.target.value)}
                                className="w-full bg-gray-800 border border-gray-600 rounded-md py-2 px-3 focus:ring-green-500 focus:border-green-500 transition"
                            />
                        </div>
                        <div className="col-span-1 flex items-end">
                            <button type="button" onClick={() => removeHorse(index)} className="text-red-400 hover:text-red-300 transition w-full h-10 flex items-center justify-center bg-gray-800 hover:bg-red-900/50 rounded-md border border-gray-600">
                                &times;
                            </button>
                        </div>
                    </div>
                </div>
            ))}
             <button
                type="button"
                onClick={addHorse}
                className="w-full mt-2 text-sm text-green-400 border-2 border-dashed border-gray-600 hover:border-green-500 hover:text-green-300 rounded-md py-2 transition"
                >
                + 出走馬を追加
            </button>
        </div>

        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-3 px-12 rounded-lg hover:from-green-600 hover:to-teal-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoading ? '予測中...' : 'AI予測を生成'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RaceInputForm;
