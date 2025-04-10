"use client";

import { useState } from 'react';
import Link from 'next/link';
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
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  GraduationCap, 
  Users, 
  Award,
  Star
} from 'lucide-react';
import { LearningPath as LearningPathType } from '@/lib/blockchain/types';

interface LearningPathProps {
  path: LearningPathType;
  userProgress?: {
    pathId: string;
    progress: number;
    completed: boolean;
    startedAt: number;
    completedAt?: number;
  };
  onEnroll?: (pathId: string) => void;
  onContinue?: (pathId: string, moduleId: string) => void;
}

export default function LearningPath({ 
  path, 
  userProgress,
  onEnroll,
  onContinue
}: LearningPathProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Calculate estimated time to complete
  const calculateEstimatedTime = (modules: any[]): string => {
    // Assume each module takes 30 minutes on average
    const totalMinutes = modules.length * 30;
    
    if (totalMinutes < 60) {
      return `${totalMinutes} minutes`;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (minutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} min`;
  };
  
  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate average rating
  const calculateAverageRating = (): number => {
    if (!path.endorsements || path.endorsements.length === 0) {
      return 0;
    }
    
    const sum = path.endorsements.reduce((acc, endorsement) => acc + endorsement.rating, 0);
    return Math.round((sum / path.endorsements.length) * 10) / 10;
  };
  
  // Find next incomplete module
  const findNextModule = (): string | null => {
    if (!userProgress || userProgress.completed) {
      return null;
    }
    
    // This is a simplified approach - in a real app, you'd track completion of individual modules
    const moduleIndex = Math.floor((userProgress.progress / 100) * path.modules.length);
    return moduleIndex < path.modules.length ? path.modules[moduleIndex].id : null;
  };
  
  const isEnrolled = !!userProgress;
  const isCompleted = userProgress?.completed || false;
  const progress = userProgress?.progress || 0;
  const nextModuleId = findNextModule();
  const averageRating = calculateAverageRating();
  
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{path.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <GraduationCap className="h-4 w-4" />
              <span>Created by {path.creator}</span>
              
              {averageRating > 0 && (
                <div className="flex items-center gap-1 ml-2">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span>{averageRating}</span>
                </div>
              )}
            </CardDescription>
          </div>
          
          {isCompleted ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              Completed
            </Badge>
          ) : isEnrolled ? (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              In Progress
            </Badge>
          ) : (
            <Badge variant="outline">
              Not Enrolled
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-4">
          {path.description}
        </p>
        
        {isEnrolled && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span>{path.modules.length} Modules</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{calculateEstimatedTime(path.modules)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span>{path.skillsGained.length} Skills to Gain</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{path.endorsements?.length || 0} Endorsements</span>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Skills Required</h4>
              <div className="flex flex-wrap gap-1">
                {path.skillsRequired.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Skills You'll Gain</h4>
              <div className="flex flex-wrap gap-1">
                {path.skillsGained.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Modules</h4>
              <div className="space-y-2">
                {path.modules.map((module, index) => (
                  <div 
                    key={module.id} 
                    className={`p-2 rounded-md border ${
                      isEnrolled && nextModuleId === module.id 
                        ? 'border-blue-500 bg-blue-500/5' 
                        : 'border-border'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-xs">
                          {index + 1}
                        </span>
                        <span className="font-medium">{module.title}</span>
                      </div>
                      
                      {isEnrolled && progress > (index / path.modules.length) * 100 && (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-7">
                      {module.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {userProgress && (
              <div className="text-xs text-muted-foreground">
                <p>Enrolled on: {formatDate(userProgress.startedAt)}</p>
                {userProgress.completedAt && (
                  <p>Completed on: {formatDate(userProgress.completedAt)}</p>
                )}
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
        >
          {expanded ? 'Show Less' : 'Show More'}
        </Button>
        
        <div>
          {isCompleted ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/learning/path/${path.id}/certificate`}>
                View Certificate
              </Link>
            </Button>
          ) : isEnrolled && nextModuleId ? (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onContinue?.(path.id, nextModuleId)}
            >
              Continue Learning
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : !isEnrolled ? (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onEnroll?.(path.id)}
            >
              Enroll Now
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <Link href={`/learning/path/${path.id}`}>
                View Path
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
