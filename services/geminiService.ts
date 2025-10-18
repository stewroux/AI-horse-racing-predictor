import { GoogleGenAI } from "@google/genai";
import type { RaceInfo, PredictionResultData, PredictedHorse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generatePrompt = (raceInfo: RaceInfo): string => {
  const horseList = raceInfo.horses
    .map(
      (h) =>
        `${h.horseNumber}. ${h.horseName} (騎手: ${h.jockey})\n   - 最近の成績/状態: ${h.performance || '情報なし'}`
    )
    .join("\n");

  return `
    専門の競馬アナリストとして、以下のレース情報を基に、Web検索を活用して詳細な予測を行ってください。

    ## レース情報
    - レース名: ${raceInfo.raceName}
    - 競馬場: ${raceInfo.racecourse}
    - 距離: ${raceInfo.distance}m

    ## 出走馬
    ${horseList}

    ## あなたのタスク
    1.  最新の情報（ニュース、馬場状態、馬のコンディション、騎手の成績など）をWebで検索・分析してください。
    2.  その分析に基づいて、以下の形式で予測を生成してください。

    ## 出力形式
    絶対に以下の形式を守って、プレーンテキストで出力してください。JSONは使わないでください。

    [ANALYSIS_START]
    ここにレース全体の総合的な分析を記述してください。
    [ANALYSIS_END]

    [PICKS_START]
    馬番号 | 馬名 | 信頼度 | 理由
    --- | --- | --- | ---
    {馬番号1} | {馬名1} | {信頼度1} | {理由1}
    {馬番号2} | {馬名2} | {信頼度2} | {理由2}
    {馬番号3} | {馬名3} | {信頼度3} | {理由3}
    [PICKS_END]

    - 信頼度は「高」「中」「低」のいずれかを使用してください。
  `;
};

// Function to parse the plain text response from the AI
const parsePredictionResponse = (responseText: string, raceInfo: RaceInfo): Omit<PredictionResultData, 'sources'> => {
    const analysisMatch = responseText.match(/\[ANALYSIS_START\]([\s\S]*?)\[ANALYSIS_END\]/);
    const analysis = analysisMatch ? analysisMatch[1].trim() : "分析結果を取得できませんでした。";

    const picksMatch = responseText.match(/\[PICKS_START\]([\s\S]*?)\[PICKS_END\]/);
    const topPicks: PredictedHorse[] = [];

    if (picksMatch) {
        const picksText = picksMatch[1].trim();
        const lines = picksText.split('\n');
        // Start from index 2 to skip header and separator
        for (let i = 2; i < lines.length; i++) {
            const parts = lines[i].split('|').map(s => s.trim());
            if (parts.length === 4) {
                const horseNumber = parseInt(parts[0], 10);
                const originalHorse = raceInfo.horses.find(h => h.horseNumber === horseNumber);

                if (originalHorse) {
                    topPicks.push({
                        rank: topPicks.length + 1,
                        horseNumber: horseNumber,
                        horseName: parts[1],
                        confidence: parts[2],
                        reason: parts[3],
                    });
                }
            }
        }
    }
    
    if (topPicks.length === 0) {
        // Fallback in case parsing fails
        return { analysis: responseText, topPicks: [] };
    }

    return { analysis, topPicks };
};


export const getRacePrediction = async (
  raceInfo: RaceInfo
): Promise<PredictionResultData> => {
  try {
    const prompt = generatePrompt(raceInfo);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.5,
      },
    });

    const parsedData = parsePredictionResponse(response.text, raceInfo);
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web)
      .filter((web): web is { uri: string, title: string } => !!web && !!web.uri && !!web.title)
      .filter((web, index, self) => index === self.findIndex((w) => w.uri === web.uri)) // Deduplicate
      ?? [];

    return { ...parsedData, sources };

  } catch (error) {
    console.error("Error fetching race prediction:", error);
    if (error instanceof Error) {
        throw new Error(`AIからの予測取得に失敗しました: ${error.message}`);
    }
    throw new Error("AI予測の取得中に不明なエラーが発生しました。");
  }
};
