"use client";

import { useState } from 'react';
import Image from 'next/image';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Star, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { SkillCredential } from '@/lib/blockchain/types';
import { ipfsUriToHttpUrl } from '@/lib/blockchain/ipfs';

interface SkillCardProps {
  skill: SkillCredential;
  onUpgrade?: (skillId: string) => void;
  onVerify?: (skillId: string) => void;
}

export default function SkillCard({ skill, onUpgrade, onVerify }: SkillCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Map skill level to progress value
  const getProgressValue = (level: string): number => {
    const levelMap: Record<string, number> = {
      'beginner': 25,
      'intermediate': 50,
      'advanced': 75,
      'expert': 100
    };
    
    return levelMap[level.toLowerCase()] || 0;
  };

  // Get badge color based on skill level
  const getBadgeVariant = (level: string): "default" | "secondary" | "outline" | "destructive" => {
    const levelMap: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      'beginner': 'outline',
      'intermediate': 'default',
      'advanced': 'secondary',
      'expert': 'destructive'
    };
    
    return levelMap[level.toLowerCase()] || 'outline';
  };

  // Format timestamp to readable date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary-100/10 p-2">
              <Award className="h-5 w-5 text-primary-100" />
            </div>
            <CardTitle className="text-lg">{skill.name}</CardTitle>
          </div>
          <Badge variant={getBadgeVariant(skill.level)}>{skill.level}</Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          Issued on {formatDate(skill.issuedAt)} by {skill.issuer}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Skill Level</span>
            <span>{skill.level}</span>
          </div>
          <Progress value={getProgressValue(skill.level)} className="h-2" />
        </div>
        
        {expanded && (
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">{skill.metadata.description}</p>
            
            {skill.metadata.category && (
              <div>
                <p className="font-medium mb-1">Category</p>
                <Badge variant="outline" className="bg-primary-100/5">
                  {skill.metadata.category}
                </Badge>
              </div>
            )}
            
            {skill.metadata.evidence && skill.metadata.evidence.length > 0 && (
              <div>
                <p className="font-medium mb-1">Evidence</p>
                <ul className="list-disc list-inside space-y-1">
                  {skill.metadata.evidence.map((evidence, index) => (
                    <li key={index} className="text-xs">
                      <a 
                        href={ipfsUriToHttpUrl(evidence)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-100 hover:underline flex items-center gap-1"
                      >
                        Evidence #{index + 1}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {skill.metadata.endorsements && skill.metadata.endorsements.length > 0 && (
              <div>
                <p className="font-medium mb-1">Endorsements</p>
                <div className="flex items-center gap-1">
                  {[...Array(skill.metadata.endorsements.length)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  ))}
                  <span className="text-xs ml-1">
                    {skill.metadata.endorsements.length} endorsement{skill.metadata.endorsements.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
          className="text-xs"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show More
            </>
          )}
        </Button>
        
        <div className="flex gap-2">
          {onVerify && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onVerify(skill.id)}
              className="text-xs"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Verify
            </Button>
          )}
          
          {onUpgrade && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onUpgrade(skill.id)}
              className="text-xs"
            >
              <Award className="h-4 w-4 mr-1" />
              Upgrade
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
