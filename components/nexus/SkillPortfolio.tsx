"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNexus } from "@/contexts/NexusContext";
import { toast } from "sonner";

interface Credential {
  id: string;
  name: string;
  issueDate: string;
  skills: string[];
  level: string;
  verified: boolean;
  feedback?: string;
  projects?: Project[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  link?: string;
  imageUrl?: string;
}

const SkillPortfolio: React.FC = () => {
  const { isInitialized, credentials } = useNexus();
  const [userCredentials, setUserCredentials] = useState<Credential[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("credentials");
  const [verificationLink, setVerificationLink] = useState<string | null>(null);

  // Mock data for credentials
  const mockCredentials: Credential[] = [
    {
      id: "cred-1",
      name: "Python Basics",
      issueDate: "2025-02-15",
      skills: ["Variables", "Functions", "Data Structures", "File I/O", "Error Handling"],
      level: "Intermediate",
      verified: true,
      feedback: "John excels in problem-solving but needs practice with recursion.",
      projects: [
        {
          id: "proj-1",
          title: "Data Analysis Tool",
          description: "A command-line tool for analyzing CSV data files",
          skills: ["Python", "Data Analysis", "File I/O"],
          link: "https://github.com/johndoe/data-analyzer"
        }
      ]
    },
    {
      id: "cred-2",
      name: "Web Development Fundamentals",
      issueDate: "2025-03-10",
      skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      level: "Beginner",
      verified: true,
      feedback: "Shows strong understanding of layout principles. Continue practicing JavaScript DOM manipulation.",
      projects: [
        {
          id: "proj-2",
          title: "Personal Portfolio Website",
          description: "A responsive portfolio website showcasing projects",
          skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
          link: "https://johndoe-portfolio.netlify.app"
        }
      ]
    },
    {
      id: "cred-3",
      name: "Blockchain Fundamentals",
      issueDate: "2025-04-05",
      skills: ["Blockchain Basics", "Cryptography", "Smart Contracts"],
      level: "Beginner",
      verified: true,
      feedback: "Good grasp of blockchain concepts. Focus on practical applications of smart contracts next.",
      projects: []
    }
  ];

  // Mock data for projects
  const mockProjects: Project[] = [
    {
      id: "proj-1",
      title: "Data Analysis Tool",
      description: "A command-line tool for analyzing CSV data files and generating reports with visualizations.",
      skills: ["Python", "Data Analysis", "File I/O", "Data Visualization"],
      link: "https://github.com/johndoe/data-analyzer",
      imageUrl: "/projects/data-analyzer.png"
    },
    {
      id: "proj-2",
      title: "Personal Portfolio Website",
      description: "A responsive portfolio website showcasing projects and skills using modern web technologies.",
      skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      link: "https://johndoe-portfolio.netlify.app",
      imageUrl: "/projects/portfolio.png"
    },
    {
      id: "proj-3",
      title: "Blockchain Voting App",
      description: "A decentralized voting application built on Ethereum using smart contracts.",
      skills: ["Solidity", "Ethereum", "Web3.js", "React"],
      link: "https://github.com/johndoe/blockchain-voting",
      imageUrl: "/projects/blockchain-voting.png"
    }
  ];

  // Initialize data
  useEffect(() => {
    setUserCredentials(mockCredentials);
    setProjects(mockProjects);
  }, []);

  const handleVerifyCredential = (credentialId: string) => {
    // Generate a verification link that would normally connect to the blockchain
    const verificationUrl = `verify-certificate.com/johndoe-${credentialId}`;
    setVerificationLink(verificationUrl);
    toast.success("Verification link generated. Share this with employers to verify your credentials.");
  };

  const handleShareCredential = (credentialId: string) => {
    // In a real implementation, this would generate a shareable link or QR code
    navigator.clipboard.writeText(`https://verify-certificate.com/johndoe-${credentialId}`);
    toast.success("Credential verification link copied to clipboard!");
  };

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
          Skill Portfolio
        </CardTitle>
        <CardDescription>
          Showcase your verified credentials, projects, and skills to potential employers
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="profile">Public Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="credentials" className="space-y-4 p-6">
          <div className="space-y-6">
            {userCredentials.map(credential => (
              <Card key={credential.id} className="overflow-hidden border">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{credential.name}</h3>
                        {credential.verified && (
                          <Badge variant="default" className="bg-green-600">Verified</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Issued: {credential.issueDate} • Level: {credential.level}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-1">Skills</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {credential.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="bg-primary/5">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    {credential.feedback && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">AI Tutor Feedback</h4>
                        <p className="text-sm italic bg-secondary/30 p-2 rounded-md">"{credential.feedback}"</p>
                      </div>
                    )}
                    
                    {credential.projects && credential.projects.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-1">Related Projects</h4>
                        <ul className="text-sm space-y-1">
                          {credential.projects.map(project => (
                            <li key={project.id} className="flex items-center gap-2">
                              <span>•</span>
                              <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {project.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-muted/20 p-3 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleVerifyCredential(credential.id)}>
                    Generate Verification Link
                  </Button>
                  <Button size="sm" onClick={() => handleShareCredential(credential.id)}>
                    Share Credential
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          {verificationLink && (
            <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
              <h3 className="font-medium mb-2">Verification Link</h3>
              <p className="text-sm break-all">{`https://${verificationLink}`}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Share this link with employers to verify your credentials on the blockchain.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(project => (
              <Card key={project.id} className="overflow-hidden">
                {project.imageUrl && (
                  <div className="aspect-video w-full bg-secondary/30 flex items-center justify-center">
                    <div className="text-center p-4">
                      <p className="text-sm text-muted-foreground">[Project Screenshot]</p>
                    </div>
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  
                  <div className="mt-3">
                    <h4 className="text-xs font-medium mb-1">Skills Used</h4>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {project.link && (
                    <div className="mt-3">
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Project →
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="profile" className="p-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <div className="aspect-square w-full bg-secondary/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground">[Profile Photo]</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <div>
                    <h3 className="text-sm font-medium">Public Verification URL</h3>
                    <p className="text-sm text-blue-600 break-all">https://verify-certificate.com/johndoe</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Total Credentials</h3>
                    <p className="text-2xl font-bold">{userCredentials.length}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium">Projects Completed</h3>
                    <p className="text-2xl font-bold">{projects.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-2/3 space-y-6">
                <div>
                  <h2 className="text-xl font-bold">John Doe</h2>
                  <p className="text-muted-foreground">Aspiring Developer & Blockchain Enthusiast</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">About Me</h3>
                  <p className="text-sm">
                    I'm a self-taught developer passionate about blockchain technology and web development.
                    Currently learning Python for data science and exploring smart contract development.
                    Looking for entry-level opportunities in web development or blockchain projects.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Skills Summary</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(userCredentials.flatMap(cred => cred.skills))).map(skill => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">AI Tutor Insights</h3>
                  <div className="space-y-2">
                    <div className="bg-secondary/30 p-3 rounded-md">
                      <p className="text-sm italic">
                        "John shows strong problem-solving abilities and a methodical approach to learning. 
                        Excels in understanding core concepts quickly but should focus more on practical applications."
                      </p>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-md">
                      <p className="text-sm italic">
                        "Demonstrates particular aptitude for web development and UI design. 
                        Recommended next steps: deepen JavaScript knowledge and explore React framework."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button>
                Generate Public Profile Link
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SkillPortfolio;
