"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NexusProvider } from "@/contexts/NexusContext";
import NexusDashboard from "@/components/nexus/NexusDashboard";
import LearningExperience from "@/components/nexus/LearningExperience";

const NexusClient = () => {
  // Add this to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create a consistent UI structure for both server and client render
  return (
    <NexusProvider>
      <div className="container mx-auto p-4" suppressHydrationWarning>
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          {/* Use the same structure but hide content until mounted */}
          <h1
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text"
            suppressHydrationWarning
          >
            {mounted ? "OmniLearn Nexus" : "Loading..."}
          </h1>
          {mounted && (
            <p
              className="text-xl mt-2 text-muted-foreground max-w-2xl"
              suppressHydrationWarning
            >
              Decentralized, Self-Sovereign Learning Metaverse
            </p>
          )}
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="learn">Learning Experience</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            {mounted ? <NexusDashboard /> : <div>Loading dashboard...</div>}
          </TabsContent>
          <TabsContent value="learn">
            {mounted ? (
              <LearningExperience />
            ) : (
              <div>Loading learning experience...</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </NexusProvider>
  );
};

export default NexusClient;
