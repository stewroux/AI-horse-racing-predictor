export interface Horse {
  horseNumber: number;
  horseName: string;
  jockey: string;
  performance: string; // Added field for past performance
}

export interface RaceInfo {
  raceName: string;
  racecourse: string;
  distance: number;
  horses: Horse[];
}

export interface PredictedHorse {
  rank: number;
  horseName: string;
  horseNumber: number;
  confidence: string; // e.g., "High", "Medium", "Low"
  reason: string;
}

export interface PredictionResultData {
  topPicks: PredictedHorse[];
  analysis: string;
  sources?: { uri: string; title: string }[]; // Added field for web sources
}
