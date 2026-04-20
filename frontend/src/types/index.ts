export type SourceType = 'OSINT' | 'HUMINT' | 'IMINT';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface IntelligenceRecord {
  _id: string;
  title: string;
  sourceType: SourceType;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  imageUrl?: string;
  confidence: number;
  priority: Priority;
  tags: string[];
  rawMetadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  total: number;
  osint: number;
  humint: number;
  imint: number;
}
