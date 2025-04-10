// Skill credential interface
export interface SkillCredential {
  id: string;
  name: string;
  level: string;
  issuer: string;
  issuedAt: number;
  metadata: {
    description: string;
    category: string;
    evidence?: string[];
    endorsements?: string[];
  };
}

// Soulbound token (certificate) interface
export interface SoulboundToken {
  id: string;
  name: string;
  type: string;
  issuer: string;
  issuedAt: number;
  isRevoked: boolean;
  metadata: {
    description: string;
    issuerName: string;
    issuerLogo?: string;
    credentialSubject: {
      id: string;
      name: string;
      achievements?: string[];
      skills?: string[];
    };
    evidence?: {
      type: string;
      url: string;
      description: string;
    }[];
  };
}

// Dynamic NFT interface
export interface DynamicNFT {
  tokenId: string;
  skillId: string;
  owner: string;
  level: string;
  experience: number;
  lastUpdated: number;
  upgradeHistory: {
    level: string;
    timestamp: number;
  }[];
}

// Governance proposal interface
export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  startBlock: number;
  endBlock: number;
  status: 'active' | 'passed' | 'failed' | 'executed' | 'canceled';
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
  actions: {
    target: string;
    value: string;
    signature: string;
    calldata: string;
    description: string;
  }[];
  hasVoted?: boolean;
}

// Learning path interface
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  creator: string;
  skillsRequired: string[];
  skillsGained: string[];
  modules: {
    id: string;
    title: string;
    description: string;
    content: string;
    resources: string[];
    quiz: {
      questions: {
        question: string;
        options: string[];
        correctAnswer: number;
      }[];
    };
  }[];
  endorsements: {
    endorser: string;
    comment: string;
    rating: number;
  }[];
}

// User profile interface
export interface UserProfile {
  address: string;
  username: string;
  bio: string;
  avatar: string;
  skills: SkillCredential[];
  certificates: SoulboundToken[];
  learningPaths: {
    pathId: string;
    progress: number;
    completed: boolean;
    startedAt: number;
    completedAt?: number;
  }[];
  contributions: {
    type: 'content' | 'review' | 'governance';
    id: string;
    timestamp: number;
    description: string;
  }[];
  reputation: number;
}

// Skill assessment interface
export interface SkillAssessment {
  id: string;
  skillName: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }[];
  passingScore: number;
  timeLimit: number; // in seconds
  attempts: {
    userId: string;
    score: number;
    passed: boolean;
    timestamp: number;
  }[];
}

// Mentor-mentee relationship interface
export interface MentorshipRelationship {
  id: string;
  mentor: string;
  mentee: string;
  skills: string[];
  startDate: number;
  endDate?: number;
  status: 'active' | 'completed' | 'canceled';
  sessions: {
    id: string;
    date: number;
    duration: number; // in minutes
    notes: string;
    feedback: {
      rating: number;
      comment: string;
    };
  }[];
}

// Community forum post interface
export interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  upvotes: number;
  downvotes: number;
  replies: {
    id: string;
    author: string;
    content: string;
    createdAt: number;
    updatedAt: number;
    upvotes: number;
    downvotes: number;
  }[];
}
