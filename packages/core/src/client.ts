/**
 * Phonon Client - Main entry point
 */

import { EventEmitter } from 'events';
import type { 
  PhononConfig, 
  CallOptions, 
  CallResult, 
  CallEvent,
  CallEventHandler 
} from './types';
import { TwilioProvider } from './providers/twilio';
import { DeepgramAgent } from './agents/deepgram';

export { PhononConfig };

export class Phonon extends EventEmitter {
  private config: PhononConfig;
  private twilioProvider: TwilioProvider;
  private deepgramAgent: DeepgramAgent;

  constructor(config: PhononConfig) {
    super();
    this.config = config;
    this.twilioProvider = new TwilioProvider(config.twilio);
    this.deepgramAgent = new DeepgramAgent(config.deepgram);
  }

  /**
   * Make an outbound phone call
   * 
   * @example
   * ```typescript
   * const result = await phonon.call({
   *   to: '+56912345678',
   *   objective: 'Ask about TAG return requirements',
   *   context: 'Calling Autopista Central customer service'
   * });
   * ```
   */
  async call(options: CallOptions): Promise<CallResult> {
    const callId = this.generateCallId();
    
    this.emit('call:started', { 
      type: 'started', 
      callId, 
      timestamp: new Date() 
    });

    try {
      // Initialize the call via Twilio
      const twilioCall = await this.twilioProvider.initiateCall({
        to: options.to,
        callId,
        webhookUrl: options.webhookUrl
      });

      // Set up Deepgram Voice Agent for the conversation
      const agentResult = await this.deepgramAgent.handleConversation({
        callId,
        objective: options.objective,
        context: options.context,
        systemPrompt: options.systemPrompt,
        voice: options.voice || this.config.defaultVoice,
        language: options.language || this.config.defaultLanguage || 'es',
        extractFields: options.extractFields,
        maxDuration: options.maxDuration
      });

      this.emit('call:ended', { 
        type: 'ended', 
        callId, 
        timestamp: new Date(),
        data: agentResult
      });

      return {
        callId,
        status: 'completed',
        durationSeconds: agentResult.durationSeconds,
        transcript: agentResult.transcript,
        summary: agentResult.summary,
        objectiveAchieved: agentResult.objectiveAchieved,
        extractedData: agentResult.extractedData
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.emit('call:error', { 
        type: 'error', 
        callId, 
        timestamp: new Date(),
        data: { error: errorMessage }
      });

      return {
        callId,
        status: 'failed',
        durationSeconds: 0,
        transcript: [],
        summary: '',
        objectiveAchieved: false,
        extractedData: {},
        error: errorMessage
      };
    }
  }

  /**
   * Register an event handler
   */
  onEvent(handler: CallEventHandler): void {
    this.on('call:started', handler);
    this.on('call:ringing', handler);
    this.on('call:answered', handler);
    this.on('call:transcript', handler);
    this.on('call:ended', handler);
    this.on('call:error', handler);
  }

  /**
   * Generate a unique call ID
   */
  private generateCallId(): string {
    return `phn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
