"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import NexusCore from "@/lib/omnilearn/nexusCore";
import { getCurrentUser } from "@/lib/actions/auth.action";

// Define the context type
interface NexusContextType {
  nexusCore: NexusCore | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  userDid: string | null;
  tokenBalance: string | null;
  credentials: any | null;
  world: any | null;
  initializeNexus: (username: string) => Promise<void>;
  createLearningExperience: (
    topic: string,
    skillLevel?: string
  ) => Promise<any>;
  completeLearningActivity: (
    activityType: string,
    activityId: string,
    metadata: any
  ) => Promise<any>;
  issueSkillCredential: (
    skillName: string,
    skillLevel: string,
    assessmentResults: any
  ) => Promise<any>;
  createPersonalizedLearningPath: (
    goal: string,
    timeframe: string
  ) => Promise<any>;
  assessSkill: (topic: string) => Promise<any>;
  getUserDashboard: () => Promise<any>;
  createCollaborativeSpace: (
    name: string,
    topic: string,
    maxParticipants: number
  ) => Promise<any>;
  processLearningResponse: (
    sessionId: string,
    exerciseId: string,
    userResponse: string
  ) => Promise<any>;
}

// Create the context with default values
const NexusContext = createContext<NexusContextType>({
  nexusCore: null,
  isInitialized: false,
  isLoading: false,
  error: null,
  userDid: null,
  tokenBalance: null,
  credentials: null,
  world: null,
  initializeNexus: async () => {},
  createLearningExperience: async () => ({}),
  completeLearningActivity: async () => ({}),
  issueSkillCredential: async () => ({}),
  createPersonalizedLearningPath: async () => ({}),
  assessSkill: async () => ({}),
  getUserDashboard: async () => ({}),
  createCollaborativeSpace: async () => ({}),
  processLearningResponse: async () => ({}),
});

