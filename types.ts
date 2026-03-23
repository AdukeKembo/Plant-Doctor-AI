
export interface PlantAnalysis {
  diseaseName: string;
  confidence: 'High' | 'Medium' | 'Low' | 'Uncertain';
  description: string;
  treatment: string[];
  prevention: string[];
}

export enum AppStatus {
  IDLE,
  UPLOADING_IMAGE,
  RECORDING_AUDIO,
  ANALYZING,
  SUCCESS,
  ERROR,
}

export type LanguageCode = 'en' | 'sw' | 'fr' | 'ar' | 'de' | 'hi' | 'es' | 'it';