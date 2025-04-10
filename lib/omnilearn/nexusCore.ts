import BlockchainManager from "@/lib/blockchain/blockchainManager";
import AITutorService from "@/lib/ai/tutor/aiTutor";
import SkillverseService from "@/lib/metaverse/skillverse";
import AnalyticsService from "@/lib/ai/analytics/analyticsService";
import WorkflowService from "@/lib/ai/workflow/workflowService";

/**
 * OmniLearn Nexus Core Service
 * Central service that coordinates all platform components and provides
 * a unified interface for the OmniLearn Nexus platform
 */
export class NexusCore {
  private static instance: NexusCore;
  private blockchainManager: BlockchainManager;
  private aiTutorService: AITutorService;
  private skillverseService: SkillverseService;
  private analyticsService: AnalyticsService;
  private workflowService: WorkflowService;
  private initialized: boolean = false;
  private userId: string | null = null;

  private constructor() {
    this.blockchainManager = BlockchainManager.getInstance();
    this.aiTutorService = AITutorService.getInstance();
    this.skillverseService = SkillverseService.getInstance();
    this.analyticsService = AnalyticsService.getInstance();
    this.workflowService = WorkflowService.getInstance();
  }

  /**
   * Get singleton instance of NexusCore
   */
  public static getInstance(): NexusCore {
    if (!NexusCore.instance) {
      NexusCore.instance = new NexusCore();
    }
    return NexusCore.instance;
  }

  /**
   * Initialize the Nexus Core service
   */
  public async initialize(userId: string): Promise<void> {
    try {
      this.userId = userId;

      // Initialize all services
      await Promise.all([
        this.blockchainManager.initialize(),
        this.aiTutorService.initialize(userId),
        this.skillverseService.initialize(),
        this.analyticsService.initialize(userId),
        this.workflowService.initialize(userId),
      ]);

      this.initialized = true;
      console.log("Nexus Core initialized successfully for user:", userId);
    } catch (error) {
      console.error("Failed to initialize Nexus Core:", error);
      throw error;
    }
  }

  /**
   * Check if the user has a DID, and create one if not
   */
  public async ensureUserIdentity(username: string): Promise<string> {
    try {
      if (!this.initialized) {
        throw new Error("Nexus Core not initialized");
      }

      let userDid;

      try {
        // Try to get existing DID
        userDid = await this.blockchainManager.getUserDid();
      } catch (error) {
        // If no DID exists, create one
        userDid = await this.blockchainManager.createUserDid(username);
      }

      return userDid;
    } catch (error) {
      console.error("Error ensuring user identity:", error);
      throw error;
    }
  }

