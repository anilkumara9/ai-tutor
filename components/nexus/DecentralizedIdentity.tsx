"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNexus } from "@/contexts/NexusContext";
import { toast } from "sonner";

interface VerifiableClaim {
  id: string;
  type: string;
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  subject: string;
  claim: Record<string, any>;
  proof: {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    signature: string;
  };
}

interface DIDDocument {
  id: string;
  controller: string;
  verificationMethod: Array<{
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase: string;
  }>;
  authentication: string[];
  assertionMethod: string[];
  keyAgreement: string[];
  capabilityInvocation: string[];
  capabilityDelegation: string[];
  service: Array<{
    id: string;
    type: string;
    serviceEndpoint: string;
  }>;
}

const DecentralizedIdentity: React.FC = () => {
  const { userDid } = useNexus();
  const [activeTab, setActiveTab] = useState("did");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [sharingPermission, setSharingPermission] = useState<Record<string, boolean>>({});
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);

  // Mock DID Document
  const didDocument: DIDDocument = {
    id: userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
    controller: userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
    verificationMethod: [
      {
        id: `${userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"}#keys-1`,
        type: "Ed25519VerificationKey2020",
        controller: userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
        publicKeyMultibase: "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
      },
      {
        id: `${userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"}#keys-2`,
        type: "X25519KeyAgreementKey2020",
        controller: userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
        publicKeyMultibase: "z6LSbysY2xFMRpGMhb7tFTLMpeuPRaqaWM1yECx2AtzE3KCc"
      }
    ],
    authentication: [
      `${userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"}#keys-1`
    ],
    assertionMethod: [
      `${userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"}#keys-1`
    ],
    keyAgreement: [
      `${userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"}#keys-2`
    ],
    capabilityInvocation: [
      `${userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"}#keys-1`
    ],
    capabilityDelegation: [
      `${userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"}#keys-1`
    ],
    service: [
      {
        id: `${userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"}#vcs`,
        type: "VerifiableCredentialService",
        serviceEndpoint: "https://omnilearn.nexus/api/credentials"
      },
      {
        id: `${userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"}#messaging`,
        type: "MessagingService",
        serviceEndpoint: "https://omnilearn.nexus/api/messaging"
      }
    ]
  };

  // Mock verifiable claims
  const verifiableClaims: VerifiableClaim[] = [
    {
      id: "vc-1",
      type: "EducationalCredential",
      issuer: "did:omnilearn:issuer:university",
      issuanceDate: "2023-05-15T00:00:00Z",
      expirationDate: "2028-05-15T00:00:00Z",
      subject: userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
      claim: {
        degree: "Master of Blockchain Technology",
        institution: "OmniLearn University",
        graduationDate: "2023-05-01",
        gpa: "3.92/4.0"
      },
      proof: {
        type: "Ed25519Signature2020",
        created: "2023-05-15T00:00:00Z",
        proofPurpose: "assertionMethod",
        verificationMethod: "did:omnilearn:issuer:university#keys-1",
        signature: "zQeVbY4oey5q2M3XKaxup3tmzN4DRFTLVqpJPEiDjtgGQQFwpRnPLOvDQBwNDq6WBLMgFE"
      }
    },
    {
      id: "vc-2",
      type: "ProfessionalCertification",
      issuer: "did:omnilearn:issuer:certifier",
      issuanceDate: "2023-08-22T00:00:00Z",
      subject: userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
      claim: {
        certification: "Certified Blockchain Developer",
        level: "Advanced",
        skills: ["Smart Contracts", "DeFi Protocols", "Security Auditing"],
        examScore: "95%"
      },
      proof: {
        type: "Ed25519Signature2020",
        created: "2023-08-22T00:00:00Z",
        proofPurpose: "assertionMethod",
        verificationMethod: "did:omnilearn:issuer:certifier#keys-1",
        signature: "z58MoLpzn2nPAQwVZrFRCqwhM6qzYCXa4M9tQjuRoU9UFa2m7PZfXVS284iKzXJV7eYt"
      }
    },
    {
      id: "vc-3",
      type: "EmploymentCredential",
      issuer: "did:omnilearn:issuer:employer",
      issuanceDate: "2023-10-05T00:00:00Z",
      subject: userDid || "did:omnilearn:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
      claim: {
        position: "Senior Blockchain Engineer",
        company: "Decentralized Innovations Inc.",
        startDate: "2023-10-01",
        responsibilities: [
          "Smart contract development",
          "Protocol design",
          "Security auditing"
        ]
      },
      proof: {
        type: "Ed25519Signature2020",
        created: "2023-10-05T00:00:00Z",
        proofPurpose: "assertionMethod",
        verificationMethod: "did:omnilearn:issuer:employer#keys-1",
        signature: "z6MgwYYvhMbkw9L5j4PVzNmBqvNmDvF2Qjm8vVLwzNrKKzgwbVNKtGVZvb1HSx7Kxcp"
      }
    }
  ];

  const handleRotateKey = () => {
    toast.success("Initiating key rotation process...");
    
    setTimeout(() => {
      toast.success("New key pair generated");
      
      setTimeout(() => {
        toast.success("DID Document updated with new verification method");
        
        setTimeout(() => {
          toast.success("Key rotation completed successfully");
        }, 1000);
      }, 1500);
    }, 1000);
  };

  const handleCreateSelectiveDisclosure = () => {
    if (!selectedClaim) {
      toast.error("Please select a credential first");
      return;
    }
    
    setIsGeneratingProof(true);
    toast.success("Generating zero-knowledge proof...");
    
    setTimeout(() => {
      toast.success("Selective disclosure credential created");
      setIsGeneratingProof(false);
    }, 2000);
  };

  const handleTogglePermission = (claimId: string) => {
    setSharingPermission(prev => ({
      ...prev,
      [claimId]: !prev[claimId]
    }));
  };

  const formatDID = (did: string) => {
    if (!did) return "";
    const parts = did.split(":");
    if (parts.length < 3) return did;
    
    const method = parts[1];
    const identifier = parts[2];
    
    if (identifier.length > 16) {
      return `did:${method}:${identifier.substring(0, 8)}...${identifier.substring(identifier.length - 8)}`;
    }
    
    return did;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
          Self-Sovereign Identity
        </CardTitle>
        <CardDescription>
          Control your digital identity and credentials with quantum-resistant cryptography
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="did">DID Document</TabsTrigger>
            <TabsTrigger value="credentials">Verifiable Credentials</TabsTrigger>
            <TabsTrigger value="sharing">Selective Disclosure</TabsTrigger>
          </TabsList>
          
          <TabsContent value="did" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Your Decentralized Identifier</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDID(didDocument.id)}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
                {showAdvanced ? "Hide Advanced" : "Show Advanced"}
              </Button>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Controller</h4>
                  <p className="text-sm text-muted-foreground break-all">
                    {formatDID(didDocument.controller)}
                  </p>
                </div>
                <Badge variant="outline">Self-Controlled</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Verification Methods</h4>
              <div className="space-y-3">
                {didDocument.verificationMethod.map((method, index) => (
                  <div key={index} className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{method.type}</span>
                      <Badge variant="outline" className="text-xs">
                        {method.id.split('#')[1]}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 break-all">
                      {method.publicKeyMultibase}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {showAdvanced && (
              <>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Authentication</h4>
                    <div className="space-y-2">
                      {didDocument.authentication.map((auth, index) => (
                        <div key={index} className="bg-muted/20 p-2 rounded text-sm">
                          {auth.split('#')[1]}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Assertion Method</h4>
                    <div className="space-y-2">
                      {didDocument.assertionMethod.map((method, index) => (
                        <div key={index} className="bg-muted/20 p-2 rounded text-sm">
                          {method.split('#')[1]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Services</h4>
                  <div className="space-y-3">
                    {didDocument.service.map((service, index) => (
                      <div key={index} className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{service.type}</span>
                          <Badge variant="outline" className="text-xs">
                            {service.id.split('#')[1]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {service.serviceEndpoint}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" onClick={handleRotateKey}>
                    Rotate Keys
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="credentials" className="space-y-6">
            <div className="space-y-4">
              {verifiableClaims.map((claim) => (
                <Card key={claim.id} className={`overflow-hidden transition-all ${selectedClaim === claim.id ? 'ring-2 ring-primary' : ''}`}>
                  <div 
                    className="cursor-pointer"
                    onClick={() => setSelectedClaim(selectedClaim === claim.id ? null : claim.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base font-medium">
                          {claim.type}
                        </CardTitle>
                        <Badge variant="outline">
                          {new Date(claim.issuanceDate).toLocaleDateString()}
                        </Badge>
                      </div>
                      <CardDescription>
                        Issued by: {claim.issuer.split(':').slice(-1)[0]}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(claim.claim).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-sm text-muted-foreground">
                              {Array.isArray(value) 
                                ? value.join(', ') 
                                : typeof value === 'object'
                                  ? JSON.stringify(value)
                                  : value.toString()
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                  
                  {selectedClaim === claim.id && (
                    <>
                      <Separator />
                      <CardFooter className="pt-4">
                        <div className="w-full space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Cryptographic Proof</h4>
                            <div className="bg-muted/30 p-3 rounded-lg">
                              <div className="flex justify-between">
                                <span className="text-xs font-medium">{claim.proof.type}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(claim.proof.created).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 break-all">
                                {claim.proof.signature}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between">
                            <Button variant="outline" size="sm">
                              Verify On-Chain
                            </Button>
                            <Button size="sm" onClick={() => {
                              setActiveTab("sharing");
                              setSelectedClaim(claim.id);
                            }}>
                              Create Selective Disclosure
                            </Button>
                          </div>
                        </div>
                      </CardFooter>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="sharing" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Selective Disclosure</h3>
              <p className="text-sm text-muted-foreground">
                Create zero-knowledge proofs to share only specific parts of your credentials
              </p>
            </div>
            
            {selectedClaim ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-medium">
                      {verifiableClaims.find(c => c.id === selectedClaim)?.type}
                    </CardTitle>
                    <CardDescription>
                      Select which attributes to disclose
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(verifiableClaims.find(c => c.id === selectedClaim)?.claim || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor={key} className="capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <div className="text-sm text-muted-foreground">
                              {Array.isArray(value) 
                                ? value.join(', ') 
                                : typeof value === 'object'
                                  ? JSON.stringify(value)
                                  : value.toString()
                              }
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`toggle-${key}`} className="text-sm">
                              {sharingPermission[key] ? "Disclose" : "Hide"}
                            </Label>
                            <Button
                              id={`toggle-${key}`}
                              variant={sharingPermission[key] ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleTogglePermission(key)}
                            >
                              {sharingPermission[key] ? "✓" : "×"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setSelectedClaim(null)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateSelectiveDisclosure}
                      disabled={isGeneratingProof || Object.keys(sharingPermission).length === 0}
                    >
                      {isGeneratingProof ? "Generating..." : "Generate ZK Proof"}
                    </Button>
                  </CardFooter>
                </Card>
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
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <path d="M12 11h4"></path>
                  <path d="M12 16h4"></path>
                  <path d="M8 11h.01"></path>
                  <path d="M8 16h.01"></path>
                </svg>
                <h3 className="font-medium text-center">
                  No Credential Selected
                </h3>
                <p className="text-sm text-muted-foreground text-center mt-1">
                  Select a credential from the Verifiable Credentials tab
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab("credentials")}
                >
                  View Credentials
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DecentralizedIdentity;
