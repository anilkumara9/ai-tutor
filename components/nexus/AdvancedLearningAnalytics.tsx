"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useNexus } from "@/contexts/NexusContext";

// Types for our analytics data
interface SkillData {
  name: string;
  level: number;
  progress: number;
  lastActivity: string;
}

interface LearningMetric {
  date: string;
  tokensEarned: number;
  minutesLearned: number;
  skillsImproved: number;
}

const AdvancedLearningAnalytics: React.FC = () => {
  const { credentials, tokenBalance } = useNexus();
  const [skillsData, setSkillsData] = useState<SkillData[]>([]);
  const [learningMetrics, setLearningMetrics] = useState<LearningMetric[]>([]);
  const [activeTab, setActiveTab] = useState("skills");
  const radarChartRef = useRef<HTMLCanvasElement>(null);
  const lineChartRef = useRef<HTMLCanvasElement>(null);

  // Generate mock data based on actual credentials
  useEffect(() => {
    if (credentials) {
      // Extract skills from credentials
      const extractedSkills: SkillData[] = credentials.livingCredentials?.map((cred: any) => ({
        name: cred.skill,
        level: cred.level === "Advanced" ? 90 : cred.level === "Intermediate" ? 60 : 30,
        progress: Math.floor(Math.random() * 30) + 70, // 70-100% for demo
        lastActivity: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
      })) || [];

      // Add some additional skills if we don't have enough
      if (extractedSkills.length < 3) {
        const additionalSkills = [
          { name: "Blockchain Development", level: 75, progress: 85, lastActivity: "2023-10-15" },
          { name: "Smart Contract Security", level: 60, progress: 78, lastActivity: "2023-10-20" },
          { name: "Decentralized Finance", level: 45, progress: 92, lastActivity: "2023-10-25" }
        ];
        
        for (let i = 0; i < Math.min(3 - extractedSkills.length, additionalSkills.length); i++) {
          extractedSkills.push(additionalSkills[i]);
        }
      }

      setSkillsData(extractedSkills);

      // Generate learning metrics for the last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const metrics: LearningMetric[] = last7Days.map(date => ({
        date,
        tokensEarned: Math.floor(Math.random() * 10) + 1,
        minutesLearned: Math.floor(Math.random() * 60) + 30,
        skillsImproved: Math.floor(Math.random() * 2)
      }));

      setLearningMetrics(metrics);
    }
  }, [credentials]);

  // Render radar chart for skills using canvas
  useEffect(() => {
    if (radarChartRef.current && skillsData.length > 0 && activeTab === "skills") {
      const ctx = radarChartRef.current.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, radarChartRef.current.width, radarChartRef.current.height);
        
        const centerX = radarChartRef.current.width / 2;
        const centerY = radarChartRef.current.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        // Draw radar background
        const sides = skillsData.length;
        const angleStep = (Math.PI * 2) / sides;
        
        // Draw radar levels
        const levels = 3;
        for (let level = 1; level <= levels; level++) {
          const levelRadius = (radius * level) / levels;
          ctx.beginPath();
          for (let i = 0; i <= sides; i++) {
            const angle = i * angleStep - Math.PI / 2;
            const x = centerX + levelRadius * Math.cos(angle);
            const y = centerY + levelRadius * Math.sin(angle);
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(147, 51, 234, ${0.2 * level})`;
          ctx.stroke();
        }
        
        // Draw radar lines
        for (let i = 0; i < sides; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = 'rgba(147, 51, 234, 0.3)';
          ctx.stroke();
          
          // Draw skill labels
          const labelX = centerX + (radius + 20) * Math.cos(angle);
          const labelY = centerY + (radius + 20) * Math.sin(angle);
          ctx.fillStyle = 'white';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(skillsData[i].name, labelX, labelY);
        }
        
        // Draw skill data
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const value = skillsData[i].level / 100; // Normalize to 0-1
          const x = centerX + radius * value * Math.cos(angle);
          const y = centerY + radius * value * Math.sin(angle);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(147, 51, 234, 0.2)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw data points
        for (let i = 0; i < sides; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const value = skillsData[i].level / 100;
          const x = centerX + radius * value * Math.cos(angle);
          const y = centerY + radius * value * Math.sin(angle);
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(147, 51, 234, 1)';
          ctx.fill();
        }
      }
    }
  }, [skillsData, activeTab]);

  // Render line chart for learning metrics
  useEffect(() => {
    if (lineChartRef.current && learningMetrics.length > 0 && activeTab === "progress") {
      const ctx = lineChartRef.current.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, lineChartRef.current.width, lineChartRef.current.height);
        
        const width = lineChartRef.current.width;
        const height = lineChartRef.current.height;
        const padding = 40;
        
        // Draw axes
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();
        
        // Draw x-axis labels (dates)
        const xStep = (width - 2 * padding) / (learningMetrics.length - 1);
        learningMetrics.forEach((metric, i) => {
          const x = padding + i * xStep;
          ctx.fillStyle = 'white';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(metric.date.slice(5), x, height - padding + 15);
        });
        
        // Draw y-axis labels (minutes)
        const maxMinutes = Math.max(...learningMetrics.map(m => m.minutesLearned));
        const yStep = (height - 2 * padding) / 5;
        for (let i = 0; i <= 5; i++) {
          const y = height - padding - i * yStep;
          const value = Math.round((maxMinutes * i) / 5);
          ctx.fillStyle = 'white';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(value.toString(), padding - 5, y + 3);
        }
        
        // Draw minutes learned line
        ctx.beginPath();
        learningMetrics.forEach((metric, i) => {
          const x = padding + i * xStep;
          const y = height - padding - (metric.minutesLearned / maxMinutes) * (height - 2 * padding);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.strokeStyle = 'rgba(147, 51, 234, 1)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw data points
        learningMetrics.forEach((metric, i) => {
          const x = padding + i * xStep;
          const y = height - padding - (metric.minutesLearned / maxMinutes) * (height - 2 * padding);
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(147, 51, 234, 1)';
          ctx.fill();
        });
        
        // Draw tokens earned as bars
        const maxTokens = Math.max(...learningMetrics.map(m => m.tokensEarned));
        const barWidth = xStep * 0.6;
        learningMetrics.forEach((metric, i) => {
          const x = padding + i * xStep - barWidth / 2;
          const barHeight = (metric.tokensEarned / maxTokens) * (height - 2 * padding) * 0.7;
          const y = height - padding - barHeight;
          ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
          ctx.fillRect(x, y, barWidth, barHeight);
        });
      }
    }
  }, [learningMetrics, activeTab]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
          Advanced Learning Analytics
        </CardTitle>
        <CardDescription>
          Visualize your learning journey and skill development
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="skills">Skill Radar</TabsTrigger>
            <TabsTrigger value="progress">Learning Progress</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="space-y-6">
            <div className="flex justify-center">
              <canvas 
                ref={radarChartRef} 
                width={400} 
                height={400} 
                className="max-w-full"
              />
            </div>
            
            <div className="space-y-4 mt-4">
              <h3 className="text-lg font-medium">Skill Proficiency</h3>
              {skillsData.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Last activity: {skill.lastActivity}</span>
                    <span>{skill.progress}% complete</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="flex justify-center mb-6">
              <canvas 
                ref={lineChartRef} 
                width={600} 
                height={300} 
                className="max-w-full"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{tokenBalance || "0"}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total Tokens Earned</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {learningMetrics.reduce((sum, metric) => sum + metric.minutesLearned, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Minutes Learned (7 days)</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {learningMetrics.reduce((sum, metric) => sum + metric.skillsImproved, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Skills Improved</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedLearningAnalytics;
