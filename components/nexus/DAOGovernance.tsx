"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNexus } from "@/contexts/NexusContext";
import { toast } from "sonner";

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: "active" | "passed" | "rejected" | "executed";
  category: "curriculum" | "governance" | "technical" | "financial";
  votingPeriodEnd: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorum: number;
  executionData?: string;
}

interface Delegate {
  address: string;
  name: string;
  votingPower: number;
  proposals: number;
  delegatedVotes: number;
  expertise: string[];
}

const DAOGovernance: React.FC = () => {
  const { tokenBalance } = useNexus();
  const [activeTab, setActiveTab] = useState("proposals");
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<Record<string, "for" | "against" | "abstain" | null>>({});
  const [isVoting, setIsVoting] = useState(false);
  const [isDelegating, setIsDelegating] = useState(false);
  const [selectedDelegate, setSelectedDelegate] = useState<string | null>(null);

  // Mock proposals
  const proposals: Proposal[] = [
    {
      id: "prop-1",
      title: "Add Advanced Zero-Knowledge Cryptography Course",
      description: "Proposal to add a comprehensive course on zero-knowledge cryptography to the OmniLearn curriculum, covering zk-SNARKs, zk-STARKs, and their applications in blockchain privacy.",
      proposer: "0x7a16ff8270133f063aab6c9977183d9e72835428",
      status: "active",
      category: "curriculum",
      votingPeriodEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      votesFor: 1250000,
      votesAgainst: 450000,
      votesAbstain: 300000,
      quorum: 2000000,
      executionData: "0x7a16ff8270133f063aab6c9977183d9e72835428"
    },
    {
      id: "prop-2",
      title: "Implement Cross-Chain Credential Verification",
      description: "Proposal to implement a cross-chain credential verification system using LayerZero protocol, allowing credentials to be verified across multiple blockchains.",
      proposer: "0x3a8e9d9bdcc4a900b318b300f1c9a932c8bce8e7",
      status: "active",
      category: "technical",
      votingPeriodEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      votesFor: 980000,
      votesAgainst: 320000,
      votesAbstain: 150000,
      quorum: 1500000,
      executionData: "0x3a8e9d9bdcc4a900b318b300f1c9a932c8bce8e7"
    },
    {
      id: "prop-3",
      title: "Allocate 500,000 $KNOW for University Partnerships",
      description: "Proposal to allocate 500,000 $KNOW tokens from the treasury to establish partnerships with leading universities for credential recognition and academic integration.",
      proposer: "0x9c5d087f912e7187d9c75e90999b4284b5101cf2",
      status: "passed",
      category: "financial",
      votingPeriodEnd: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      votesFor: 2100000,
      votesAgainst: 450000,
      votesAbstain: 200000,
      quorum: 2000000,
      executionData: "0x9c5d087f912e7187d9c75e90999b4284b5101cf2"
    },
    {
      id: "prop-4",
      title: "Implement Quadratic Voting for Skill DAOs",
      description: "Proposal to implement quadratic voting for Skill DAO governance decisions, ensuring more democratic representation and preventing plutocracy.",
      proposer: "0x1d8f7c2c3b4a5d6e7f8a9b0c1d2e3f4a5b6c7d8e",
      status: "rejected",
      category: "governance",
      votingPeriodEnd: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      votesFor: 1200000,
      votesAgainst: 1800000,
      votesAbstain: 500000,
      quorum: 3000000,
      executionData: "0x1d8f7c2c3b4a5d6e7f8a9b0c1d2e3f4a5b6c7d8e"
    }
  ];

  // Mock delegates
  const delegates: Delegate[] = [
    {
      address: "0x7a16ff8270133f063aab6c9977183d9e72835428",
      name: "ZK Research Guild",
      votingPower: 1250000,
      proposals: 7,
      delegatedVotes: 850000,
      expertise: ["Zero-Knowledge Proofs", "Privacy", "Cryptography"]
    },
    {
      address: "0x3a8e9d9bdcc4a900b318b300f1c9a932c8bce8e7",
      name: "Interoperability Council",
      votingPower: 980000,
      proposals: 5,
      delegatedVotes: 620000,
      expertise: ["Cross-Chain", "Bridges", "Interoperability"]
    },
    {
      address: "0x9c5d087f912e7187d9c75e90999b4284b5101cf2",
      name: "Education Alliance",
      votingPower: 2100000,
      proposals: 12,
      delegatedVotes: 1750000,
      expertise: ["Education", "Credentials", "Academic Partnerships"]
    },
    {
      address: "0x1d8f7c2c3b4a5d6e7f8a9b0c1d2e3f4a5b6c7d8e",
      name: "Governance Innovators",
      votingPower: 1200000,
      proposals: 9,
      delegatedVotes: 950000,
      expertise: ["Governance", "Voting Systems", "DAO Structure"]
    }
  ];

  // User's voting power (based on token balance)
  const userVotingPower = parseInt(tokenBalance || "0") * 1000; // 1 $KNOW = 1000 voting power

  const handleVote = (proposalId: string, vote: "for" | "against" | "abstain") => {
    setIsVoting(true);
    setUserVote(prev => ({ ...prev, [proposalId]: vote }));
    
    toast.success(`Submitting your vote: ${vote.toUpperCase()}`);
    
    setTimeout(() => {
      toast.success("Vote submitted successfully");
      setIsVoting(false);
      
      // Update proposal votes (in a real implementation, this would be done via blockchain)
      const proposal = proposals.find(p => p.id === proposalId);
      if (proposal) {
        if (vote === "for") {
          proposal.votesFor += userVotingPower;
        } else if (vote === "against") {
          proposal.votesAgainst += userVotingPower;
        } else {
          proposal.votesAbstain += userVotingPower;
        }
      }
    }, 2000);
  };

  const handleDelegate = (delegateAddress: string) => {
    setIsDelegating(true);
    setSelectedDelegate(delegateAddress);
    
    toast.success(`Preparing delegation transaction...`);
    
    setTimeout(() => {
      toast.success(`Delegating ${tokenBalance} $KNOW voting power`);
      
      setTimeout(() => {
        toast.success("Delegation successful");
        setIsDelegating(false);
      }, 1500);
    }, 1500);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "curriculum":
        return <Badge className="bg-blue-500/10 text-blue-500">Curriculum</Badge>;
      case "governance":
        return <Badge className="bg-purple-500/10 text-purple-500">Governance</Badge>;
      case "technical":
        return <Badge className="bg-green-500/10 text-green-500">Technical</Badge>;
      case "financial":
        return <Badge className="bg-yellow-500/10 text-yellow-500">Financial</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-500/10 text-blue-500">Active</Badge>;
      case "passed":
        return <Badge className="bg-green-500/10 text-green-500">Passed</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-500">Rejected</Badge>;
      case "executed":
        return <Badge className="bg-purple-500/10 text-purple-500">Executed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const calculateTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = Date.now();
    
    if (now > end) return "Voting ended";
    
    const diff = end - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };

  const calculateVotePercentage = (proposal: Proposal) => {
    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
    if (totalVotes === 0) return { for: 0, against: 0, abstain: 0 };
    
    return {
      for: (proposal.votesFor / totalVotes) * 100,
      against: (proposal.votesAgainst / totalVotes) * 100,
      abstain: (proposal.votesAbstain / totalVotes) * 100
    };
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
          DAO Governance
        </CardTitle>
        <CardDescription>
          Participate in decentralized governance of the OmniLearn Nexus platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="delegation">Delegation</TabsTrigger>
            <TabsTrigger value="treasury">Treasury</TabsTrigger>
          </TabsList>
          
          <TabsContent value="proposals" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Active Proposals</h3>
                <p className="text-sm text-muted-foreground">
                  Your voting power: {userVotingPower.toLocaleString()} votes ({tokenBalance || "0"} $KNOW)
                </p>
              </div>
              <Button variant="outline" size="sm">
                Create Proposal
              </Button>
            </div>
            
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <Card key={proposal.id} className={`overflow-hidden transition-all ${selectedProposal === proposal.id ? 'ring-2 ring-primary' : ''}`}>
                  <div 
                    className="cursor-pointer"
                    onClick={() => setSelectedProposal(selectedProposal === proposal.id ? null : proposal.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base font-medium">
                          {proposal.title}
                        </CardTitle>
                        <div className="flex space-x-2">
                          {getCategoryBadge(proposal.category)}
                          {getStatusBadge(proposal.status)}
                        </div>
                      </div>
                      <CardDescription>
                        Proposed by: {formatAddress(proposal.proposer)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {proposal.description.length > 150 
                          ? `${proposal.description.substring(0, 150)}...` 
                          : proposal.description
                        }
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>For: {proposal.votesFor.toLocaleString()}</span>
                          <span>Against: {proposal.votesAgainst.toLocaleString()}</span>
                          <span>Abstain: {proposal.votesAbstain.toLocaleString()}</span>
                        </div>
                        
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="flex h-full">
                            <div 
                              className="bg-green-500" 
                              style={{ width: `${calculateVotePercentage(proposal).for}%` }}
                            />
                            <div 
                              className="bg-red-500" 
                              style={{ width: `${calculateVotePercentage(proposal).against}%` }}
                            />
                            <div 
                              className="bg-yellow-500" 
                              style={{ width: `${calculateVotePercentage(proposal).abstain}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Quorum: {((proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain) / proposal.quorum * 100).toFixed(1)}%
                          </span>
                          <span>
                            {calculateTimeRemaining(proposal.votingPeriodEnd)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                  
                  {selectedProposal === proposal.id && (
                    <>
                      <Separator />
                      <CardFooter className="pt-4">
                        <div className="w-full space-y-4">
                          {proposal.status === "active" && (
                            <div className="flex justify-between">
                              <Button 
                                variant={userVote[proposal.id] === "for" ? "default" : "outline"} 
                                className="flex-1 mr-2"
                                onClick={() => handleVote(proposal.id, "for")}
                                disabled={isVoting || userVotingPower === 0}
                              >
                                For
                              </Button>
                              <Button 
                                variant={userVote[proposal.id] === "against" ? "default" : "outline"} 
                                className="flex-1 mx-2"
                                onClick={() => handleVote(proposal.id, "against")}
                                disabled={isVoting || userVotingPower === 0}
                              >
                                Against
                              </Button>
                              <Button 
                                variant={userVote[proposal.id] === "abstain" ? "default" : "outline"} 
                                className="flex-1 ml-2"
                                onClick={() => handleVote(proposal.id, "abstain")}
                                disabled={isVoting || userVotingPower === 0}
                              >
                                Abstain
                              </Button>
                            </div>
                          )}
                          
                          {proposal.status === "passed" && (
                            <div className="flex justify-end">
                              <Button>
                                Execute Proposal
                              </Button>
                            </div>
                          )}
                          
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">Execution Data:</span> {proposal.executionData}
                          </div>
                        </div>
                      </CardFooter>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="delegation" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Delegate Your Voting Power</h3>
              <p className="text-sm text-muted-foreground">
                Delegate your voting power to trusted experts in specific domains
              </p>
            </div>
            
            <div className="space-y-4">
              {delegates.map((delegate) => (
                <Card key={delegate.address} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-base font-medium">
                        {delegate.name}
                      </CardTitle>
                      <Badge variant="outline">
                        {formatAddress(delegate.address)}
                      </Badge>
                    </div>
                    <CardDescription>
                      Voting Power: {delegate.votingPower.toLocaleString()} ({(delegate.delegatedVotes / delegate.votingPower * 100).toFixed(1)}% delegated)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {delegate.expertise.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Proposals Created: {delegate.proposals}</span>
                        <span>Delegated Votes: {delegate.delegatedVotes.toLocaleString()}</span>
                      </div>
                      
                      <Button 
                        className="w-full"
                        variant={selectedDelegate === delegate.address ? "default" : "outline"}
                        onClick={() => handleDelegate(delegate.address)}
                        disabled={isDelegating || userVotingPower === 0}
                      >
                        {isDelegating && selectedDelegate === delegate.address 
                          ? "Delegating..." 
                          : selectedDelegate === delegate.address
                            ? "Delegated"
                            : "Delegate Votes"
                        }
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="treasury" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">DAO Treasury</h3>
              <p className="text-sm text-muted-foreground">
                Overview of the OmniLearn Nexus DAO treasury assets
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    $KNOW Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    12,500,000
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ~$3,750,000 USD
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    ETH
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    125.5
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ~$250,000 USD
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Stablecoins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    500,000
                  </div>
                  <p className="text-xs text-muted-foreground">
                    USDC, DAI, USDT
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Treasury Allocation
                </CardTitle>
                <CardDescription>
                  Current allocation of treasury funds
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Education Grants</span>
                      <span className="text-sm">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Protocol Development</span>
                      <span className="text-sm">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Liquidity Provision</span>
                      <span className="text-sm">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Community Rewards</span>
                      <span className="text-sm">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Operational Expenses</span>
                      <span className="text-sm">5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DAOGovernance;
