/**
 * Phonon - Voice-enabled autonomous agent calls
 * 
 * A standalone library that enables AI agents to make real phone calls
 * and have autonomous conversations to complete business tasks.
 */

export { Phonon, type PhononConfig } from './client';
export { type CallOptions, type CallResult, type CallStatus } from './types';
export { TwilioProvider } from './providers/twilio';
export { DeepgramAgent } from './agents/deepgram';
