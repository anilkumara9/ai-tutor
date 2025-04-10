import { ethers } from "ethers";
import { KNOWLEDGE_TOKEN_ABI } from "@/lib/blockchain/abis/knowledgeToken";

// Constants
const KNOWLEDGE_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_KNOWLEDGE_TOKEN_ADDRESS || "";

/**
 * Knowledge Token Service
 * Handles the Learn-to-Earn token system for rewarding learning activities
 * and skill acquisition
 */
export class KnowledgeTokenService {
  private static instance: KnowledgeTokenService;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private knowledgeToken: ethers.Contract | null = null;
  private initialized: boolean = false;

  private constructor() {}

  /**
   * Get singleton instance of KnowledgeTokenService
   */
  public static getInstance(): KnowledgeTokenService {
    if (!KnowledgeTokenService.instance) {
      KnowledgeTokenService.instance = new KnowledgeTokenService();
    }
    return KnowledgeTokenService.instance;
  }

  /**
   * Initialize the Knowledge Token service with blockchain provider and signer
   */
  public async initialize(
    provider: ethers.Provider,
    signer: ethers.Signer
  ): Promise<void> {
    try {
      this.provider = provider;
      this.signer = signer;

      // Initialize contract
      this.knowledgeToken = new ethers.Contract(
        KNOWLEDGE_TOKEN_ADDRESS,
        KNOWLEDGE_TOKEN_ABI,
        signer
      );

      this.initialized = true;
      console.log("Knowledge Token service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Knowledge Token service:", error);
      throw error;
    }
  }

  /**
   * Mock initialize the Knowledge Token service for demo purposes
   * This avoids making actual blockchain calls
   */
  public mockInitialize(): void {
    this.initialized = true;
    console.log("Knowledge Token service mock initialized");
  }

  /**
   * Get the user's token balance
   */
  public async getBalance(): Promise<string> {
    try {
      if (!this.signer || !this.knowledgeToken) {
        console.warn(
          "Knowledge Token service not initialized, returning mock balance"
        );
        return "100"; // Return mock balance for demo
      }

      try {
        const userAddress = await this.signer.getAddress();
        const balance = await this.knowledgeToken.balanceOf(userAddress);

        return ethers.formatEther(balance);
      } catch (contractError) {
        console.error("Error getting balance from contract:", contractError);
        return "50"; // Return mock balance on contract error
      }
    } catch (error) {
      console.error("Error getting token balance:", error);
      return "25"; // Return mock balance on any other error
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
      if (!this.signer || !this.knowledgeToken) {
        throw new Error("Knowledge Token service not initialized");
      }

      const userAddress = await this.signer.getAddress();

      // Determine reward amount based on activity type
      let rewardAmount;
      switch (activityType) {
        case "course_completion":
          rewardAmount = ethers.parseEther("10");
          break;
        case "assessment_passed":
          rewardAmount = ethers.parseEther("5");
          break;
        case "daily_streak":
          rewardAmount = ethers.parseEther("1");
          break;
        case "content_creation":
          rewardAmount = ethers.parseEther("15");
          break;
        case "peer_review":
          rewardAmount = ethers.parseEther("3");
          break;
        default:
          rewardAmount = ethers.parseEther("1");
      }

      // Mint tokens to the user
      const tx = await this.knowledgeToken.mint(
        userAddress,
        rewardAmount,
        activityType,
        activityId,
        JSON.stringify(metadata)
      );

      const receipt = await tx.wait();

      // Get transaction hash
      const txHash = receipt.hash;

      console.log(
        `Rewarded ${ethers.formatEther(
          rewardAmount
        )} KNOW tokens for ${activityType}`
      );
      return txHash;
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
      if (!this.knowledgeToken) {
        throw new Error("Knowledge Token service not initialized");
      }

      const amountWei = ethers.parseEther(amount);

      // Stake tokens
      const tx = await this.knowledgeToken.stake(amountWei);
      const receipt = await tx.wait();

      return receipt.hash;
    } catch (error) {
      console.error("Error staking tokens:", error);
      throw error;
    }
  }

