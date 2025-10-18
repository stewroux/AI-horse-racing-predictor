import { GoogleGenAI } from "@google/genai";
import type { RaceInfo, PredictionResultData } from '../types';

// Per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function buildPrompt(raceInfo: RaceInfo): string {
  const horseList = raceInfo.horses.map(h => 
    `- 馬番${h.horseNumber}: ${h.horseName} (騎手: ${h.jockey}, 近走/情報: ${h.performance})`
  ).join('\n');

  return `
あなたはプロの競馬アナリストです。以下のレース情報に基づいて、詳細な競馬予想を生成してください。
最新のレース結果、馬のコンディション、トラックの状態などの情報をGoogle検索で調査し、その情報源を提示してください。

# レース情報
- レース名: ${raceInfo.raceName}
- 競馬場: ${raceInfo.racecourse}
- 距離: ${raceInfo.distance}m
- 出走馬リスト:
${horseList}

# 指示
1.  **トップ3の予測**: 上位3頭を予測し、それぞれの馬について以下の情報を含めてください。
    - \`rank\`: 予測順位 (1, 2, 3)
    - \`horseName\`: 馬名
    - \`horseNumber\`: 馬番
    - \`confidence\`: 予測の信頼度を「高」「中」「低」のいずれかで評価してください。
    - \`reason\`: その馬を推奨する具体的な理由（過去の成績、コース適性、騎手との相性、最近の調子など）。
2.  **レース総合分析**: レース全体の展開予測、注目点、波乱の可能性など、総合的な分析を提供してください。
3.  **出力形式**: 以下のJSON形式で、マークダウンのコードブロック内に厳密に従って出力してください。他のテキストは含めないでください。

\`\`\`json
{
  "topPicks": [
    {
      "rank": 1,
      "horseName": "馬名",
      "horseNumber": 1,
      "confidence": "高",
      "reason": "理由..."
    },
    {
      "rank": 2,
      "horseName": "馬名",
      "horseNumber": 2,
      "confidence": "中",
      "reason": "理由..."
    },
    {
      "rank": 3,
      "horseName": "馬名",
      "horseNumber": 3,
      "confidence": "低",
      "reason": "理由..."
    }
  ],
  "analysis": "総合分析..."
}
\`\`\`
`;
}

// Function to extract JSON from a string that might contain markdown backticks or other text
const extractJson = (text: string): any | null => {
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = text.match(jsonRegex);
    let jsonString = '';

    if (match && match[1]) {
        jsonString = match[1];
    } else {
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
            jsonString = text.substring(firstBrace, lastBrace + 1);
        } else {
            return null;
        }
    }
    
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Failed to parse extracted JSON string:', jsonString, error);
        return null;
    }
};

export const getRacePrediction = async (
  raceInfo: RaceInfo,
  onChunk: (chunk: string) => void
): Promise<PredictionResultData> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = buildPrompt(raceInfo);

    const streamResult = await ai.models.generateContentStream({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    let fullText = '';
    const sources: { uri: string; title: string }[] = [];
    
    for await (const chunk of streamResult) {
        // As per Gemini API guidelines, access the text content via the .text property
        const text = chunk.text;
        if (text) {
            fullText += text;
            onChunk(text);
        }
        
        const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
            for (const gChunk of groundingChunks) {
                if (gChunk.web && gChunk.web.uri) {
                    sources.push({ uri: gChunk.web.uri, title: gChunk.web.title || gChunk.web.uri });
                }
            }
        }
    }

    const parsedJson = extractJson(fullText);

    if (!parsedJson || !parsedJson.topPicks || !parsedJson.analysis) {
      throw new Error("AIからの応答を解析できませんでした。予期しない形式のデータが返されました。");
    }

    // Deduplicate sources based on URI
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

    return {
      ...parsedJson,
      sources: uniqueSources,
    };

  } catch (error) {
    console.error("Error getting race prediction:", error);
    if (error instanceof Error) {
        throw new Error(`AI予測の生成中にエラーが発生しました: ${error.message}`);
    }
    throw new Error("AI予測の生成中に不明なエラーが発生しました。");
  }
};
