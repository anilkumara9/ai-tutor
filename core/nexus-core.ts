import { BlockchainManager } from './blockchain-manager';

export class NexusCore {
  private blockchainManager: BlockchainManager;

  constructor(blockchainManager: BlockchainManager) {
    this.blockchainManager = blockchainManager;
  }

  async ensureUserIdentity() {
    return await this.blockchainManager.getUserDid();
  }

  static async initialize() {
    const blockchainManager = await BlockchainManager.create();
    return new NexusCore(blockchainManager);
  }
}
