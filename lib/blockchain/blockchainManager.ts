import { ethers } from "ethers";
import SSIService from "./identity/ssi";
import LivingCredentialService from "./credentials/livingCredential";
import KnowledgeTokenService from "./token/knowledgeToken";
import { initializeIPFS } from "./ipfs";

/**
 * Blockchain Manager
 * Coordinates all blockchain-related services and provides a unified interface
 * for interacting with the blockchain components of OmniLearn Nexus
 */
export class BlockchainManager {
  private static instance: BlockchainManager;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private userAddress: string | null = null;
  private initialized: boolean = false;

  // Services
  private ssiService: SSIService;
  private livingCredentialService: LivingCredentialService;
  private knowledgeTokenService: KnowledgeTokenService;

  private constructor() {
    this.ssiService = SSIService.getInstance();
    this.livingCredentialService = LivingCredentialService.getInstance();
    this.knowledgeTokenService = KnowledgeTokenService.getInstance();
  }

  /**
   * Get singleton instance of BlockchainManager
   */
  public static getInstance(): BlockchainManager {
    if (!BlockchainManager.instance) {
      BlockchainManager.instance = new BlockchainManager();
    }
    return BlockchainManager.instance;
  }

  /**
   * Initialize the Blockchain Manager and all related services
   */
  public async initialize(): Promise<void> {
    try {
      // For demo purposes, we'll use a mock implementation
      console.log("Using mock blockchain implementation for demo");

      // Create a completely mocked provider and signer instead of trying to connect to a real node
      // This avoids the "Failed to fetch" error when no local Ethereum node is running
      const mockWallet = ethers.Wallet.createRandom();
      this.userAddress = mockWallet.address;

      // Set initialized state without actually connecting to any provider
      this.provider = null;
      this.signer = mockWallet;

      // Initialize IPFS
      await initializeIPFS();

      // Initialize services in mock mode
      // Make sure to initialize the SSI service first as it's critical
      try {
        this.ssiService.mockInitialize();
        console.log("SSI service mock initialized successfully");
      } catch (ssiError) {
        console.error("Failed to initialize SSI service:", ssiError);
        // Create a fallback mock DID to prevent errors
        this.ssiService.mockInitialize();
      }

      // Initialize other services
      this.livingCredentialService.mockInitialize();
      this.knowledgeTokenService.mockInitialize();

      this.initialized = true;
      console.log(
        "Blockchain Manager initialized successfully with mock implementation"
      );
    } catch (error) {
      console.error("Failed to initialize Blockchain Manager:", error);
      // Don't throw error in demo mode, just log it
      this.initialized = true; // Force initialized state for demo
    }
  }

  /**
   * Check if the Blockchain Manager is initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get the user's Ethereum address
   */
  public getUserAddress(): string | null {
    return this.userAddress;
  }

  /**
   * Get the user's DID (Decentralized Identifier)
   */
  public async getUserDid(): Promise<string> {
    try {
      if (!this.initialized) {
        throw new Error("Blockchain Manager not initialized");
      }

      try {
        return await this.ssiService.getUserDid();
      } catch (error) {
        console.warn("Error getting user DID, creating mock DID:", error);
        // If there's an error getting the DID, create a mock one
        this.ssiService.mockInitialize();
        return await this.ssiService.getUserDid();
      }
    } catch (error) {
      console.error("Error getting user DID:", error);
      // Return a mock DID instead of throwing an error
      const mockDid = "did:omnilearn:mock-" + Math.random().toString(36).substring(2, 15);
      console.log("Created fallback mock DID:", mockDid);
      return mockDid;
    }
  }

  /**
   * Create a new DID for the user
   */
  public async createUserDid(username: string): Promise<string> {
    try {
      if (!this.initialized) {
        throw new Error("Blockchain Manager not initialized");
      }

      return await this.ssiService.createDid(username);
    } catch (error) {
      console.error("Error creating user DID:", error);
      throw error;
    }
  }

  /**
   * Issue a verifiable credential to the user
   */
  public async issueVerifiableCredential(
    recipientDid: string,
    credentialType: string,
    credentialData: any
  ): Promise<string> {
    try {
      if (!this.initialized) {
        throw new Error("Blockchain Manager not initialized");
      }

      return await this.ssiService.issueCredential(
        recipientDid,
        credentialType,
        credentialData
      );
    } catch (error) {
      console.error("Error issuing verifiable credential:", error);
      throw error;
    }
  }

  /**
   * Create a new Living Credential (Dynamic NFT)
   */
  public async createLivingCredential(
    ownerDid: string,
    skillName: string,
    skillLevel: string,
    metadata: any
  ): Promise<string> {
    try {
      if (!this.initialized) {
        throw new Error("Blockchain Manager not initialized");
      }

      return await this.livingCredentialService.createLivingCredential(
        ownerDid,
        skillName,
        skillLevel,
        metadata
      );
    } catch (error) {
      console.error("Error creating Living Credential:", error);
      throw error;
    }
  }

  /**
   * Update an existing Living Credential
   */
  public async updateLivingCredential(
    tokenId: string,
    newSkillLevel: string,
    updatedMetadata: any
  ): Promise<void> {
    try {
      if (!this.initialized) {
        throw new Error("Blockchain Manager not initialized");
      }

      await this.livingCredentialService.updateLivingCredential(
        tokenId,
        newSkillLevel,
        updatedMetadata
      );
    } catch (error) {
      console.error("Error updating Living Credential:", error);
      throw error;
    }
  }

