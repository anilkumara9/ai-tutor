import { ethers } from 'ethers';
import { 
  DYNAMIC_SKILL_NFT_ABI, 
  SOULBOUND_TOKEN_ABI,
  GOVERNANCE_TOKEN_ABI,
  DAO_ABI
} from '@/lib/blockchain/abis';
import { uploadToIPFS, getFromIPFS } from '@/lib/blockchain/ipfs';
import { 
  SkillCredential, 
  SoulboundToken, 
  DynamicNFT,
  GovernanceProposal
} from '@/lib/blockchain/types';

// Singleton blockchain service
class BlockchainService {
  private static instance: BlockchainService;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private contracts: {
    skillNFT: ethers.Contract | null;
    soulboundToken: ethers.Contract | null;
    governanceToken: ethers.Contract | null;
    dao: ethers.Contract | null;
  };
  private initialized: boolean = false;
  private userAddress: string | null = null;

  private constructor() {
    this.contracts = {
      skillNFT: null,
      soulboundToken: null,
      governanceToken: null,
      dao: null
    };
  }

  // Get singleton instance
  public static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  // Initialize the service with provider and signer
  public async initialize(provider: ethers.Provider, signer: ethers.Signer): Promise<void> {
    try {
      this.provider = provider;
      this.signer = signer;
      
      if (signer) {
        this.userAddress = await signer.getAddress();
      }
      
      await this.initializeContracts();
      this.initialized = true;
      
      console.log('Blockchain service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  // Check if service is initialized
  public isInitialized(): boolean {
    return this.initialized;
  }

  // Initialize contract instances
  private async initializeContracts(): Promise<void> {
    try {
      if (!this.provider || !this.signer) {
        throw new Error('Provider or signer not available');
      }

      // Initialize Skill NFT contract
      const skillNFTAddress = process.env.NEXT_PUBLIC_SKILL_NFT_ADDRESS || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (skillNFTAddress) {
        this.contracts.skillNFT = new ethers.Contract(
          skillNFTAddress,
          DYNAMIC_SKILL_NFT_ABI,
          this.signer
        );
      }

      // Initialize Soulbound Token contract
      const soulboundTokenAddress = process.env.NEXT_PUBLIC_SOULBOUND_TOKEN_ADDRESS || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      if (soulboundTokenAddress) {
        this.contracts.soulboundToken = new ethers.Contract(
          soulboundTokenAddress,
          SOULBOUND_TOKEN_ABI,
          this.signer
        );
      }

      // Initialize Governance Token contract
      const governanceTokenAddress = process.env.NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS;
      if (governanceTokenAddress) {
        this.contracts.governanceToken = new ethers.Contract(
          governanceTokenAddress,
          GOVERNANCE_TOKEN_ABI,
          this.signer
        );
      }

      // Initialize DAO contract
      const daoAddress = process.env.NEXT_PUBLIC_DAO_ADDRESS;
      if (daoAddress) {
        this.contracts.dao = new ethers.Contract(
          daoAddress,
          DAO_ABI,
          this.signer
        );
      }

      console.log('Contracts initialized successfully');
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
      throw error;
    }
  }

  // Get user credentials (skills and soulbound tokens)
  public async getUserCredentials(address?: string): Promise<{
    skills: SkillCredential[];
    soulboundTokens: SoulboundToken[];
  }> {
    try {
      const targetAddress = address || this.userAddress;
      
      if (!targetAddress) {
        throw new Error('No address provided and no user connected');
      }
      
      if (!this.contracts.skillNFT || !this.contracts.soulboundToken) {
        throw new Error('Contracts not initialized');
      }

      // Get skills
      const skills: SkillCredential[] = [];
      try {
        // Get token IDs owned by the user
        const tokenIds = await this.contracts.skillNFT.getSkillsByOwner(targetAddress);
        
        // Get details for each token
        for (const tokenId of tokenIds) {
          const level = await this.contracts.skillNFT.getSkillLevel(tokenId);
          const metadataURI = await this.contracts.skillNFT.getSkillMetadata(tokenId);
          
          // Fetch metadata from IPFS
          let metadata = {
            name: 'Unknown Skill',
            description: '',
            category: '',
            evidence: [],
            endorsements: []
          };
          
          try {
            if (metadataURI.startsWith('ipfs://')) {
              const ipfsHash = metadataURI.replace('ipfs://', '');
              const metadataJson = await getFromIPFS(ipfsHash);
              metadata = JSON.parse(metadataJson);
            }
          } catch (err) {
            console.error('Error fetching metadata:', err);
          }
          
          skills.push({
            id: tokenId.toString(),
            name: metadata.name,
            level,
            issuer: 'PrepWise Platform',
            issuedAt: Date.now(), // This would ideally come from the blockchain event timestamp
            metadata: {
              description: metadata.description,
              category: metadata.category,
              evidence: metadata.evidence,
              endorsements: metadata.endorsements
            }
          });
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
      }

      // Get soulbound tokens
      const soulboundTokens: SoulboundToken[] = [];
      try {
        // This would be implemented based on the actual contract methods
        // For now, we'll return an empty array
      } catch (err) {
        console.error('Error fetching soulbound tokens:', err);
      }

      return { skills, soulboundTokens };
    } catch (error) {
      console.error('Error getting user credentials:', error);
      throw error;
    }
  }

  // Mint a new skill NFT
  public async mintSkillNFT(
    to: string,
    skillName: string,
    level: string,
    metadata: any
  ): Promise<string> {
    try {
      if (!this.contracts.skillNFT) {
        throw new Error('Skill NFT contract not initialized');
      }

      // Upload metadata to IPFS
      const metadataJSON = JSON.stringify({
        name: skillName,
        description: `${skillName} - ${level}`,
        level,
        ...metadata
      });
      
      const ipfsHash = await uploadToIPFS(metadataJSON);
      const metadataURI = `ipfs://${ipfsHash}`;
      
      // Mint the NFT
      const tx = await this.contracts.skillNFT.mintSkill(
        to,
        skillName,
        level,
        metadataURI
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Get the token ID from the event
      const event = receipt.events?.find(e => e.event === 'SkillMinted');
      const tokenId = event?.args?.tokenId.toString();
      
      return tokenId;
    } catch (error) {
      console.error('Error minting skill NFT:', error);
      throw error;
    }
  }

  // Upgrade an existing skill NFT
  public async upgradeSkillNFT(
    tokenId: string,
    newLevel: string,
    metadata: any
  ): Promise<boolean> {
    try {
      if (!this.contracts.skillNFT) {
        throw new Error('Skill NFT contract not initialized');
      }

      // Get current metadata
      const currentMetadataURI = await this.contracts.skillNFT.getSkillMetadata(tokenId);
      let currentMetadata = {};
      
      if (currentMetadataURI.startsWith('ipfs://')) {
        const ipfsHash = currentMetadataURI.replace('ipfs://', '');
        const metadataJson = await getFromIPFS(ipfsHash);
        currentMetadata = JSON.parse(metadataJson);
      }
      
      // Merge with new metadata
      const updatedMetadata = {
        ...currentMetadata,
        level: newLevel,
        ...metadata,
        upgradeHistory: [
          ...(currentMetadata.upgradeHistory || []),
          {
            level: newLevel,
            timestamp: Date.now()
          }
        ]
      };
      
      // Upload updated metadata to IPFS
      const ipfsHash = await uploadToIPFS(JSON.stringify(updatedMetadata));
      const metadataURI = `ipfs://${ipfsHash}`;
      
      // Upgrade the NFT
      const tx = await this.contracts.skillNFT.upgradeSkill(
        tokenId,
        newLevel,
        metadataURI
      );
      
      // Wait for transaction to be mined
      await tx.wait();
      
      return true;
    } catch (error) {
      console.error('Error upgrading skill NFT:', error);
      throw error;
    }
  }

  // Issue a soulbound token (certificate)
  public async issueSoulboundToken(
    to: string,
    name: string,
    credentialType: string,
    metadata: any
  ): Promise<string> {
    try {
      if (!this.contracts.soulboundToken) {
        throw new Error('Soulbound token contract not initialized');
      }

      // Upload metadata to IPFS
      const metadataJSON = JSON.stringify({
        name,
        description: `${name} - ${credentialType}`,
        type: credentialType,
        issuedAt: Date.now(),
        ...metadata
      });
      
      const ipfsHash = await uploadToIPFS(metadataJSON);
      const metadataURI = `ipfs://${ipfsHash}`;
      
      // Issue the certificate
      const tx = await this.contracts.soulboundToken.issueCertificate(
        to,
        name,
        credentialType,
        metadataURI
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Get the token ID from the event
      const event = receipt.events?.find(e => e.event === 'CertificateIssued');
      const tokenId = event?.args?.tokenId.toString();
      
      return tokenId;
    } catch (error) {
      console.error('Error issuing soulbound token:', error);
      throw error;
    }
  }

  // Get user's governance token balance
  public async getGovernanceTokenBalance(address?: string): Promise<string> {
    try {
      if (!this.contracts.governanceToken) {
        throw new Error('Governance token contract not initialized');
      }

      const targetAddress = address || this.userAddress;
      
      if (!targetAddress) {
        throw new Error('No address provided and no user connected');
      }
      
      const balance = await this.contracts.governanceToken.balanceOf(targetAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting governance token balance:', error);
      throw error;
    }
  }

  // Get active governance proposals
  public async getActiveProposals(): Promise<GovernanceProposal[]> {
    try {
      if (!this.contracts.dao) {
        throw new Error('DAO contract not initialized');
      }

      // This would be implemented based on the actual contract methods
      // For now, we'll return an empty array
      return [];
    } catch (error) {
      console.error('Error getting active proposals:', error);
      throw error;
    }
  }

  // Create a new governance proposal
  public async createProposal(
    title: string,
    description: string,
    actions: any[]
  ): Promise<string> {
    try {
      if (!this.contracts.dao) {
        throw new Error('DAO contract not initialized');
      }

      // This would be implemented based on the actual contract methods
      // For now, we'll return a mock proposal ID
      return 'proposal-' + Date.now();
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  }

  // Vote on a governance proposal
  public async voteOnProposal(
    proposalId: string,
    support: boolean
  ): Promise<boolean> {
    try {
      if (!this.contracts.dao) {
        throw new Error('DAO contract not initialized');
      }

      // This would be implemented based on the actual contract methods
      // For now, we'll return true
      return true;
    } catch (error) {
      console.error('Error voting on proposal:', error);
      throw error;
    }
  }

  // Get user's wallet address
  public getUserAddress(): string | null {
    return this.userAddress;
  }

  // Disconnect wallet
  public disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.userAddress = null;
    this.contracts = {
      skillNFT: null,
      soulboundToken: null,
      governanceToken: null,
      dao: null
    };
    this.initialized = false;
  }
}

// Export singleton instance
export const blockchainService = BlockchainService.getInstance();
