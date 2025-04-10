"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useNexus } from "@/contexts/NexusContext";
import { toast } from "sonner";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  progress: number;
  skills: string[];
  tokenReward: number;
}

const BlockchainLearningPath: React.FC = () => {
  const { isInitialized, completeLearningActivity } = useNexus();
  const [selectedPath, setSelectedPath] = useState<string>("blockchain-fundamentals");

  // Mock learning paths
  const learningPaths = {
    "blockchain-fundamentals": {
      title: "Blockchain Fundamentals",
      description: "Master the core concepts of blockchain technology and distributed ledgers",
      modules: [
        {
          id: "module-1",
          title: "Blockchain Basics",
          description: "Introduction to distributed ledger technology and blockchain fundamentals",
          difficulty: "beginner" as const,
          duration: "2 hours",
          progress: 100,
          skills: ["Blockchain", "Cryptography", "Distributed Systems"],
          tokenReward: 5
        },
        {
          id: "module-2",
          title: "Consensus Mechanisms",
          description: "Explore Proof of Work, Proof of Stake, and other consensus algorithms",
          difficulty: "beginner" as const,
          duration: "3 hours",
          progress: 75,
          skills: ["Consensus Algorithms", "Network Security", "Distributed Systems"],
          tokenReward: 8
        },
        {
          id: "module-3",
          title: "Cryptographic Primitives",
          description: "Learn about hash functions, digital signatures, and encryption in blockchain",
          difficulty: "intermediate" as const,
          duration: "4 hours",
          progress: 30,
          skills: ["Cryptography", "Security", "Mathematics"],
          tokenReward: 10
        },
        {
          id: "module-4",
          title: "Smart Contracts",
          description: "Introduction to programmable blockchain applications and smart contracts",
          difficulty: "intermediate" as const,
          duration: "5 hours",
          progress: 0,
          skills: ["Smart Contracts", "Solidity", "dApps"],
          tokenReward: 15
        }
      ]
    },
    "defi-mastery": {
      title: "DeFi Mastery",
      description: "Explore decentralized finance protocols, mechanisms, and applications",
      modules: [
        {
          id: "defi-1",
          title: "DeFi Fundamentals",
          description: "Introduction to decentralized finance and its core components",
          difficulty: "intermediate" as const,
          duration: "3 hours",
          progress: 50,
          skills: ["DeFi", "Finance", "Blockchain"],
          tokenReward: 10
        },
        {
          id: "defi-2",
          title: "Lending & Borrowing Protocols",
          description: "Explore decentralized lending platforms like Aave and Compound",
          difficulty: "intermediate" as const,
          duration: "4 hours",
          progress: 25,
          skills: ["DeFi", "Lending", "Risk Management"],
          tokenReward: 12
        },
        {
          id: "defi-3",
          title: "Decentralized Exchanges",
          description: "Understanding AMMs, order books, and DEX architectures",
          difficulty: "advanced" as const,
          duration: "5 hours",
          progress: 0,
          skills: ["DEX", "AMM", "Liquidity"],
          tokenReward: 15
        },
        {
          id: "defi-4",
          title: "Yield Farming & Liquidity Mining",
          description: "Advanced strategies for maximizing returns in DeFi",
          difficulty: "advanced" as const,
          duration: "6 hours",
          progress: 0,
          skills: ["Yield Farming", "Liquidity", "Risk Management"],
          tokenReward: 20
        }
      ]
    },
    "web3-development": {
      title: "Web3 Development",
      description: "Build decentralized applications with modern Web3 technologies",
      modules: [
        {
          id: "web3-1",
          title: "Web3.js & Ethers.js",
          description: "Learn to interact with blockchain using JavaScript libraries",
          difficulty: "intermediate" as const,
          duration: "4 hours",
          progress: 40,
          skills: ["JavaScript", "Web3", "Frontend"],
          tokenReward: 12
        },
        {
          id: "web3-2",
          title: "Smart Contract Development",
          description: "Write, test and deploy smart contracts with Solidity",
          difficulty: "intermediate" as const,
          duration: "6 hours",
          progress: 10,
          skills: ["Solidity", "Smart Contracts", "Testing"],
          tokenReward: 15
        },
        {
          id: "web3-3",
          title: "dApp Architecture",
          description: "Design patterns for decentralized application development",
          difficulty: "advanced" as const,
          duration: "5 hours",
          progress: 0,
          skills: ["Architecture", "dApps", "Frontend"],
          tokenReward: 18
        },
        {
          id: "web3-4",
          title: "Zero-Knowledge Applications",
          description: "Building privacy-preserving applications with ZK proofs",
          difficulty: "advanced" as const,
          duration: "8 hours",
          progress: 0,
          skills: ["ZK Proofs", "Privacy", "Cryptography"],
          tokenReward: 25
        }
      ]
    }
  };

  const handleContinueModule = async (moduleId: string) => {
    try {
      toast.success("Module progress updated");
      
      // In a real implementation, this would call the completeLearningActivity function
      // await completeLearningActivity("module_progress", moduleId, {
      //   progress: 10, // Increment by 10%
      //   timestamp: new Date().toISOString()
      // });
    } catch (error) {
      console.error("Error updating module progress:", error);
      toast.error("Failed to update module progress");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "intermediate":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "advanced":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  const currentPath = learningPaths[selectedPath as keyof typeof learningPaths];
  const overallProgress = currentPath.modules.reduce((sum, module) => sum + module.progress, 0) / currentPath.modules.length;

  if (!isInitialized) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center">Please initialize OmniLearn Nexus first</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
          Blockchain Learning Paths
        </CardTitle>
        <CardDescription>
          Structured learning journeys to master blockchain technology
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {Object.keys(learningPaths).map((pathId) => (
            <Button
              key={pathId}
              variant={selectedPath === pathId ? "default" : "outline"}
              onClick={() => setSelectedPath(pathId)}
              className="whitespace-nowrap"
            >
              {learningPaths[pathId as keyof typeof learningPaths].title}
            </Button>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">{currentPath.title}</h3>
            <Badge variant="outline" className="bg-primary/10">
              {Math.round(overallProgress)}% Complete
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{currentPath.description}</p>
          <Progress value={overallProgress} className="h-2 mb-6" />
        </div>

        <div className="space-y-4">
          {currentPath.modules.map((module) => (
            <Card key={module.id} className="overflow-hidden">
              <div className="relative">
                <Progress value={module.progress} className="h-1 w-full absolute top-0" />
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{module.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className={getDifficultyColor(module.difficulty)}>
                          {module.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {module.duration}
                        </Badge>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                          +{module.tokenReward} $KNOW
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {module.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      disabled={module.progress === 100}
                      onClick={() => handleContinueModule(module.id)}
                    >
                      {module.progress === 0
                        ? "Start"
                        : module.progress === 100
                        ? "Completed"
                        : "Continue"}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainLearningPath;
