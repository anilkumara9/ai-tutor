"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useNexus } from "@/contexts/NexusContext";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  progress: number;
  topics: LearningTopic[];
}

interface LearningTopic {
  id: string;
  title: string;
  completed: boolean;
  exercises: number;
  exercisesCompleted: number;
}

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  progress: number;
}

const EnhancedAITutor: React.FC = () => {
  const { isInitialized } = useNexus();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "I am OmniTutor, your advanced AI learning assistant in the OmniLearn Nexus platform. I can help you with blockchain concepts, programming, and guide your learning journey."
    },
    {
      role: "assistant",
      content: "Welcome to OmniLearn Nexus! I'm your AI tutor, specialized in blockchain technology, decentralized systems, and personalized learning. How can I assist your learning journey today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [learningGoal, setLearningGoal] = useState<string>("");
  const [currentLearningGoal, setCurrentLearningGoal] = useState<LearningGoal | null>(null);
  const [modules, setModules] = useState<LearningModule[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock learning modules
  const mockModules: LearningModule[] = [
    {
      id: "python-basics",
      title: "Python Basics",
      description: "Learn the fundamentals of Python programming",
      progress: 70,
      topics: [
        { id: "py-1", title: "Variables & Data Types", completed: true, exercises: 5, exercisesCompleted: 5 },
        { id: "py-2", title: "Control Flow", completed: true, exercises: 4, exercisesCompleted: 4 },
        { id: "py-3", title: "Functions", completed: true, exercises: 6, exercisesCompleted: 6 },
        { id: "py-4", title: "Data Structures", completed: false, exercises: 8, exercisesCompleted: 5 },
        { id: "py-5", title: "File I/O", completed: false, exercises: 3, exercisesCompleted: 0 },
      ]
    },
    {
      id: "web-dev",
      title: "Web Development",
      description: "Master HTML, CSS, and JavaScript",
      progress: 40,
      topics: [
        { id: "web-1", title: "HTML Basics", completed: true, exercises: 4, exercisesCompleted: 4 },
        { id: "web-2", title: "CSS Styling", completed: true, exercises: 5, exercisesCompleted: 5 },
        { id: "web-3", title: "JavaScript Fundamentals", completed: false, exercises: 7, exercisesCompleted: 3 },
        { id: "web-4", title: "DOM Manipulation", completed: false, exercises: 6, exercisesCompleted: 0 },
        { id: "web-5", title: "Responsive Design", completed: false, exercises: 4, exercisesCompleted: 0 },
      ]
    },
    {
      id: "blockchain",
      title: "Blockchain Fundamentals",
      description: "Understand blockchain technology and its applications",
      progress: 25,
      topics: [
        { id: "bc-1", title: "Blockchain Basics", completed: true, exercises: 3, exercisesCompleted: 3 },
        { id: "bc-2", title: "Cryptography", completed: false, exercises: 4, exercisesCompleted: 2 },
        { id: "bc-3", title: "Smart Contracts", completed: false, exercises: 5, exercisesCompleted: 0 },
        { id: "bc-4", title: "DApps", completed: false, exercises: 6, exercisesCompleted: 0 },
        { id: "bc-5", title: "Web3 Integration", completed: false, exercises: 4, exercisesCompleted: 0 },
      ]
    }
  ];
  
  // Mock learning goal
  const mockLearningGoal: LearningGoal = {
    id: "goal-1",
    title: "Learn Python for Data Science",
    description: "Master Python programming and essential data science libraries to analyze and visualize data effectively.",
    deadline: "2025-06-15",
    progress: 45
  };

  // Initialize modules and learning goal
  useEffect(() => {
    setModules(mockModules);
    setCurrentLearningGoal(mockLearningGoal);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare the conversation history for the API
      const conversationHistory = messages
        .filter(msg => msg.role !== "system")
        .slice(-6) // Keep only the last 6 messages for context
        .map(msg => ({ role: msg.role, parts: [{ text: msg.content }] }));
      
      // Add the new user message
      conversationHistory.push({ 
        role: "user", 
        parts: [{ text: userMessage.content }] 
      });

      // Call Gemini API
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=AIzaSyD4yPEZ3fqrSSyqqetySjnDg8vknyCFpLg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are OmniTutor, an advanced AI learning assistant in the OmniLearn Nexus platform. You specialize in blockchain technology, decentralized systems, and personalized learning. Your responses should be educational, insightful, and tailored to help the user understand complex concepts.

Current conversation:
${messages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

User's new message: ${userMessage.content}

Respond in a helpful, educational manner. Include code examples when relevant. If discussing blockchain concepts, explain them clearly with real-world applications.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const assistantResponse = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: "assistant", content: assistantResponse }]);
      } else {
        throw new Error("Failed to get response from AI");
      }
    } catch (error) {
      console.error("Error calling AI:", error);
      toast.error("Failed to get response from AI tutor. Please try again.");
      
      // Fallback response
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const setNewLearningGoal = () => {
    if (!learningGoal.trim()) return;
    
    // In a real implementation, this would call an API to create a new learning goal
    const newGoal: LearningGoal = {
      id: `goal-${Date.now()}`,
      title: learningGoal,
      description: `Your personalized learning path for ${learningGoal}`,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      progress: 0
    };
    
    setCurrentLearningGoal(newGoal);
    setLearningGoal("");
    toast.success("New learning goal set! Your AI tutor will now adapt to this goal.");
    
    // Add a system message to inform the AI about the new goal
    setMessages(prev => [...prev, {
      role: "system",
      content: `User has set a new learning goal: ${newGoal.title}`
    }, {
      role: "assistant",
      content: `I see you've set a new learning goal: "${newGoal.title}". I'll tailor our sessions to help you achieve this. Let's start by understanding what you already know about this topic and what specific areas you'd like to focus on.`
    }]);
    
    // Switch to chat tab
    setActiveTab("chat");
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
          Enhanced AI Tutor
        </CardTitle>
        <CardDescription>
          Your personal blockchain and learning assistant powered by advanced AI
        </CardDescription>
        
        {currentLearningGoal && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Current Goal: {currentLearningGoal.title}</h3>
              <Badge variant="outline">{Math.round(currentLearningGoal.progress)}% Complete</Badge>
            </div>
            <Progress value={currentLearningGoal.progress} className="h-2" />
          </div>
        )}
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="goal">Learning Goal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="space-y-4">
          <CardContent>
            <div className="h-[400px] overflow-y-auto mb-4 space-y-4 p-4 rounded-lg bg-secondary/50">
              {messages.filter(msg => msg.role !== "system").map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "assistant"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-secondary text-secondary-foreground">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full space-x-2">
              <Input
                placeholder="Ask about blockchain concepts, learning paths, or technical questions..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                {isLoading ? "Thinking..." : "Send"}
              </Button>
            </div>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6 p-6">
          <div className="space-y-6">
            {modules.map(module => (
              <div key={module.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{module.title}</h3>
                  <Badge variant="outline">{module.progress}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{module.description}</p>
                <Progress value={module.progress} className="h-2" />
                
                <div className="space-y-2 mt-2">
                  {module.topics.map(topic => (
                    <div key={topic.id} className="flex items-center justify-between bg-secondary/30 p-2 rounded-md">
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${topic.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">{topic.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {topic.exercisesCompleted}/{topic.exercises} exercises
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="goal" className="space-y-4 p-6">
          {currentLearningGoal ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{currentLearningGoal.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{currentLearningGoal.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm">{Math.round(currentLearningGoal.progress)}%</span>
                </div>
                <Progress value={currentLearningGoal.progress} className="h-2" />
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Target Completion Date</h4>
                <p className="text-sm">{new Date(currentLearningGoal.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                
                <h4 className="font-medium mt-4 mb-2">AI Tutor Recommendations</h4>
                <ul className="text-sm space-y-1">
                  <li>• Focus on completing the Python Data Structures module</li>
                  <li>• Practice with real-world data analysis exercises</li>
                  <li>• Review cryptography concepts for better understanding</li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setCurrentLearningGoal(null)}>Set New Goal</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-medium">Set a New Learning Goal</h3>
              <p className="text-sm text-muted-foreground">Your AI tutor will create a personalized learning plan based on your goal.</p>
              
              <div className="space-y-2">
                <Input
                  placeholder="e.g., Learn Python for Data Science"
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                />
                <Button onClick={setNewLearningGoal} disabled={!learningGoal.trim()} className="w-full">
                  Create Learning Plan
                </Button>
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Popular Learning Goals</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-secondary" 
                    onClick={() => setLearningGoal("Master Blockchain Development")}
                  >
                    Master Blockchain Development
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-secondary" 
                    onClick={() => setLearningGoal("Learn Web Development from Scratch")}
                  >
                    Learn Web Development
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-secondary" 
                    onClick={() => setLearningGoal("Become a Data Scientist")}
                  >
                    Become a Data Scientist
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EnhancedAITutor;
