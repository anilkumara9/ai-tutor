"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNexus } from "@/contexts/NexusContext";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      </CardHeader>
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
    </Card>
  );
};

export default EnhancedAITutor;
