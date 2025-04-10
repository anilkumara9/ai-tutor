"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNexus } from "@/contexts/NexusContext";
import { toast } from "sonner";

interface LearningRecommendation {
  id: string;
  title: string;
  type: "course" | "project" | "resource" | "challenge";
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  relevanceScore: number;
  estimatedTime: string;
  skills: string[];
  prerequisites: string[];
  tokenReward: number;
  aiReasoning: string;
}

interface LearningInsight {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  actionable: boolean;
  suggestedActions: string[];
}

interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  relevance: number;
  recommendedResources: {
    id: string;
    title: string;
    type: string;
  }[];
}

const AILearningOrchestrator: React.FC = () => {
  const { credentials, learningHistory, userProfile } = useNexus();
  const [activeTab, setActiveTab] = useState("recommendations");
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [learningPlan, setLearningPlan] = useState<LearningRecommendation[]>([]);
  const [showAIReasoning, setShowAIReasoning] = useState<Record<string, boolean>>({});

  // Mock recommendations based on user profile and learning history
  const recommendations: LearningRecommendation[] = [
    {
      id: "rec-1",
      title: "Advanced Zero-Knowledge Proof Implementation",
      type: "course",
      description: "Master the implementation of zk-SNARKs and zk-STARKs for privacy-preserving applications on blockchain.",
      difficulty: "advanced",
      relevanceScore: 95,
      estimatedTime: "15 hours",
      skills: ["Zero-Knowledge Proofs", "Cryptography", "Privacy Engineering"],
      prerequisites: ["Cryptography Fundamentals", "Blockchain Development"],
      tokenReward: 250,
      aiReasoning: "Based on your recent completion of the Blockchain Security course and your interest in privacy technologies, this course will help you develop expertise in zero-knowledge cryptography. Your GitHub activity shows you've been exploring privacy protocols, and this aligns with the career path you've indicated in your profile. The high relevance score is due to the growing demand for ZK developers in the job market and your existing skill foundation."
    },
    {
      id: "rec-2",
      title: "Cross-Chain Interoperability Project",
      type: "project",
      description: "Build a cross-chain bridge using LayerZero protocol to transfer assets and data between Ethereum and other blockchains.",
      difficulty: "expert",
      relevanceScore: 88,
      estimatedTime: "25 hours",
      skills: ["Cross-Chain Development", "Smart Contracts", "Protocol Design"],
      prerequisites: ["Solidity", "Web3.js", "System Architecture"],
      tokenReward: 350,
      aiReasoning: "This project recommendation is based on your strong performance in smart contract development and your expressed interest in interoperability solutions. Your learning history shows you've completed courses on multiple blockchain platforms, making you well-positioned to work on cross-chain solutions. This project will also help you develop portfolio evidence for the 'Blockchain Architect' credential you're working toward."
    },
    {
      id: "rec-3",
      title: "DeFi Protocol Security Analysis",
      type: "challenge",
      description: "Analyze and identify vulnerabilities in a simulated DeFi protocol, focusing on economic attack vectors and smart contract security.",
      difficulty: "advanced",
      relevanceScore: 92,
      estimatedTime: "10 hours",
      skills: ["Security Auditing", "DeFi Mechanics", "Economic Analysis"],
      prerequisites: ["Smart Contract Security", "DeFi Fundamentals"],
      tokenReward: 200,
      aiReasoning: "Your recent activity in the DeFi space and your strong performance in security-related courses make this an ideal next challenge. I've noticed you've been exploring audit reports on GitHub, and this challenge will give you hands-on experience with identifying vulnerabilities. This aligns with the security specialization path you've been following and will complement your existing credentials in blockchain development."
    },
    {
      id: "rec-4",
      title: "Quantum-Resistant Cryptography for Blockchain",
      type: "resource",
      description: "Comprehensive guide to implementing quantum-resistant cryptographic algorithms in blockchain applications.",
      difficulty: "expert",
      relevanceScore: 85,
      estimatedTime: "8 hours",
      skills: ["Post-Quantum Cryptography", "Blockchain Security", "Cryptographic Implementation"],
      prerequisites: ["Advanced Cryptography", "Blockchain Development"],
      tokenReward: 150,
      aiReasoning: "Given your background in cryptography and your recent exploration of quantum computing topics (detected from your learning history), this resource will help you stay ahead of emerging threats to blockchain security. The quantum resistance field is rapidly growing, and this knowledge will significantly enhance your credential portfolio. Your previous completion of advanced cryptography courses indicates you have the necessary foundation to tackle this complex topic."
    }
  ];

  // Mock learning insights
  const learningInsights: LearningInsight[] = [
    {
      id: "insight-1",
      title: "Learning Pattern Analysis",
      description: "You show higher engagement and completion rates when learning in 45-minute sessions followed by short breaks. Your retention is 35% higher with this pattern.",
      impact: "high",
      actionable: true,
      suggestedActions: [
        "Schedule 45-minute focused learning blocks",
        "Use the Pomodoro technique with our integrated timer",
        "Take 10-minute breaks between sessions"
      ]
    },
    {
      id: "insight-2",
      title: "Skill Development Velocity",
      description: "Your progress in cryptography concepts is 2.3x faster than the average learner, but your practical implementation skills are developing more slowly.",
      impact: "medium",
      actionable: true,
      suggestedActions: [
        "Allocate more time to hands-on coding exercises",
        "Join the weekly coding challenges in the cryptography domain",
        "Participate in the upcoming hackathon to apply theoretical knowledge"
      ]
    },
    {
      id: "insight-3",
      title: "Knowledge Retention Pattern",
      description: "You revisit content most effectively 7 days after initial learning. Your quiz scores are 28% higher when following this spaced repetition pattern.",
      impact: "high",
      actionable: true,
      suggestedActions: [
        "Enable automated review reminders at 7-day intervals",
        "Use the spaced repetition flashcards for key concepts",
        "Schedule weekly review sessions for recently completed modules"
      ]
    }
  ];

  // Mock skill gaps
  const skillGaps: SkillGap[] = [
    {
      skill: "Zero-Knowledge Proof Implementation",
      currentLevel: 45,
      targetLevel: 80,
      relevance: 95,
      recommendedResources: [
        { id: "res-1", title: "ZK-SNARK Circuit Design", type: "course" },
        { id: "res-2", title: "Privacy Protocol Implementation", type: "project" }
      ]
    },
    {
      skill: "Cross-Chain Communication Protocols",
      currentLevel: 30,
      targetLevel: 75,
      relevance: 88,
      recommendedResources: [
        { id: "res-3", title: "LayerZero Protocol Deep Dive", type: "course" },
        { id: "res-4", title: "Building Cross-Chain Applications", type: "workshop" }
      ]
    },
    {
      skill: "Tokenomics Design",
      currentLevel: 60,
      targetLevel: 85,
      relevance: 82,
      recommendedResources: [
        { id: "res-5", title: "Advanced Tokenomics Modeling", type: "course" },
        { id: "res-6", title: "Token Engineering Simulation", type: "tool" }
      ]
    }
  ];

  const handleAcceptRecommendation = (recommendationId: string) => {
    setIsProcessing(true);
    toast.success("Processing your selection...");
    
    setTimeout(() => {
      toast.success("Added to your learning plan");
      setIsProcessing(false);
      
      // In a real implementation, this would update the user's learning plan
    }, 1500);
  };

  const handleGenerateLearningPlan = () => {
    setIsGeneratingPlan(true);
    toast.success("AI is analyzing your profile and learning history...");
    
    setTimeout(() => {
      toast.success("Generating personalized learning plan");
      
      setTimeout(() => {
        setLearningPlan(recommendations);
        setIsGeneratingPlan(false);
        toast.success("Your personalized learning plan is ready");
      }, 2000);
    }, 2000);
  };

  const toggleAIReasoning = (recommendationId: string) => {
    setShowAIReasoning(prev => ({
      ...prev,
      [recommendationId]: !prev[recommendationId]
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-500";
      case "intermediate":
        return "bg-blue-500/10 text-blue-500";
      case "advanced":
        return "bg-purple-500/10 text-purple-500";
      case "expert":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course":
        return "📚";
      case "project":
        return "🛠️";
      case "resource":
        return "📖";
      case "challenge":
        return "🏆";
      default:
        return "📋";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-green-500/10 text-green-500";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500";
      case "low":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
          AI Learning Orchestrator
        </CardTitle>
        <CardDescription>
          Your personalized AI-powered learning guide and recommendation engine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
            <TabsTrigger value="insights">Learning Insights</TabsTrigger>
            <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
            <TabsTrigger value="plan">Learning Plan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommendations" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Personalized Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  AI-generated recommendations based on your profile, skills, and learning history
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success("Refreshing recommendations...")}>
                Refresh
              </Button>
            </div>
            
            <div className="space-y-4">
              {recommendations.map((recommendation) => (
                <Card key={recommendation.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <span>{getTypeIcon(recommendation.type)}</span>
                        {recommendation.title}
                      </CardTitle>
                      <Badge className={getDifficultyColor(recommendation.difficulty)}>
                        {recommendation.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="flex justify-between">
                      <span>Relevance: {recommendation.relevanceScore}%</span>
                      <span>{recommendation.estimatedTime}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      {recommendation.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {recommendation.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-xs text-muted-foreground"
                      onClick={() => toggleAIReasoning(recommendation.id)}
                    >
                      {showAIReasoning[recommendation.id] ? "Hide AI reasoning" : "Show AI reasoning"}
                    </Button>
                    
                    {showAIReasoning[recommendation.id] && (
                      <div className="mt-2 p-3 bg-muted/30 rounded-md text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-medium">AI reasoning:</span> {recommendation.aiReasoning}
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="w-full flex justify-between">
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                        +{recommendation.tokenReward} $KNOW
                      </Badge>
                      <Button 
                        onClick={() => handleAcceptRecommendation(recommendation.id)}
                        disabled={isProcessing}
                      >
                        Add to Learning Plan
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">AI Learning Insights</h3>
              <p className="text-sm text-muted-foreground">
                Personalized insights based on your learning patterns and behaviors
              </p>
            </div>
            
            <div className="space-y-4">
              {learningInsights.map((insight) => (
                <Card key={insight.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base font-medium">
                        {insight.title}
                      </CardTitle>
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {insight.description}
                    </p>
                    
                    {insight.actionable && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Suggested Actions:</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {insight.suggestedActions.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Apply to My Learning Settings
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="gaps" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">AI-Detected Skill Gaps</h3>
              <p className="text-sm text-muted-foreground">
                Areas where additional learning would enhance your skill profile
              </p>
            </div>
            
            <div className="space-y-6">
              {skillGaps.map((gap) => (
                <Card key={gap.skill} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base font-medium">
                        {gap.skill}
                      </CardTitle>
                      <Badge variant="outline">
                        Relevance: {gap.relevance}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Level: {gap.currentLevel}%</span>
                        <span>Target Level: {gap.targetLevel}%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${gap.currentLevel}%` }}
                        />
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden opacity-30">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${gap.targetLevel}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recommended Resources:</h4>
                      <div className="space-y-2">
                        {gap.recommendedResources.map((resource) => (
                          <div key={resource.id} className="flex justify-between items-center p-2 bg-muted/30 rounded-md">
                            <span className="text-sm">{resource.title}</span>
                            <Badge variant="outline">{resource.type}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">
                      Address This Skill Gap
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="plan" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">AI-Generated Learning Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Your personalized roadmap to achieve your learning goals
                </p>
              </div>
              <Button 
                onClick={handleGenerateLearningPlan}
                disabled={isGeneratingPlan}
              >
                {isGeneratingPlan ? "Generating..." : "Generate Plan"}
              </Button>
            </div>
            
            {learningPlan.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Plan Overview</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This learning plan is optimized for your skill development goals and learning patterns. It includes a balanced mix of theoretical learning and practical application.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Estimated completion time:</span> 58 hours
                    </div>
                    <div>
                      <span className="font-medium">Total token rewards:</span> 950 $KNOW
                    </div>
                    <div>
                      <span className="font-medium">Focus areas:</span> Cryptography, Cross-Chain, Security
                    </div>
                    <div>
                      <span className="font-medium">Target credentials:</span> 3
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Recommended Learning Sequence</h4>
                  <div className="space-y-3">
                    {learningPlan.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.estimatedTime} • {item.type}</div>
                        </div>
                        <Badge className={getDifficultyColor(item.difficulty)}>
                          {item.difficulty}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    Activate Learning Plan
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-muted/20 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground mb-4"
                >
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
                <h3 className="font-medium text-center">
                  No Learning Plan Generated Yet
                </h3>
                <p className="text-sm text-muted-foreground text-center mt-1 max-w-md">
                  Click the "Generate Plan" button to have our AI create a personalized learning plan based on your profile, skills, and goals.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AILearningOrchestrator;
