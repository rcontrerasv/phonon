/**
 * Basic Phonon Example - Make a phone call
 * 
 * Before running:
 * 1. Set up Twilio account and get credentials
 * 2. Set up Deepgram account and get API key
 * 3. Set environment variables (see below)
 */

import { Phonon } from '@phonon/core';

// Load from environment variables
const phonon = new Phonon({
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID!,
    authToken: process.env.TWILIO_AUTH_TOKEN!,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER!,  // Your Twilio number
  },
  deepgram: {
    apiKey: process.env.DEEPGRAM_API_KEY!,
  },
  defaultLanguage: 'es',  // Spanish
});

// Listen for events
phonon.onEvent((event) => {
  console.log(`[${event.type}] ${event.callId}`, event.data || '');
});

async function main() {
  console.log('🎙️ Phonon - Making a test call...\n');

  const result = await phonon.call({
    to: '+56912345678',  // Number to call
    objective: 'Preguntar cuáles son los requisitos para devolver un TAG de autopista',
    context: 'Llamando a servicio al cliente de Autopista Central',
    extractFields: [
      'documentos_requeridos',
      'horario_atencion',
      'direccion_oficina',
      'costo_tramite'
    ],
    language: 'es',
    maxDuration: 300,  // 5 minutes max
  });

  console.log('\n📞 Call Result:');
  console.log('================');
  console.log(`Status: ${result.status}`);
  console.log(`Duration: ${result.durationSeconds}s`);
  console.log(`Objective achieved: ${result.objectiveAchieved}`);
  console.log(`\nSummary:\n${result.summary}`);
  
  if (Object.keys(result.extractedData).length > 0) {
    console.log('\nExtracted Data:');
    console.log(JSON.stringify(result.extractedData, null, 2));
  }

  if (result.transcript.length > 0) {
    console.log('\nTranscript:');
    result.transcript.forEach(entry => {
      console.log(`[${entry.speaker}] ${entry.text}`);
    });
  }

  if (result.error) {
    console.error(`\n❌ Error: ${result.error}`);
  }
}

main().catch(console.error);