// Provider component
export const NexusProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [nexusCore, setNexusCore] = useState<NexusCore | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userDid, setUserDid] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<any | null>(null);
  const [world, setWorld] = useState<any | null>(null);

  // Initialize the Nexus Core
  const initializeNexus = async (username: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Get the Nexus Core instance
      const core = NexusCore.getInstance();

      // Get current user
      const user = await getCurrentUser();

      if (!user) {
        // For demo, create a mock user
        console.log("Creating mock user for demo");
        const mockUser = {
          id: "mock-user-id",
          name: username || "Demo User",
          email: `${username || "demo"}@example.com`,
        };

        // Initialize the core with mock user
        await core.initialize(mockUser.id);
      } else {
        // Initialize the core with real user
        await core.initialize(user.id);
      }

      // Ensure user has a DID
      let did = "";
      try {
        did = await core.ensureUserIdentity(username);
      } catch (didError) {
        console.warn("Error ensuring user identity:", didError);
        did = "did:omnilearn:mock-did-for-demo";
      }

      // Get initial dashboard data
      let dashboard = { tokenBalance: "0", credentials: null, world: null };
      try {
        dashboard = await core.getUserDashboard();
      } catch (dashboardError) {
        console.warn("Error getting dashboard data:", dashboardError);
      }

      // Update state
      setNexusCore(core);
      setUserDid(did);
      setTokenBalance(dashboard.tokenBalance || "0");
      setCredentials(dashboard.credentials || null);
      setWorld(dashboard.world || null);
      setIsInitialized(true);

      console.log("Nexus Context initialized successfully");
    } catch (err: any) {
      console.error("Error initializing Nexus Context:", err);
      setError(err.message || "Failed to initialize OmniLearn Nexus");

      // For demo purposes, set initialized to true anyway
      setIsInitialized(true);
      setUserDid("did:omnilearn:mock-did-for-demo");
      setTokenBalance("100");
    } finally {
      setIsLoading(false);
    }
  };

  // Create a learning experience
  const createLearningExperience = async (
    topic: string,
    skillLevel: string = "beginner"
  ) => {
    try {
      if (!nexusCore || !isInitialized) {
        throw new Error("Nexus Core not initialized");
      }

      setIsLoading(true);
      setError(null);

      const experience = await nexusCore.createLearningExperience(
        topic,
        skillLevel
      );

      // Update world state
      setWorld(experience.world);

      return experience;
    } catch (err: any) {
      console.error("Error creating learning experience:", err);
      setError(err.message || "Failed to create learning experience");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete a learning activity
  const completeLearningActivity = async (
    activityType: string,
    activityId: string,
    metadata: any
  ) => {
    try {
      if (!nexusCore || !isInitialized) {
        throw new Error("Nexus Core not initialized");
      }

      setIsLoading(true);
      setError(null);

      const result = await nexusCore.completeLearningActivity(
        activityType,
        activityId,
        metadata
      );

      // Update token balance
      setTokenBalance(result.newBalance);

      return result;
    } catch (err: any) {
      console.error("Error completing learning activity:", err);
      setError(err.message || "Failed to complete learning activity");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Issue a skill credential
  const issueSkillCredential = async (
    skillName: string,
    skillLevel: string,
    assessmentResults: any
  ) => {
    try {
      if (!nexusCore || !isInitialized) {
        throw new Error("Nexus Core not initialized");
      }

      setIsLoading(true);
      setError(null);

      const result = await nexusCore.issueSkillCredential(
        skillName,
        skillLevel,
        assessmentResults
      );

      // Update credentials
      const dashboard = await nexusCore.getUserDashboard();
      setCredentials(dashboard.credentials);

      return result;
    } catch (err: any) {
      console.error("Error issuing skill credential:", err);
      setError(err.message || "Failed to issue skill credential");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a personalized learning path
  const createPersonalizedLearningPath = async (
    goal: string,
    timeframe: string
  ) => {
    try {
      if (!nexusCore || !isInitialized) {
        throw new Error("Nexus Core not initialized");
      }

      setIsLoading(true);
      setError(null);

      const result = await nexusCore.createPersonalizedLearningPath(
        goal,
        timeframe
      );

      return result;
    } catch (err: any) {
      console.error("Error creating personalized learning path:", err);
      setError(err.message || "Failed to create learning path");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Assess a skill
  const assessSkill = async (topic: string) => {
    try {
      if (!nexusCore || !isInitialized) {
        throw new Error("Nexus Core not initialized");
      }

      setIsLoading(true);
      setError(null);

      const result = await nexusCore.assessSkill(topic);

      return result;
    } catch (err: any) {
      console.error("Error assessing skill:", err);
      setError(err.message || "Failed to assess skill");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get user dashboard
  const getUserDashboard = async () => {
    try {
      if (!nexusCore || !isInitialized) {
        throw new Error("Nexus Core not initialized");
      }

      setIsLoading(true);
      setError(null);

      const dashboard = await nexusCore.getUserDashboard();

      // Update state
      setTokenBalance(dashboard.tokenBalance);
      setCredentials(dashboard.credentials);
      setWorld(dashboard.world);

      return dashboard;
    } catch (err: any) {
      console.error("Error getting user dashboard:", err);
      setError(err.message || "Failed to get dashboard");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a collaborative space
  const createCollaborativeSpace = async (
    name: string,
    topic: string,
    maxParticipants: number
  ) => {
    try {
      if (!nexusCore || !isInitialized) {
        throw new Error("Nexus Core not initialized");
      }

      setIsLoading(true);
      setError(null);

      const space = await nexusCore.createCollaborativeSpace(
        name,
        topic,
        maxParticipants
      );

      return space;
    } catch (err: any) {
      console.error("Error creating collaborative space:", err);
      setError(err.message || "Failed to create collaborative space");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Process learning response
  const processLearningResponse = async (
    sessionId: string,
    exerciseId: string,
    userResponse: string
  ) => {
    try {
      if (!nexusCore || !isInitialized) {
        throw new Error("Nexus Core not initialized");
      }

      setIsLoading(true);
      setError(null);

      const feedback = await nexusCore.processLearningResponse(
        sessionId,
        exerciseId,
        userResponse
      );

      return feedback;
    } catch (err: any) {
      console.error("Error processing learning response:", err);
      setError(err.message || "Failed to process response");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const contextValue: NexusContextType = {
    nexusCore,
    isInitialized,
    isLoading,
    error,
    userDid,
    tokenBalance,
    credentials,
    world,
    initializeNexus,
    createLearningExperience,
    completeLearningActivity,
    issueSkillCredential,
    createPersonalizedLearningPath,
    assessSkill,
    getUserDashboard,
    createCollaborativeSpace,
    processLearningResponse,
  };

  return (
    <NexusContext.Provider value={contextValue}>
      {children}
    </NexusContext.Provider>
  );
};

// Custom hook to use the Nexus context
export const useNexus = () => useContext(NexusContext);

export default NexusContext;
