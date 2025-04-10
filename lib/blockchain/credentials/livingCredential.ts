import { ethers } from "ethers";
import { LIVING_CREDENTIAL_ABI } from "@/lib/blockchain/abis/livingCredential";
import { CREDENTIAL_REGISTRY_ABI } from "@/lib/blockchain/abis/credentialRegistry";
import { uploadToIPFS } from "@/lib/blockchain/ipfs";

// Constants
const LIVING_CREDENTIAL_ADDRESS =
  process.env.NEXT_PUBLIC_LIVING_CREDENTIAL_ADDRESS || "";
const CREDENTIAL_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_CREDENTIAL_REGISTRY_ADDRESS || "";

/**
 * Living Credential Service
 * Handles the creation and management of dynamic NFT credentials (ERC-6551)
 * that evolve based on user's skill development and real-world usage
 */
export class LivingCredentialService {
  private static instance: LivingCredentialService;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private livingCredential: ethers.Contract | null = null;
  private credentialRegistry: ethers.Contract | null = null;

  private constructor() {}

  /**
   * Get singleton instance of LivingCredentialService
   */
  public static getInstance(): LivingCredentialService {
    if (!LivingCredentialService.instance) {
      LivingCredentialService.instance = new LivingCredentialService();
    }
    return LivingCredentialService.instance;
  }

  /**
   * Initialize the Living Credential service with blockchain provider and signer
   */
  public async initialize(
    provider: ethers.Provider,
    signer: ethers.Signer
  ): Promise<void> {
    try {
      this.provider = provider;
      this.signer = signer;

      // Initialize contracts
      this.livingCredential = new ethers.Contract(
        LIVING_CREDENTIAL_ADDRESS,
        LIVING_CREDENTIAL_ABI,
        signer
      );

      this.credentialRegistry = new ethers.Contract(
        CREDENTIAL_REGISTRY_ADDRESS,
        CREDENTIAL_REGISTRY_ABI,
        signer
      );

      console.log("Living Credential service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Living Credential service:", error);
      throw error;
    }
  }

