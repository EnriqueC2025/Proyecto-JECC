
export enum ImageStyle {
  REALISM = 'Realismo',
  OIL = 'Óleo',
  ACADEMIC = 'Académico',
  MINIMAL = 'Mínimo'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: ImageStyle;
  timestamp: string;
}

export interface HistoryEntry {
  id: string;
  type: 'summarize' | 'correct' | 'expand' | 'variations' | 'initial';
  title: string;
  content: string;
  timestamp: string;
}

export interface EditResponse {
  action: string;
  original_text: string;
  processed_text: string | string[];
  version_history: string;
  safety_status: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'success' | 'info' | 'warning';
}

export interface NotificationSettings {
  types: {
    success: boolean;
    info: boolean;
    warning: boolean;
  };
  frequency: 'realtime' | 'summary' | 'muted';
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  credits: number;
  avatar?: string;
}
