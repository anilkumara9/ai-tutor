import { NexusCore } from './core/nexus-core';

async function initializeNexus() {
  try {
    const nexus = await NexusCore.initialize();
    return nexus;
  } catch (error) {
    console.error('Failed to initialize Nexus:', error);
    throw error;
  }
}
