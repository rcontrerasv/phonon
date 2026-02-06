/**
 * Phonon Type Definitions
 */

export interface PhononConfig {
  twilio: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;  // Your Twilio phone number
  };
  deepgram: {
    apiKey: string;
  };
  defaultVoice?: string;
  defaultLanguage?: string;
}

export interface CallOptions {
  /** Phone number to call (E.164 format: +56912345678) */
  to: string;
  
  /** Objective of the call - what the agent should accomplish */
  objective: string;
  
  /** Additional context for the conversation */
  context?: string;
  
  /** System prompt override for the LLM */
  systemPrompt?: string;
  
  /** Maximum call duration in seconds */
  maxDuration?: number;
  
  /** Voice to use for TTS */
  voice?: string;
  
  /** Language code (e.g., 'es' for Spanish) */
  language?: string;
  
  /** Data to extract from the conversation */
  extractFields?: string[];
  
  /** Callback URL for call events */
  webhookUrl?: string;
}

export interface CallResult {
  /** Unique call identifier */
  callId: string;
  
  /** Call status */
  status: CallStatus;
  
  /** Call duration in seconds */
  durationSeconds: number;
  
  /** Full transcript of the conversation */
  transcript: TranscriptEntry[];
  
  /** AI-generated summary of the call */
  summary: string;
  
  /** Whether the objective was achieved */
  objectiveAchieved: boolean;
  
  /** Extracted data based on extractFields */
  extractedData: Record<string, unknown>;
  
  /** Any errors that occurred */
  error?: string;
}

export type CallStatus = 
  | 'queued'
  | 'ringing'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'busy'
  | 'no-answer'
  | 'canceled';

export interface TranscriptEntry {
  /** Speaker: 'agent' or 'human' */
  speaker: 'agent' | 'human';
  
  /** What was said */
  text: string;
  
  /** Timestamp in seconds from call start */
  timestamp: number;
  
  /** Confidence score (0-1) for STT */
  confidence?: number;
}

export interface CallEvent {
  type: 'started' | 'ringing' | 'answered' | 'transcript' | 'ended' | 'error';
  callId: string;
  timestamp: Date;
  data?: unknown;
}

export type CallEventHandler = (event: CallEvent) => void;
