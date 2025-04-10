"use client";

import React, { useEffect, useState } from "react";
import { useNexus } from "@/contexts/NexusContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Import our new advanced components
import AdvancedLearningAnalytics from "./AdvancedLearningAnalytics";
import EnhancedAITutor from "./EnhancedAITutor";
import BlockchainLearningPath from "./BlockchainLearningPath";
import DynamicNFTCredential from "./DynamicNFTCredential";
import DecentralizedIdentity from "./DecentralizedIdentity";
import DAOGovernance from "./DAOGovernance";

const NexusDashboard: React.FC = () => {
  const {
    isInitialized,
    isLoading,
    error,
    userDid,
    tokenBalance,
    credentials,
    world,
    getUserDashboard,
    initializeNexus,
  } = useNexus();

  const [activeTab, setActiveTab] = useState("overview");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // If not initialized, initialize with default username
    if (!isInitialized && !isLoading) {
      const defaultUsername = "OmniLearner";
      setUsername(defaultUsername);
      initializeNexus(defaultUsername);
    }
  }, [isInitialized, isLoading, initializeNexus]);

  // Refresh dashboard data
  const refreshDashboard = async () => {
    if (isInitialized) {
      await getUserDashboard();
    }
  };

  // Format credentials for display
  const formatCredentials = () => {
    if (!credentials) return [];

    const allCredentials = [
      ...(credentials.livingCredentials || []).map((cred: any) => ({
        ...cred,
        type: "Living Credential",
        icon: "/icons/living-credential.svg",
      })),
      ...(credentials.verifiableCredentials || []).map((cred: any) => ({
        ...cred,
        type: "Verifiable Credential",
        icon: "/icons/verifiable-credential.svg",
      })),
    ];

    return allCredentials;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-lg">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-red-700">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => initializeNexus(username)}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading && !isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">Initializing OmniLearn Nexus...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">OmniLearn Nexus Dashboard</h1>
          <p className="text-muted-foreground">
            Your decentralized learning journey
          </p>
        </div>
        <Button onClick={refreshDashboard} disabled={isLoading}>
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* User Identity Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Self-Sovereign Identity</CardTitle>
          <CardDescription>
            Your decentralized identity on OmniLearn Nexus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Decentralized Identifier (DID)</h3>
              <p className="text-sm text-muted-foreground break-all">
                {userDid || "Not available"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-8 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="learning">Learning Path</TabsTrigger>
          <TabsTrigger value="ai-tutor">AI Tutor</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="governance">DAO</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Credentials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {credentials
                    ? (credentials.livingCredentials?.length || 0) +
                      (credentials.verifiableCredentials?.length || 0)
                    : "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all credential types
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Knowledge Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tokenBalance || "0"} $KNOW
                </div>
                <p className="text-xs text-muted-foreground">
                  Earned through learning activities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Learning Worlds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{world ? "1" : "0"}</div>
                <p className="text-xs text-muted-foreground">
                  Personalized learning environments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest learning activities and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for recent activity */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      Completed Introduction to Blockchain
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Earned 5 $KNOW tokens
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    2 hours ago
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      Received Beginner Blockchain Credential
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Verified on-chain
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">1 day ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <AdvancedLearningAnalytics />
        </TabsContent>

        {/* Learning Path Tab */}
        <TabsContent value="learning">
          <BlockchainLearningPath />
        </TabsContent>

        {/* AI Tutor Tab */}
        <TabsContent value="ai-tutor">
          <EnhancedAITutor />
        </TabsContent>

        {/* Credentials Tab */}
        <TabsContent value="credentials">
          <DynamicNFTCredential />
        </TabsContent>

        {/* Identity Tab */}
        <TabsContent value="identity">
          <DecentralizedIdentity />
        </TabsContent>

        {/* Governance Tab */}
        <TabsContent value="governance">
          <DAOGovernance />
        </TabsContent>

        {/* Legacy Credentials Tab - Keeping for backward compatibility */}
        <TabsContent value="credentials-legacy">
          <Card>
            <CardHeader>
              <CardTitle>Your Credentials</CardTitle>
              <CardDescription>
                All your earned credentials and certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formatCredentials().length > 0 ? (
                  formatCredentials().map((credential: any, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">
                              {credential.skill || credential.type}
                            </h3>
                            <p className="text-sm">
                              {credential.level || "N/A"}
                            </p>
                          </div>
                          <div className="bg-background rounded-full p-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary"
                            >
                              <path d="M12 15l-2-6 6-2-4 8z"></path>
                              <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground mb-2">
                          {credential.type}
                        </div>
                        <div className="text-sm mb-4">
                          {credential.metadata?.description ||
                            "No description available"}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>ID: {credential.tokenId || credential.id}</span>
                          <span>
                            Issued:{" "}
                            {new Date(
                              credential.metadata?.issuanceDate || Date.now()
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg">
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
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                    <h3 className="font-medium text-center">
                      No Credentials Yet
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      Complete learning activities to earn credentials
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skillverse Tab */}
        <TabsContent value="skillverse">
          <Card>
            <CardHeader>
              <CardTitle>Your Skillverse</CardTitle>
              <CardDescription>
                Explore your personalized learning metaverse
              </CardDescription>
            </CardHeader>
            <CardContent>
              {world ? (
                <div>
                  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-48 rounded-lg flex items-center justify-center mb-4">
                    <h3 className="text-white text-xl font-bold">
                      {world.name}
                    </h3>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium mb-2">World Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {world.description}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium mb-2">
                      Central Hub: {world.centralHub.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {world.centralHub.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Learning Zones</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {world.zones.map((zone: any, index: number) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              {zone.name}
                            </CardTitle>
                            <CardDescription>{zone.subTopic}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{zone.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-lg">
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                  <h3 className="font-medium text-center">
                    No Skillverse Created Yet
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mt-1">
                    Start a learning experience to generate your personalized
                    world
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tokens Tab */}
        <TabsContent value="tokens">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Tokens</CardTitle>
              <CardDescription>
                Your learn-to-earn token economy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Token Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-yellow-600"
                        >
                          <circle cx="12" cy="12" r="8"></circle>
                          <path d="M12 2v2"></path>
                          <path d="M12 20v2"></path>
                          <path d="M20 12h2"></path>
                          <path d="M2 12h2"></path>
                        </svg>
                      </div>
                      <div className="text-2xl font-bold">
                        {tokenBalance || "0"} $KNOW
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Tokens can be used for platform benefits and governance
                    </p>
                  </CardContent>
                </Card>

                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Staking Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-600"
                        >
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="M2 17l10 5 10-5"></path>
                          <path d="M2 12l10 5 10-5"></path>
                        </svg>
                      </div>
                      <div className="text-2xl font-bold">0 $KNOW</div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Not currently staking any tokens
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-4">Token Utility</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                      <h4 className="font-medium">Governance</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Vote on platform decisions and proposals
                    </p>
                  </div>

                  <div className="bg-muted/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                        <line x1="12" y1="16" x2="12" y2="16"></line>
                        <line x1="12" y1="8" x2="12" y2="8"></line>
                      </svg>
                      <h4 className="font-medium">Premium Content</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Access exclusive learning materials
                    </p>
                  </div>

                  <div className="bg-muted/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <h4 className="font-medium">Metaverse Assets</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Purchase virtual land and learning assets
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NexusDashboard;
