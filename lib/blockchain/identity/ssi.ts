import { ethers } from "ethers";
import { DID_REGISTRY_ABI } from "@/lib/blockchain/abis/didRegistry";
import { SSI_CONTROLLER_ABI } from "@/lib/blockchain/abis/ssiController";

// Constants
const DID_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_DID_REGISTRY_ADDRESS || "";
const SSI_CONTROLLER_ADDRESS =
  process.env.NEXT_PUBLIC_SSI_CONTROLLER_ADDRESS || "";

/**
 * Self-Sovereign Identity (SSI) Service
 * Handles creation and management of decentralized identifiers (DIDs)
 * and verifiable credentials for users
 */
export class SSIService {
  private static instance: SSIService;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private didRegistry: ethers.Contract | null = null;
  private ssiController: ethers.Contract | null = null;
  private userDid: string | null = null;

  private constructor() {}

  /**
   * Get singleton instance of SSIService
   */
  public static getInstance(): SSIService {
    if (!SSIService.instance) {
      SSIService.instance = new SSIService();
    }
    return SSIService.instance;
  }

  /**
   * Initialize the SSI service with blockchain provider and signer
   */
  public async initialize(
    provider: ethers.Provider,
    signer: ethers.Signer
  ): Promise<void> {
    try {
      this.provider = provider;
      this.signer = signer;

      // Initialize contracts
      this.didRegistry = new ethers.Contract(
        DID_REGISTRY_ADDRESS,
        DID_REGISTRY_ABI,
        signer
      );

      this.ssiController = new ethers.Contract(
        SSI_CONTROLLER_ADDRESS,
        SSI_CONTROLLER_ABI,
        signer
      );

      // Get user address
      const userAddress = await signer.getAddress();

      // Check if user already has a DID
      const hasDid = await this.didRegistry.hasDid(userAddress);

      if (hasDid) {
        this.userDid = await this.didRegistry.addressToDid(userAddress);
        console.log("User DID loaded:", this.userDid);
      }

      console.log("SSI service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize SSI service:", error);
      throw error;
    }
  }

  /**
   * Mock initialize the SSI service for demo purposes
   * This avoids making actual blockchain calls
   */
  public mockInitialize(): void {
    // Set a mock DID
    this.userDid = "did:omnilearn:" + ethers.hexlify(ethers.randomBytes(16));
    // Mark the service as initialized in mock mode
    this.didRegistry = {} as ethers.Contract;
    this.ssiController = {} as ethers.Contract;
    this.signer = {} as ethers.Signer;
    console.log("SSI service mock initialized with DID:", this.userDid);
  }

  /**
   * Create a new DID for the user
   */
  public async createDid(username: string): Promise<string> {
    try {
      if (!this.signer || !this.didRegistry) {
        throw new Error("SSI service not initialized");
      }

      const userAddress = await this.signer.getAddress();

      // Check if user already has a DID
      const hasDid = await this.didRegistry.hasDid(userAddress);

      if (hasDid) {
        const did = await this.didRegistry.addressToDid(userAddress);
        this.userDid = did as string;
        return this.userDid;
      }

      // Create a new DID
      const didMethod = "did:omnilearn:";
      const didId = ethers.hexlify(ethers.randomBytes(16));
      const did = `${didMethod}${didId}`;

      // Register DID on-chain
      const tx = await this.didRegistry.registerDid(did, username);
      await tx.wait();

      this.userDid = did;

      console.log("Created new DID:", did);
      return did;
    } catch (error) {
      console.error("Error creating DID:", error);
      throw error;
    }
  }

  /**
   * Get the user's DID
   */
  public async getUserDid(): Promise<string> {
    try {
      // If we already have a userDid (from mock or real initialization), return it
      if (this.userDid) {
        return this.userDid;
      }

      // Check if service is initialized
      if (!this.signer || !this.didRegistry) {
        throw new Error("SSI service not initialized");
      }

      // Try to get the DID from the blockchain
      const userAddress = await this.signer.getAddress();
      const hasDid = await this.didRegistry.hasDid(userAddress);

      if (!hasDid) {
        throw new Error("User does not have a DID");
      }

      const did = await this.didRegistry.addressToDid(userAddress);
      this.userDid = did as string;
      return this.userDid;
    } catch (error) {
      console.error("Error getting user DID:", error);
      throw error;
    }
  }

  /**
   * Issue a verifiable credential to the user
   */
  public async issueCredential(
    recipientDid: string,
    credentialType: string,
    credentialData: any
  ): Promise<string> {
    try {
      if (!this.ssiController) {
        throw new Error("SSI service not initialized");
      }

      // Create credential metadata
      const metadata = {
        type: credentialType,
        issuanceDate: new Date().toISOString(),
        expirationDate: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        ...credentialData,
      };

      // Issue credential on-chain
      const tx = await this.ssiController.issueCredential(
        recipientDid,
        credentialType,
        JSON.stringify(metadata)
      );

      const receipt = await tx.wait();

      // Get credential ID from event logs
      const event = receipt.logs.find(
        (log: any) => log.fragment?.name === "CredentialIssued"
      );

      const credentialId = event?.args?.credentialId as string;
      if (!credentialId) {
        throw new Error("Failed to get credential ID from event");
      }

      console.log("Issued credential:", credentialId);
      return credentialId;
    } catch (error) {
      console.error("Error issuing credential:", error);
      throw error;
    }
  }

  /**
   * Verify a credential
   */
  public async verifyCredential(credentialId: string): Promise<boolean> {
    try {
      if (!this.ssiController) {
        throw new Error("SSI service not initialized");
      }

      const isValid = await this.ssiController.verifyCredential(credentialId);
      return isValid;
    } catch (error) {
      console.error("Error verifying credential:", error);
      throw error;
    }
  }

  /**
   * Get all credentials owned by the user
   */
  public async getUserCredentials(): Promise<any[]> {
    try {
      if (!this.ssiController || !this.userDid) {
        console.warn(
          "SSI service not initialized or user has no DID, returning empty credentials"
        );
        return []; // Return empty array instead of throwing error
      }

      try {
        const credentialIds = await this.ssiController.getCredentialsBySubject(
          this.userDid
        );

        const credentials = await Promise.all(
          credentialIds.map(async (id: string) => {
            const credential = await this.ssiController!.getCredential(id);
            return {
              id,
              type: credential.type,
              issuer: credential.issuer,
              issuanceDate: credential.issuanceDate,
              metadata: JSON.parse(credential.metadata),
            };
          })
        );

        return credentials;
      } catch (contractError) {
        console.error(
          "Error fetching credentials from contract:",
          contractError
        );

        // Return mock credentials for demo purposes
        return [
          {
            id: "mock-credential-1",
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
          {
            id: "mock-credential-2",
            type: "CourseCompletion",
            issuer: "did:omnilearn:issuer",
            issuanceDate: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
            metadata: {
              course: "Introduction to Blockchain",
              level: "Beginner",
              description: "Fundamentals of blockchain technology",
              issuedBy: "OmniLearn Nexus",
              score: "95%",
            },
          },
        ];
      }
    } catch (error) {
      console.error("Error getting user credentials:", error);
      return []; // Return empty array instead of throwing error
    }
  }
}

export default SSIService;