  /**
   * Create a personalized learning experience
   */
  public async createLearningExperience(
    topic: string,
    skillLevel: string = "beginner"
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Generate learning session with AI Tutor
      const learningSession = await this.aiTutorService.generateLearningSession(
        this.userId,
        topic,
        skillLevel
      );

      // Generate a 3D world for the topic
      const world = await this.skillverseService.generateWorld(
        this.userId,
        topic,
        "moderate"
      );

      // Combine the learning session and world
      const learningExperience = {
        session: learningSession,
        world: world,
        createdAt: new Date().toISOString(),
      };

      return learningExperience;
    } catch (error) {
      console.error("Error creating learning experience:", error);
      throw error;
    }
  }

  /**
   * Complete a learning activity and earn rewards
   */
  public async completeLearningActivity(
    activityType: string,
    activityId: string,
    metadata: any
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Reward the user with tokens
      const txHash = await this.blockchainManager.rewardLearningActivity(
        activityType,
        activityId,
        metadata
      );

      // Get updated token balance
      const balance = await this.blockchainManager.getTokenBalance();

      return {
        transactionHash: txHash,
        newBalance: balance,
        activityType,
        activityId,
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error completing learning activity:", error);
      throw error;
    }
  }

  /**
   * Issue a credential for a completed skill
   */
  public async issueSkillCredential(
    skillName: string,
    skillLevel: string,
    assessmentResults: any
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Get user DID
      const userDid = await this.blockchainManager.getUserDid();

      // Create metadata for the credential
      const metadata = {
        assessmentResults,
        issueDate: new Date().toISOString(),
        platform: "OmniLearn Nexus",
        attributes: [
          {
            trait_type: "Skill",
            value: skillName,
          },
          {
            trait_type: "Level",
            value: skillLevel,
          },
          {
            trait_type: "Score",
            value: assessmentResults.score,
          },
        ],
      };

      // Create a Living Credential
      const tokenId = await this.blockchainManager.createLivingCredential(
        userDid,
        skillName,
        skillLevel,
        metadata
      );

      // Also issue a verifiable credential
      const credentialId =
        await this.blockchainManager.issueVerifiableCredential(
          userDid,
          "SkillCredential",
          {
            skill: skillName,
            level: skillLevel,
            assessment: assessmentResults,
          }
        );

      return {
        tokenId,
        credentialId,
        skill: skillName,
        level: skillLevel,
        issuedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error issuing skill credential:", error);
      throw error;
    }
  }

  /**
   * Create a personalized learning path
   */
  public async createPersonalizedLearningPath(
    goal: string,
    timeframe: string
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Generate learning path with AI Tutor
      const learningPath = await this.aiTutorService.createLearningPath(
        this.userId,
        goal,
        timeframe
      );

      // Get user's existing credentials
      const credentials = await this.blockchainManager.getUserCredentials();

      // Extract skills from credentials
      const existingSkills = credentials.livingCredentials.map((cred: any) => ({
        name: cred.skill,
        level: cred.level,
      }));

      // Generate skill graph visualization
      const skillGraph = await this.skillverseService.generateSkillGraph(
        this.userId,
        existingSkills
      );

      return {
        learningPath,
        skillGraph,
        existingSkills,
        goal,
        timeframe,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error creating personalized learning path:", error);
      throw error;
    }
  }

  /**
   * Assess a user's skill in a specific topic
   */
  public async assessSkill(topic: string): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Generate assessment with AI Tutor
      const assessment = await this.aiTutorService.assessSkill(
        this.userId,
        topic
      );

      return {
        assessment,
        topic,
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error assessing skill:", error);
      throw error;
    }
  }

  /**
   * Get user's dashboard data
   */
  public async getUserDashboard(): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        console.warn(
          "Nexus Core not initialized, returning mock dashboard data"
        );
        return {
          credentials: {
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
          },
          tokenBalance: "100",
          stakingInfo: {
            stakedAmount: "0",
            stakingSince: new Date().toISOString(),
            rewards: "0",
            stakingLevel: "0",
          },
          world: null,
          userId: this.userId || "mock-user",
          lastUpdated: new Date().toISOString(),
        };
      }

      try {
        // Get user data from various services
        const [credentials, tokenBalance, stakingInfo, world] =
          await Promise.all([
            this.blockchainManager.getUserCredentials(),
            this.blockchainManager.getTokenBalance().catch(() => "0"),
            this.blockchainManager.getStakingInfo().catch(() => ({
              stakedAmount: "0",
              stakingSince: new Date().toISOString(),
              rewards: "0",
              stakingLevel: "0",
            })),
            this.skillverseService.getUserWorld(this.userId).catch(() => null),
          ]);

        return {
          credentials,
          tokenBalance,
          stakingInfo,
          world,
          userId: this.userId,
          lastUpdated: new Date().toISOString(),
        };
      } catch (serviceError) {
        console.error("Error getting data from services:", serviceError);

        // Return mock dashboard data
        return {
          credentials: {
            verifiableCredentials: [],
            livingCredentials: [],
          },
          tokenBalance: "0",
          stakingInfo: {
            stakedAmount: "0",
            stakingSince: new Date().toISOString(),
            rewards: "0",
            stakingLevel: "0",
          },
          world: null,
          userId: this.userId,
          lastUpdated: new Date().toISOString(),
        };
      }
    } catch (error) {
      console.error("Error getting user dashboard:", error);

      // Return basic mock data instead of throwing error
      return {
        credentials: {
          verifiableCredentials: [],
          livingCredentials: [],
        },
        tokenBalance: "0",
        stakingInfo: null,
        world: null,
        userId: this.userId || "unknown",
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  /**
   * Create a collaborative learning space
   */
  public async createCollaborativeSpace(
    name: string,
    topic: string,
    maxParticipants: number
  ): Promise<any> {
    try {
      if (!this.initialized) {
        throw new Error("Nexus Core not initialized");
      }

      // Generate collaborative space
      const space = await this.skillverseService.generateCollaborativeSpace(
        name,
        topic,
        maxParticipants
      );

      return space;
    } catch (error) {
      console.error("Error creating collaborative space:", error);
      throw error;
    }
  }

  /**
   * Process user response to a learning exercise
   */
  public async processLearningResponse(
    sessionId: string,
    exerciseId: string,
    userResponse: string
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Process response with AI Tutor
      const feedback = await this.aiTutorService.processResponse(
        this.userId,
        sessionId,
        exerciseId,
        userResponse
      );

      return feedback;
    } catch (error) {
      console.error("Error processing learning response:", error);
      throw error;
    }
  }

  /**
   * Generate learning insights based on user activity
   */
  public async generateLearningInsights(learningHistory: any[]): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Generate insights with Analytics Service
      const insights = await this.analyticsService.generateLearningInsights(
        this.userId,
        learningHistory
      );

      return insights;
    } catch (error) {
      console.error("Error generating learning insights:", error);
      throw error;
    }
  }

  /**
   * Identify skill gaps based on user performance and goals
   */
  public async identifySkillGaps(
    userSkills: any[],
    careerGoals: string[]
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Identify skill gaps with Analytics Service
      const skillGaps = await this.analyticsService.identifySkillGaps(
        this.userId,
        userSkills,
        careerGoals
      );

      return skillGaps;
    } catch (error) {
      console.error("Error identifying skill gaps:", error);
      throw error;
    }
  }

  /**
   * Generate personalized learning recommendations
   */
  public async generateRecommendations(
    learningHistory: any[],
    preferences: any
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Generate recommendations with Analytics Service
      const recommendations =
        await this.analyticsService.generateRecommendations(
          this.userId,
          learningHistory,
          preferences
        );

      return recommendations;
    } catch (error) {
      console.error("Error generating recommendations:", error);
      throw error;
    }
  }

  /**
   * Generate a personalized learning plan
   */
  public async generateLearningPlan(
    timeframe: string,
    focus: string
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Generate learning plan with Analytics Service
      const learningPlan = await this.analyticsService.generateLearningPlan(
        this.userId,
        timeframe,
        focus
      );

      return learningPlan;
    } catch (error) {
      console.error("Error generating learning plan:", error);
      throw error;
    }
  }

  /**
   * Analyze learning performance and generate metrics
   */
  public async analyzePerformance(assessmentResults: any[]): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Analyze performance with Analytics Service
      const performanceMetrics = await this.analyticsService.analyzePerformance(
        this.userId,
        assessmentResults
      );

      return performanceMetrics;
    } catch (error) {
      console.error("Error analyzing performance:", error);
      throw error;
    }
  }

  /**
   * Generate a personalized study plan
   */
  public async generateStudyPlan(
    topic: string,
    timeAvailable: string,
    skillLevel: string = "beginner"
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Generate study plan with Workflow Service
      const studyPlan = await this.workflowService.generateStudyPlan(
        this.userId,
        topic,
        timeAvailable,
        skillLevel
      );

      return studyPlan;
    } catch (error) {
      console.error("Error generating study plan:", error);
      throw error;
    }
  }

  /**
   * Optimize a learning path based on constraints
   */
  public async optimizeLearningPath(
    currentPath: any,
    constraints: any
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Optimize learning path with Workflow Service
      const optimizedPath = await this.workflowService.optimizeLearningPath(
        this.userId,
        currentPath,
        constraints
      );

      return optimizedPath;
    } catch (error) {
      console.error("Error optimizing learning path:", error);
      throw error;
    }
  }

  /**
   * Provide AI-powered learning assistance
   */
  public async provideLearningAssistance(
    query: string,
    context: any
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Provide assistance with Workflow Service
      const assistance = await this.workflowService.provideLearningAssistance(
        this.userId,
        query,
        context
      );

      return assistance;
    } catch (error) {
      console.error("Error providing learning assistance:", error);
      throw error;
    }
  }

  /**
   * Create a personalized learning workflow
   */
  public async createLearningWorkflow(
    goal: string,
    preferences: any
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Create workflow with Workflow Service
      const workflow = await this.workflowService.createLearningWorkflow(
        this.userId,
        goal,
        preferences
      );

      return workflow;
    } catch (error) {
      console.error("Error creating learning workflow:", error);
      throw error;
    }
  }

  /**
   * Provide AI-powered feedback on student work
   */
  public async provideFeedback(
    workType: string,
    submission: string,
    rubric: any
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Provide feedback with Workflow Service
      const feedback = await this.workflowService.provideFeedback(
        this.userId,
        workType,
        submission,
        rubric
      );

      return feedback;
    } catch (error) {
      console.error("Error providing feedback:", error);
      throw error;
    }
  }

  /**
   * Get active learning workflows
   */
  public async getActiveWorkflows(): Promise<any[]> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Get active workflows with Workflow Service
      const workflows = await this.workflowService.getActiveWorkflows(
        this.userId
      );

      return workflows;
    } catch (error) {
      console.error("Error getting active workflows:", error);
      return [];
    }
  }

  /**
   * Update workflow progress
   */
  public async updateWorkflowProgress(
    workflowId: string,
    progress: number,
    currentStage?: number
  ): Promise<any> {
    try {
      if (!this.initialized || !this.userId) {
        throw new Error("Nexus Core not initialized");
      }

      // Update workflow progress with Workflow Service
      const workflow = await this.workflowService.updateWorkflowProgress(
        this.userId,
        workflowId,
        progress,
        currentStage
      );

      return workflow;
    } catch (error) {
      console.error("Error updating workflow progress:", error);
      throw error;
    }
  }
}

export default NexusCore;
