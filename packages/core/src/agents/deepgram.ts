/**
 * Deepgram Voice Agent - Handles conversation
 */

import { createClient, DeepgramClient } from '@deepgram/sdk';
import type { TranscriptEntry } from '../types';

export interface DeepgramConfig {
  apiKey: string;
}

export interface ConversationOptions {
  callId: string;
  objective: string;
  context?: string;
  systemPrompt?: string;
  voice?: string;
  language?: string;
  extractFields?: string[];
  maxDuration?: number;
}

export interface ConversationResult {
  durationSeconds: number;
  transcript: TranscriptEntry[];
  summary: string;
  objectiveAchieved: boolean;
  extractedData: Record<string, unknown>;
}

export class DeepgramAgent {
  private client: DeepgramClient;
  private defaultVoice = 'aura-asteria-en';
  
  constructor(config: DeepgramConfig) {
    this.client = createClient(config.apiKey);
  }

  /**
   * Handle a conversation using Deepgram's Voice Agent API
   */
  async handleConversation(options: ConversationOptions): Promise<ConversationResult> {
    const transcript: TranscriptEntry[] = [];
    const startTime = Date.now();

    // Build system prompt
    const systemPrompt = this.buildSystemPrompt(options);

    // TODO: Implement Deepgram Voice Agent connection
    // This is a placeholder for the actual implementation
    // The real implementation will:
    // 1. Connect to Deepgram Voice Agent WebSocket
    // 2. Stream audio from Twilio to Deepgram
    // 3. Stream audio from Deepgram back to Twilio
    // 4. Collect transcript
    // 5. Detect when objective is achieved
    // 6. Extract requested data

    console.log(`[Phonon] Starting conversation for call ${options.callId}`);
    console.log(`[Phonon] Objective: ${options.objective}`);
    console.log(`[Phonon] System prompt: ${systemPrompt.substring(0, 100)}...`);

    // Placeholder result
    return {
      durationSeconds: (Date.now() - startTime) / 1000,
      transcript,
      summary: 'Call completed (implementation pending)',
      objectiveAchieved: false,
      extractedData: {}
    };
  }

  /**
   * Build system prompt for the voice agent
   */
  private buildSystemPrompt(options: ConversationOptions): string {
    if (options.systemPrompt) {
      return options.systemPrompt;
    }

    let prompt = `You are a professional phone assistant making a call on behalf of a user.

OBJECTIVE: ${options.objective}

GUIDELINES:
- Be polite and professional
- Speak naturally, with appropriate pauses
- Listen carefully and respond appropriately
- Stay focused on the objective
- If you encounter a phone menu (IVR), navigate it to reach a human
- Extract any relevant information mentioned
`;

    if (options.context) {
      prompt += `\nCONTEXT: ${options.context}`;
    }

    if (options.extractFields && options.extractFields.length > 0) {
      prompt += `\n\nINFORMATION TO EXTRACT:\n`;
      options.extractFields.forEach(field => {
        prompt += `- ${field}\n`;
      });
    }

    if (options.language === 'es') {
      prompt = `Eres un asistente telefónico profesional haciendo una llamada en nombre de un usuario.

OBJETIVO: ${options.objective}

GUÍAS:
- Sé cortés y profesional
- Habla naturalmente, con pausas apropiadas
- Escucha atentamente y responde apropiadamente
- Mantente enfocado en el objetivo
- Si encuentras un menú telefónico (IVR), navégalo para llegar a un humano
- Extrae cualquier información relevante mencionada
`;

      if (options.context) {
        prompt += `\nCONTEXTO: ${options.context}`;
      }

      if (options.extractFields && options.extractFields.length > 0) {
        prompt += `\n\nINFORMACIÓN A EXTRAER:\n`;
        options.extractFields.forEach(field => {
          prompt += `- ${field}\n`;
        });
      }
    }

    return prompt;
  }

  /**
   * Get available voices
   */
  getAvailableVoices(): string[] {
    return [
      'aura-asteria-en',   // English female
      'aura-luna-en',      // English female
      'aura-stella-en',    // English female
      'aura-athena-en',    // English female
      'aura-hera-en',      // English female
      'aura-orion-en',     // English male
      'aura-arcas-en',     // English male
      'aura-perseus-en',   // English male
      'aura-angus-en',     // English male (Irish)
      'aura-orpheus-en',   // English male
      'aura-helios-en',    // English male
      'aura-zeus-en',      // English male
    ];
  }
}
