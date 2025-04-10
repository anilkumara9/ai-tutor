"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNexus } from "@/contexts/NexusContext";
import { toast } from "sonner";

interface CredentialAttribute {
  trait_type: string;
  value: string | number;
}

interface CredentialMetadata {
  name: string;
  description: string;
  image: string;
  attributes: CredentialAttribute[];
  skill: string;
  level: string;
  issueDate: string;
  lastUpdated: string;
  usageData: {
    commits?: number;
    contributions?: number;
    projects?: number;
    endorsements?: number;
  };
  subCredentials: string[];
  zkProofs: string[];
}

const DynamicNFTCredential: React.FC = () => {
  const { credentials } = useNexus();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
  const [credentialData, setCredentialData] = useState<CredentialMetadata | null>(null);
  const [animationFrame, setAnimationFrame] = useState<number>(0);
  const [showZkProof, setShowZkProof] = useState<boolean>(false);

  // Enhanced mock credential data
  const mockCredentials: Record<string, CredentialMetadata> = {
    "blockchain-dev": {
      name: "Advanced Blockchain Developer",
      description: "Dynamic credential that evolves based on real-world contributions to blockchain projects",
      image: "/credentials/blockchain-dev.png",
      attributes: [
        { trait_type: "Skill Category", value: "Development" },
        { trait_type: "Proficiency", value: 85 },
        { trait_type: "Experience", value: "3 years" },
        { trait_type: "Specialty", value: "Smart Contracts" }
      ],
      skill: "Blockchain Development",
      level: "Advanced",
      issueDate: "2023-08-15",
      lastUpdated: "2023-11-23",
      usageData: {
        commits: 347,
        contributions: 28,
        projects: 12,
        endorsements: 15
      },
      subCredentials: [
        "Solidity Expert",
        "EVM Architecture",
        "Gas Optimization"
      ],
      zkProofs: [
        "zk-STARK proof of coding skill",
        "Zero-knowledge proof of contribution history"
      ]
    },
    "defi-architect": {
      name: "DeFi Protocol Architect",
      description: "Expertise in designing and implementing decentralized finance protocols",
      image: "/credentials/defi-architect.png",
      attributes: [
        { trait_type: "Skill Category", value: "Architecture" },
        { trait_type: "Proficiency", value: 92 },
        { trait_type: "Experience", value: "2 years" },
        { trait_type: "Specialty", value: "Lending Protocols" }
      ],
      skill: "DeFi Architecture",
      level: "Expert",
      issueDate: "2023-05-10",
      lastUpdated: "2023-12-05",
      usageData: {
        commits: 215,
        contributions: 18,
        projects: 7,
        endorsements: 23
      },
      subCredentials: [
        "AMM Design",
        "Yield Optimization",
        "Risk Management"
      ],
      zkProofs: [
        "zk-SNARK proof of protocol design",
        "Zero-knowledge proof of security audit participation"
      ]
    },
    "zk-specialist": {
      name: "Zero-Knowledge Specialist",
      description: "Mastery of zero-knowledge cryptography and its applications in blockchain",
      image: "/credentials/zk-specialist.png",
      attributes: [
        { trait_type: "Skill Category", value: "Cryptography" },
        { trait_type: "Proficiency", value: 88 },
        { trait_type: "Experience", value: "1.5 years" },
        { trait_type: "Specialty", value: "ZK-Rollups" }
      ],
      skill: "Zero-Knowledge Cryptography",
      level: "Specialist",
      issueDate: "2023-09-22",
      lastUpdated: "2023-12-10",
      usageData: {
        commits: 178,
        contributions: 12,
        projects: 5,
        endorsements: 19
      },
      subCredentials: [
        "ZK-Rollup Implementation",
        "Privacy Protocol Design",
        "ZK Circuit Optimization"
      ],
      zkProofs: [
        "Recursive SNARK proof of ZK knowledge",
        "Zero-knowledge proof of cryptographic expertise"
      ]
    }
  };

  useEffect(() => {
    // Set default selected credential
    if (!selectedCredential && Object.keys(mockCredentials).length > 0) {
      setSelectedCredential(Object.keys(mockCredentials)[0]);
    }
  }, [selectedCredential]);

  useEffect(() => {
    if (selectedCredential) {
      setCredentialData(mockCredentials[selectedCredential]);
    }
  }, [selectedCredential]);

  // Canvas animation for the dynamic credential
  useEffect(() => {
    if (!canvasRef.current || !credentialData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
    }> = [];

    const colors = [
      'rgba(59, 130, 246, 0.7)',  // Blue
      'rgba(147, 51, 234, 0.7)',  // Purple
      'rgba(236, 72, 153, 0.7)',  // Pink
      'rgba(16, 185, 129, 0.7)',  // Green
      'rgba(245, 158, 11, 0.7)'   // Yellow
    ];

    // Create particles based on credential attributes
    const initParticles = () => {
      particles = [];
      const numParticles = 50 + Math.floor((credentialData.usageData.commits || 0) / 10);
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 1 + 0.2,
          angle: Math.random() * Math.PI * 2
        });
      }
    };

    const drawCredential = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(17, 24, 39, 0.8)');
      gradient.addColorStop(1, 'rgba(31, 41, 55, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Update particle position
        particle.x += Math.cos(particle.angle) * particle.speed;
        particle.y += Math.sin(particle.angle) * particle.speed;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      // Draw credential name
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(credentialData.name, canvas.width / 2, 40);
      
      // Draw skill level
      ctx.font = '16px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(`${credentialData.skill} - ${credentialData.level}`, canvas.width / 2, 70);
      
      // Draw dynamic elements based on usage data
      const usageData = credentialData.usageData;
      
      // Draw commit activity
      if (usageData.commits) {
        const commitRadius = Math.min(100, 30 + usageData.commits / 10);
        const commitX = canvas.width / 4;
        const commitY = canvas.height / 2;
        
        ctx.beginPath();
        ctx.arc(commitX, commitY, commitRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(usageData.commits.toString(), commitX, commitY);
        ctx.font = '12px sans-serif';
        ctx.fillText('Commits', commitX, commitY + 20);
      }
      
      // Draw endorsements
      if (usageData.endorsements) {
        const endorseRadius = Math.min(80, 20 + usageData.endorsements * 2);
        const endorseX = (canvas.width / 4) * 3;
        const endorseY = canvas.height / 2;
        
        ctx.beginPath();
        ctx.arc(endorseX, endorseY, endorseRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(236, 72, 153, 0.2)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(usageData.endorsements.toString(), endorseX, endorseY);
        ctx.font = '12px sans-serif';
        ctx.fillText('Endorsements', endorseX, endorseY + 20);
      }
      
      // Draw connection lines
      ctx.beginPath();
      ctx.moveTo(canvas.width / 4, canvas.height / 2);
      ctx.lineTo((canvas.width / 4) * 3, canvas.height / 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw last updated info
      ctx.font = '12px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'center';
      ctx.fillText(`Last updated: ${credentialData.lastUpdated}`, canvas.width / 2, canvas.height - 20);
      
      // Animate
      animationFrameId = requestAnimationFrame(drawCredential);
    };
    
    initParticles();
    drawCredential();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [credentialData, animationFrame]);

  // Trigger animation frame update periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleVerifyWithZKP = () => {
    setShowZkProof(true);
    toast.success("Zero-knowledge proof verification initiated");
    
    // Simulate verification process
    setTimeout(() => {
      toast.success("Credential verified with zero-knowledge proof");
    }, 2000);
  };

  const handleUpdateCredential = () => {
    toast.success("Updating credential with latest on-chain activity...");
    
    // Simulate update process
    setTimeout(() => {
      if (selectedCredential && credentialData) {
        const updatedData = { ...credentialData };
        updatedData.usageData.commits = (updatedData.usageData.commits || 0) + Math.floor(Math.random() * 10) + 1;
        updatedData.usageData.endorsements = (updatedData.usageData.endorsements || 0) + 1;
        updatedData.lastUpdated = new Date().toISOString().split('T')[0];
        
        setCredentialData(updatedData);
        toast.success("Credential updated with latest activity");
      }
    }, 2000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
          Living Credentials (Dynamic NFTs)
        </CardTitle>
        <CardDescription>
          Self-evolving credentials that update based on real-world skill usage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {Object.keys(mockCredentials).map((id) => (
            <Button
              key={id}
              variant={selectedCredential === id ? "default" : "outline"}
              onClick={() => setSelectedCredential(id)}
              className="transition-all"
            >
              {mockCredentials[id].name}
            </Button>
          ))}
        </div>
        
        {credentialData && (
          <div className="space-y-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={400} 
                className="w-full h-full"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Credential Details</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {credentialData.description}
                </p>
                
                <div className="space-y-2">
                  {credentialData.attributes.map((attr, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{attr.trait_type}</span>
                      <span className="text-sm">{attr.value.toString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Sub-Credentials</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {credentialData.subCredentials.map((subCred, index) => (
                    <Badge key={index} variant="secondary">
                      {subCred}
                    </Badge>
                  ))}
                </div>
                
                <h3 className="text-lg font-medium mb-2">Zero-Knowledge Proofs</h3>
                {showZkProof ? (
                  <div className="space-y-2">
                    {credentialData.zkProofs.map((proof, index) => (
                      <div key={index} className="bg-primary/10 p-2 rounded text-sm">
                        {proof}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">
                    Verify credential without revealing sensitive data
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleVerifyWithZKP}>
                Verify with ZKP
              </Button>
              <Button onClick={handleUpdateCredential}>
                Update from On-Chain Activity
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicNFTCredential;