  /**
   * Unstake tokens
   */
  public async unstakeTokens(amount: string): Promise<string> {
    try {
      if (!this.knowledgeToken) {
        throw new Error("Knowledge Token service not initialized");
      }

      const amountWei = ethers.parseEther(amount);

      // Unstake tokens
      const tx = await this.knowledgeToken.unstake(amountWei);
      const receipt = await tx.wait();

      return receipt.hash;
    } catch (error) {
      console.error("Error unstaking tokens:", error);
      throw error;
    }
  }

  /**
   * Get user's staking information
   */
  public async getStakingInfo(): Promise<any> {
    try {
      if (!this.signer || !this.knowledgeToken) {
        console.warn(
          "Knowledge Token service not initialized, returning mock staking info"
        );
        return {
          stakedAmount: "0",
          stakingSince: new Date().toISOString(),
          rewards: "0",
          stakingLevel: "0",
        };
      }

      try {
        const userAddress = await this.signer.getAddress();
        const stakingInfo = await this.knowledgeToken.getStakingInfo(
          userAddress
        );

        return {
          stakedAmount: ethers.formatEther(stakingInfo.amount),
          stakingSince: new Date(stakingInfo.since * 1000).toISOString(),
          rewards: ethers.formatEther(stakingInfo.rewards),
          stakingLevel: stakingInfo.level.toString(),
        };
      } catch (contractError) {
        console.error(
          "Error getting staking info from contract:",
          contractError
        );
        return {
          stakedAmount: "0",
          stakingSince: new Date().toISOString(),
          rewards: "0",
          stakingLevel: "0",
        };
      }
    } catch (error) {
      console.error("Error getting staking info:", error);
      return {
        stakedAmount: "0",
        stakingSince: new Date().toISOString(),
        rewards: "0",
        stakingLevel: "0",
      };
    }
  }

  /**
   * Get user's transaction history
   */
  public async getTransactionHistory(): Promise<any[]> {
    try {
      if (!this.signer || !this.knowledgeToken) {
        throw new Error("Knowledge Token service not initialized");
      }

      const userAddress = await this.signer.getAddress();

      // Get transfer events involving the user
      const sentFilter = this.knowledgeToken.filters.Transfer(
        userAddress,
        null
      );
      const receivedFilter = this.knowledgeToken.filters.Transfer(
        null,
        userAddress
      );

      const [sentEvents, receivedEvents] = await Promise.all([
        this.knowledgeToken.queryFilter(sentFilter),
        this.knowledgeToken.queryFilter(receivedFilter),
      ]);

      // Combine and sort events
      const allEvents = [...sentEvents, ...receivedEvents].sort((a, b) => {
        return b.blockNumber - a.blockNumber;
      });

      // Format events
      const history = await Promise.all(
        allEvents.map(async (event) => {
          const block = await this.provider?.getBlock(event.blockNumber);
          const timestamp = block?.timestamp
            ? new Date(block.timestamp * 1000).toISOString()
            : "";

          return {
            transactionHash: event.transactionHash,
            timestamp,
            from: event.args?.[0],
            to: event.args?.[1],
            amount: event.args?.[2] ? ethers.formatEther(event.args[2]) : "0",
            type: event.args?.[0] === userAddress ? "sent" : "received",
          };
        })
      );

      return history;
    } catch (error) {
      console.error("Error getting transaction history:", error);
      throw error;
    }
  }

  /**
   * Spend tokens on platform benefits
   */
  public async spendTokens(
    amount: string,
    benefitType: string,
    metadata: any
  ): Promise<string> {
    try {
      if (!this.knowledgeToken) {
        throw new Error("Knowledge Token service not initialized");
      }

      const amountWei = ethers.parseEther(amount);

      // Spend tokens
      const tx = await this.knowledgeToken.spend(
        amountWei,
        benefitType,
        JSON.stringify(metadata)
      );

      const receipt = await tx.wait();

      return receipt.hash;
    } catch (error) {
      console.error("Error spending tokens:", error);
      throw error;
    }
  }
}

export default KnowledgeTokenService;
