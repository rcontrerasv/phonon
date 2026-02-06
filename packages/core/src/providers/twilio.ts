/**
 * Twilio Provider - Handles telephony
 */

import Twilio from 'twilio';

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export interface InitiateCallOptions {
  to: string;
  callId: string;
  webhookUrl?: string;
}

export class TwilioProvider {
  private client: Twilio.Twilio;
  private phoneNumber: string;

  constructor(config: TwilioConfig) {
    this.client = Twilio(config.accountSid, config.authToken);
    this.phoneNumber = config.phoneNumber;
  }

  /**
   * Initiate an outbound call
   */
  async initiateCall(options: InitiateCallOptions): Promise<{ sid: string }> {
    const call = await this.client.calls.create({
      to: options.to,
      from: this.phoneNumber,
      url: options.webhookUrl || this.getDefaultTwimlUrl(options.callId),
      statusCallback: options.webhookUrl 
        ? `${options.webhookUrl}/status` 
        : undefined,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      // Enable media streams for real-time audio
      // This will be connected to Deepgram
    });

    return { sid: call.sid };
  }

  /**
   * End an active call
   */
  async endCall(callSid: string): Promise<void> {
    await this.client.calls(callSid).update({ status: 'completed' });
  }

  /**
   * Get TwiML for connecting to media stream
   */
  generateMediaStreamTwiml(callId: string, websocketUrl: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="${websocketUrl}">
      <Parameter name="callId" value="${callId}"/>
    </Stream>
  </Connect>
</Response>`;
  }

  /**
   * Default TwiML URL (should be overridden in production)
   */
  private getDefaultTwimlUrl(callId: string): string {
    // In production, this should point to your webhook server
    return `https://phonon.sh/api/twiml/${callId}`;
  }
}