  /**
   * Get all credentials owned by the user
   */
  public async getUserCredentials(): Promise<any> {
    try {
      if (!this.initialized) {
        console.warn(
          "Blockchain Manager not initialized, returning mock credentials"
        );
        return {
          verifiableCredentials: [
            {
              id: "mock-vc-1",
              type: "SkillCredential",
              issuer: "did:omnilearn:issuer",
              issuanceDate: new Date().toISOString(),
              metadata: {
                skill: "Web Development",
                level: "Intermediate",
                description:
                  "Proficiency in building responsive web applications",
                issuedBy: "OmniLearn Nexus",
                validUntil: new Date(
                  Date.now() + 365 * 24 * 60 * 60 * 1000
                ).toISOString(),
              },
            },
          ],
          livingCredentials: [
            {
              tokenId: "mock-token-1",
              skill: "Blockchain Development",
              level: "Advanced",
              metadataURI: "ipfs://mockURI1",
              metadata: {
                name: "Blockchain Development - Advanced",
                description:
                  "Advanced proficiency in blockchain development and smart contracts",
                skill: "Blockchain Development",
                level: "Advanced",
                createdAt: new Date().toISOString(),
              },
              subCredentials: [],
            },
          ],
        };
      }

      try {
        // Get both types of credentials
        const [verifiableCredentials, livingCredentials] = await Promise.all([
          this.ssiService.getUserCredentials(),
          this.livingCredentialService.getUserCredentials(),
        ]);

        return {
          verifiableCredentials,
          livingCredentials,
        };
      } catch (serviceError) {
        console.error("Error getting credentials from services:", serviceError);

        // Return mock credentials
        return {
          verifiableCredentials: [
            {
              id: "mock-vc-1",
              type: "SkillCredential",
              issuer: "did:omnilearn:issuer",
              issuanceDate: new Date().toISOString(),
              metadata: {
                skill: "Web Development",
                level: "Intermediate",
                description:
                  "Proficiency in building responsive web applications",
                issuedBy: "OmniLearn Nexus",
                validUntil: new Date(
                  Date.now() + 365 * 24 * 60 * 60 * 1000
                ).toISOString(),
              },
            },
          ],
          livingCredentials: [
            {
              tokenId: "mock-token-1",
              skill: "Blockchain Development",
              level: "Advanced",
              metadataURI: "ipfs://mockURI1",
              metadata: {
                name: "Blockchain Development - Advanced",
                description:
                  "Advanced proficiency in blockchain development and smart contracts",
                skill: "Blockchain Development",
                level: "Advanced",
                createdAt: new Date().toISOString(),
              },
              subCredentials: [],
            },
          ],
        };
      }
    } catch (error) {
      console.error("Error getting user credentials:", error);

      // Return mock credentials instead of throwing error
      return {
        verifiableCredentials: [],
        livingCredentials: [],
      };
    }
  }

  /**
   * Get the user's token balance
   */
  public async getTokenBalance(): Promise<string> {
    try {
      if (!this.initialized) {
        throw new Error("Blockchain Manager not initialized");
      }

      return await this.knowledgeTokenService.getBalance();
    } catch (error) {
      console.error("Error getting token balance:", error);
      throw error;
    }
  }

  /**
   * Reward user with tokens for completing a learning activity
   */
  public async rewardLearningActivity(
    activityType: string,
    activityId: string,
    metadata: any
  ): Promise<string> {
    try {
      if (!this.initialized) {
        throw new Error("Blockchain Manager not initialized");
      }

      return await this.knowledgeTokenService.rewardLearningActivity(
        activityType,
        activityId,
        metadata
      );
    } catch (error) {
      console.error("Error rewarding learning activity:", error);
      throw error;
    }
  }

  /**
   * Stake tokens to earn platform benefits
   */
  public async stakeTokens(amount: string): Promise<string> {
    try {
      if (!this.initialized) {
        throw new Error("Blockchain Manager not initialized");
      }

      return await this.knowledgeTokenService.stakeTokens(amount);
    } catch (error) {
      console.error("Error staking tokens:", error);
      throw error;
    }
  }

  /**
   * Get user's staking information
   */
  public async getStakingInfo(): Promise<any> {
    try {
      if (!this.initialized) {
        throw new Error("Blockchain Manager not initialized");
      }

      return await this.knowledgeTokenService.getStakingInfo();
    } catch (error) {
      console.error("Error getting staking info:", error);
      throw error;
    }
  }

  /**
   * Verify a credential using zero-knowledge proofs
   */
  public async verifyCredentialWithZKP(
    tokenId: string,
    proofRequest: any
  ): Promise<boolean> {
    try {
      if (!this.initialized) {
        throw new Error("Blockchain Manager not initialized");
      }

      return await this.livingCredentialService.verifyCredentialWithZKP(
        tokenId,
        proofRequest
      );
    } catch (error) {
      console.error("Error verifying credential with ZKP:", error);
      throw error;
    }
  }

  /**
   * Get transaction history for the user's tokens
   */
  public async getTokenTransactionHistory(): Promise<any[]> {
    try {
      if (!this.initialized) {
        throw new Error("Blockchain Manager not initialized");
      }

      return await this.knowledgeTokenService.getTransactionHistory();
    } catch (error) {
      console.error("Error getting token transaction history:", error);
      throw error;
    }
  }
}

export default BlockchainManager;