  /**
   * Mock initialize the Living Credential service for demo purposes
   * This avoids making actual blockchain calls
   */
  public mockInitialize(): void {
    console.log("Living Credential service mock initialized");
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
      if (!this.signer || !this.livingCredential) {
        throw new Error("Living Credential service not initialized");
      }

      const userAddress = await this.signer.getAddress();

      // Prepare metadata
      const credentialMetadata = {
        name: `${skillName} - ${skillLevel}`,
        description: `Dynamic credential for ${skillName} at ${skillLevel} level`,
        skill: skillName,
        level: skillLevel,
        createdAt: new Date().toISOString(),
        attributes: metadata.attributes || [],
        ...metadata,
      };

      // Upload metadata to IPFS
      const metadataJSON = JSON.stringify(credentialMetadata);
      const ipfsHash = await uploadToIPFS(metadataJSON);
      const metadataURI = `ipfs://${ipfsHash}`;

      // Mint the Living Credential NFT
      const tx = await this.livingCredential.mintCredential(
        userAddress,
        ownerDid,
        skillName,
        skillLevel,
        metadataURI
      );

      const receipt = await tx.wait();

      // Get token ID from event logs
      const event = receipt.logs.find(
        (log: any) => log.fragment?.name === "CredentialMinted"
      );

      const tokenId = event?.args?.tokenId;

      console.log(
        "Created Living Credential with token ID:",
        tokenId.toString()
      );
      return tokenId.toString();
    } catch (error) {
      console.error("Error creating Living Credential:", error);
      throw error;
    }
  }

  /**
   * Update an existing Living Credential with new achievements or skill progress
   */
  public async updateLivingCredential(
    tokenId: string,
    newSkillLevel: string,
    updatedMetadata: any
  ): Promise<void> {
    try {
      if (!this.livingCredential) {
        throw new Error("Living Credential service not initialized");
      }

      // Get current metadata
      const currentURI = await this.livingCredential.tokenURI(tokenId);
      const currentMetadataResponse = await fetch(
        currentURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      );
      const currentMetadata = await currentMetadataResponse.json();

      // Update metadata
      const updatedMetadataObj = {
        ...currentMetadata,
        level: newSkillLevel,
        updatedAt: new Date().toISOString(),
        ...updatedMetadata,
      };

      // Upload updated metadata to IPFS
      const metadataJSON = JSON.stringify(updatedMetadataObj);
      const ipfsHash = await uploadToIPFS(metadataJSON);
      const metadataURI = `ipfs://${ipfsHash}`;

      // Update the credential on-chain
      const tx = await this.livingCredential.updateCredential(
        tokenId,
        newSkillLevel,
        metadataURI
      );

      await tx.wait();

      console.log("Updated Living Credential:", tokenId);
    } catch (error) {
      console.error("Error updating Living Credential:", error);
      throw error;
    }
  }

  /**
   * Add a sub-credential to a Living Credential
   * (e.g., adding a specific course completion to a broader skill credential)
   */
  public async addSubCredential(
    parentTokenId: string,
    subCredentialType: string,
    subCredentialData: any
  ): Promise<string> {
    try {
      if (!this.livingCredential) {
        throw new Error("Living Credential service not initialized");
      }

      // Prepare sub-credential metadata
      const subCredentialMetadata = {
        type: subCredentialType,
        issuanceDate: new Date().toISOString(),
        ...subCredentialData,
      };

      // Upload metadata to IPFS
      const metadataJSON = JSON.stringify(subCredentialMetadata);
      const ipfsHash = await uploadToIPFS(metadataJSON);
      const metadataURI = `ipfs://${ipfsHash}`;

      // Add sub-credential on-chain
      const tx = await this.livingCredential.addSubCredential(
        parentTokenId,
        subCredentialType,
        metadataURI
      );

      const receipt = await tx.wait();

      // Get sub-credential ID from event logs
      const event = receipt.logs.find(
        (log: any) => log.fragment?.name === "SubCredentialAdded"
      );

      const subCredentialId = event?.args?.subCredentialId;

      console.log("Added sub-credential:", subCredentialId);
      return subCredentialId;
    } catch (error) {
      console.error("Error adding sub-credential:", error);
      throw error;
    }
  }

  /**
   * Get all Living Credentials owned by the user
   */
  public async getUserCredentials(): Promise<any[]> {
    try {
      if (!this.signer || !this.livingCredential) {
        console.warn(
          "Living Credential service not initialized, returning mock credentials"
        );
        // Return mock credentials for demo purposes
        return [
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
              attributes: [
                { trait_type: "Skill", value: "Blockchain Development" },
                { trait_type: "Level", value: "Advanced" },
                { trait_type: "Score", value: 92 },
              ],
            },
            subCredentials: [
              {
                id: "mock-sub-1",
                type: "CourseCompletion",
                metadataURI: "ipfs://mockSubURI1",
                issuanceDate: new Date(
                  Date.now() - 60 * 24 * 60 * 60 * 1000
                ).toISOString(),
                metadata: {
                  course: "Advanced Smart Contract Development",
                  completion: "100%",
                  grade: "A",
                },
              },
            ],
          },
          {
            tokenId: "mock-token-2",
            skill: "AI and Machine Learning",
            level: "Intermediate",
            metadataURI: "ipfs://mockURI2",
            metadata: {
              name: "AI and Machine Learning - Intermediate",
              description:
                "Intermediate proficiency in AI and machine learning concepts and applications",
              skill: "AI and Machine Learning",
              level: "Intermediate",
              createdAt: new Date(
                Date.now() - 90 * 24 * 60 * 60 * 1000
              ).toISOString(),
              attributes: [
                { trait_type: "Skill", value: "AI and Machine Learning" },
                { trait_type: "Level", value: "Intermediate" },
                { trait_type: "Score", value: 85 },
              ],
            },
            subCredentials: [],
          },
        ];
      }

      try {
        const userAddress = await this.signer.getAddress();

        // Get token count for user
        const balance = await this.livingCredential.balanceOf(userAddress);

        // Get all tokens
        const credentials = [];
        for (let i = 0; i < balance; i++) {
          const tokenId = await this.livingCredential.tokenOfOwnerByIndex(
            userAddress,
            i
          );
          const tokenURI = await this.livingCredential.tokenURI(tokenId);

          // Fetch metadata from IPFS
          const metadataResponse = await fetch(
            tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
          );
          const metadata = await metadataResponse.json();

          // Get sub-credentials
          const subCredentialCount =
            await this.livingCredential.getSubCredentialCount(tokenId);
          const subCredentials = [];

          for (let j = 0; j < subCredentialCount; j++) {
            const subCredentialId =
              await this.livingCredential.getSubCredentialIdByIndex(tokenId, j);
            const subCredential = await this.livingCredential.getSubCredential(
              subCredentialId
            );

            // Fetch sub-credential metadata
            const subMetadataResponse = await fetch(
              subCredential.metadataURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
              )
            );
            const subMetadata = await subMetadataResponse.json();

            subCredentials.push({
              id: subCredentialId,
              type: subCredential.credentialType,
              metadataURI: subCredential.metadataURI,
              issuanceDate: subCredential.issuanceDate,
              metadata: subMetadata,
            });
          }

          credentials.push({
            tokenId: tokenId.toString(),
            skill: metadata.skill,
            level: metadata.level,
            metadataURI: tokenURI,
            metadata,
            subCredentials,
          });
        }

        return credentials;
      } catch (contractError) {
        console.error(
          "Error fetching credentials from contract:",
          contractError
        );

        // Return mock credentials for demo purposes
        return [
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
              attributes: [
                { trait_type: "Skill", value: "Blockchain Development" },
                { trait_type: "Level", value: "Advanced" },
                { trait_type: "Score", value: 92 },
              ],
            },
            subCredentials: [
              {
                id: "mock-sub-1",
                type: "CourseCompletion",
                metadataURI: "ipfs://mockSubURI1",
                issuanceDate: new Date(
                  Date.now() - 60 * 24 * 60 * 60 * 1000
                ).toISOString(),
                metadata: {
                  course: "Advanced Smart Contract Development",
                  completion: "100%",
                  grade: "A",
                },
              },
            ],
          },
          {
            tokenId: "mock-token-2",
            skill: "AI and Machine Learning",
            level: "Intermediate",
            metadataURI: "ipfs://mockURI2",
            metadata: {
              name: "AI and Machine Learning - Intermediate",
              description:
                "Intermediate proficiency in AI and machine learning concepts and applications",
              skill: "AI and Machine Learning",
              level: "Intermediate",
              createdAt: new Date(
                Date.now() - 90 * 24 * 60 * 60 * 1000
              ).toISOString(),
              attributes: [
                { trait_type: "Skill", value: "AI and Machine Learning" },
                { trait_type: "Level", value: "Intermediate" },
                { trait_type: "Score", value: 85 },
              ],
            },
            subCredentials: [],
          },
        ];
      }
    } catch (error) {
      console.error("Error getting user credentials:", error);
      // Return mock credentials instead of throwing error
      return [
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
      ];
    }
  }

  /**
   * Verify a Living Credential using zero-knowledge proofs
   * This allows proving ownership of a credential without revealing the full credential
   */
  public async verifyCredentialWithZKP(
    tokenId: string,
    proofRequest: any
  ): Promise<boolean> {
    try {
      if (!this.credentialRegistry) {
        throw new Error("Credential Registry not initialized");
      }

      // In a real implementation, this would generate and verify a ZK proof
      // For now, we'll just check if the credential exists and is valid

      const isValid = await this.credentialRegistry.verifyCredential(tokenId);
      return isValid;
    } catch (error) {
      console.error("Error verifying credential with ZKP:", error);
      throw error;
    }
  }
}

export default LivingCredentialService;
