"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNexus } from "@/contexts/NexusContext";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  description: string;
  skills: string[];
  postedDate: string;
  salary: string;
  matchScore?: number;
}

const JobMatching: React.FC = () => {
  const { isInitialized, credentials } = useNexus();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);

  // Mock data for jobs
  const mockJobs: Job[] = [
    {
      id: "job1",
      title: "Junior Front-End Developer",
      company: "TechStart Inc.",
      location: "Remote",
      remote: true,
      description: "Looking for a junior developer with HTML, CSS, and JavaScript skills to join our growing team.",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      postedDate: "2025-04-05",
      salary: "$60,000 - $75,000",
      matchScore: 85
    },
    {
      id: "job2",
      title: "Blockchain Developer",
      company: "DeFi Solutions",
      location: "New York, NY",
      remote: false,
      description: "Seeking a blockchain developer with experience in Solidity and smart contract development.",
      skills: ["Blockchain", "Solidity", "Ethereum", "Smart Contracts"],
      postedDate: "2025-04-08",
      salary: "$90,000 - $120,000",
      matchScore: 92
    },
    {
      id: "job3",
      title: "Data Analyst",
      company: "DataDrive Corp",
      location: "Remote",
      remote: true,
      description: "Join our data team to analyze and interpret complex datasets using Python and SQL.",
      skills: ["Python", "SQL", "Data Analysis", "Visualization"],
      postedDate: "2025-04-01",
      salary: "$70,000 - $85,000",
      matchScore: 78
    },
    {
      id: "job4",
      title: "Full-Stack Developer",
      company: "WebSphere Technologies",
      location: "Austin, TX",
      remote: true,
      description: "Looking for a full-stack developer proficient in JavaScript, Node.js, and React.",
      skills: ["JavaScript", "Node.js", "React", "MongoDB"],
      postedDate: "2025-04-07",
      salary: "$85,000 - $110,000",
      matchScore: 88
    },
    {
      id: "job5",
      title: "AI/ML Engineer",
      company: "Cognitive Systems",
      location: "San Francisco, CA",
      remote: false,
      description: "Develop and implement machine learning models for our AI platform.",
      skills: ["Python", "TensorFlow", "Machine Learning", "AI"],
      postedDate: "2025-04-03",
      salary: "$100,000 - $130,000",
      matchScore: 75
    }
  ];

  // Extract all unique skills from jobs
  useEffect(() => {
    const skillSet = new Set<string>();
    mockJobs.forEach(job => {
      job.skills.forEach(skill => skillSet.add(skill));
    });
    setAvailableSkills(Array.from(skillSet));
    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
  }, []);

  // Filter jobs based on search term, location, and selected skills
  useEffect(() => {
    let filtered = [...jobs];
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (locationFilter) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(job => 
        selectedSkills.every(skill => job.skills.includes(skill))
      );
    }
    
    // Sort by match score
    filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, locationFilter, selectedSkills]);

  const toggleSkillFilter = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const applyForJob = (jobId: string) => {
    toast.success("Application submitted! Your credentials have been shared with the employer.");
  };

  const verifyCredentials = (jobId: string) => {
    toast.success("Credentials verified via blockchain. The employer can now view your verified skills.");
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
          Job Matching
        </CardTitle>
        <CardDescription>
          Find opportunities that match your verified skills and credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="flex-1"
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Filter by skills:</h3>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map(skill => (
              <Badge 
                key={skill} 
                variant={selectedSkills.includes(skill) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSkillFilter(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="matched" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="matched">Best Matches</TabsTrigger>
            <TabsTrigger value="all">All Jobs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="matched" className="space-y-4 mt-4">
            {filteredJobs.filter(job => (job.matchScore || 0) > 80).length > 0 ? (
              filteredJobs
                .filter(job => (job.matchScore || 0) > 80)
                .map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onApply={applyForJob} 
                    onVerify={verifyCredentials} 
                  />
                ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No high-matching jobs found. Try adjusting your filters.
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4 mt-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onApply={applyForJob} 
                  onVerify={verifyCredentials} 
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No jobs found. Try adjusting your filters.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface JobCardProps {
  job: Job;
  onApply: (jobId: string) => void;
  onVerify: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, onVerify }) => {
  return (
    <Card className="overflow-hidden border">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
          </div>
          {job.matchScore && (
            <Badge variant={job.matchScore > 85 ? "default" : "secondary"}>
              {job.matchScore}% Match
            </Badge>
          )}
        </div>
        
        <p className="text-sm mt-2">{job.description}</p>
        
        <div className="mt-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {job.skills.map(skill => (
              <Badge key={skill} variant="outline" className="bg-primary/5">
                {skill}
              </Badge>
            ))}
          </div>
          
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Posted: {job.postedDate}</span>
            <span>{job.salary}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-muted/20 p-3 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onVerify(job.id)}>
          Verify Credentials
        </Button>
        <Button size="sm" onClick={() => onApply(job.id)}>
          Apply with Credentials
        </Button>
      </div>
    </Card>
  );
};

export default JobMatching;
