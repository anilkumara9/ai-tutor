"use client";

import React, { useState } from "react";
import { useNexus } from "@/contexts/NexusContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const LearningExperience: React.FC = () => {
  const {
    isInitialized,
    isLoading,
    error,
    createLearningExperience,
    processLearningResponse,
    completeLearningActivity,
    issueSkillCredential,
  } = useNexus();

  const [topic, setTopic] = useState("");
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [activeTab, setActiveTab] = useState("create");
  const [experience, setExperience] = useState<any>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Create a new learning experience
  const handleCreateExperience = async () => {
    if (!topic) {
      toast.error("Please enter a topic");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createLearningExperience(topic, skillLevel);
      setExperience(result);
      setActiveTab("learn");
      toast.success("Learning experience created successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to create learning experience");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit response to an exercise
  const handleSubmitResponse = async () => {
    if (!userResponse) {
      toast.error("Please enter your response");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await processLearningResponse(
        experience?.session?.title || "session",
        `exercise-${currentExerciseIndex}`,
        userResponse
      );
      setFeedback(result);
      toast.success("Response submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to process response");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Move to the next exercise
  const handleNextExercise = () => {
    if (
      experience?.session?.exercises &&
      currentExerciseIndex < experience.session.exercises.length - 1
    ) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setUserResponse("");
      setFeedback(null);
    }
  };

  // Complete the learning experience
  const handleCompleteExperience = async () => {
    try {
      setIsCompleting(true);

      // First, reward the user for completing the activity
      await completeLearningActivity(
        "course_completion",
        `${topic}-${Date.now()}`,
        {
          topic,
          skillLevel,
          completedAt: new Date().toISOString(),
        }
      );

      // Then, issue a credential for the skill
      await issueSkillCredential(topic, skillLevel, {
        score: 85,
        completedAt: new Date().toISOString(),
        exercises: experience?.session?.exercises?.length || 0,
      });

      toast.success(
        "Learning experience completed! You earned tokens and a credential."
      );
      setActiveTab("world");
    } catch (err: any) {
      toast.error(err.message || "Failed to complete learning experience");
    } finally {
      setIsCompleting(false);
    }
  };

  // Get current exercise
  const getCurrentExercise = () => {
    if (
      !experience?.session?.exercises ||
      experience.session.exercises.length === 0
    ) {
      return null;
    }

    return experience.session.exercises[currentExerciseIndex];
  };

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <p className="text-lg">Please initialize OmniLearn Nexus first</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Learning Experience</h1>
      <p className="text-muted-foreground mb-6">
        Create and engage with personalized learning experiences
      </p>

      <Tabs
        defaultValue="create"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="learn" disabled={!experience}>
            Learn
          </TabsTrigger>
          <TabsTrigger value="world" disabled={!experience}>
            Skillverse
          </TabsTrigger>
        </TabsList>

        {/* Create Tab */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Learning Experience</CardTitle>
              <CardDescription>
                Generate a personalized learning experience with AI tutoring and
                a 3D learning world
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Learning Topic</Label>
                <Input
                  id="topic"
                  placeholder="e.g., Blockchain Technology, Machine Learning, Web Development"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skill-level">Skill Level</Label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger id="skill-level">
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleCreateExperience}
                disabled={isSubmitting || !topic}
                className="w-full"
              >
                {isSubmitting ? "Creating..." : "Create Learning Experience"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Learn Tab */}
        <TabsContent value="learn">
          {experience && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{experience.session.title}</CardTitle>
                  <CardDescription>
                    Interactive learning session with AI tutor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Introduction</h3>
                    <p className="text-sm text-muted-foreground">
                      {experience.session.introduction}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Key Concepts</h3>
                    <div className="space-y-3">
                      {experience.session.keyConcepts.map(
                        (concept: any, index: number) => (
                          <div
                            key={index}
                            className="bg-muted/20 p-3 rounded-lg"
                          >
                            <h4 className="font-medium">{concept.title}</h4>
                            <p className="text-sm mt-1">
                              {concept.explanation}
                            </p>
                            {concept.example && (
                              <div className="bg-muted/30 p-2 rounded mt-2 text-sm">
                                <span className="font-medium">Example:</span>{" "}
                                {concept.example}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Interactive Exercise</h3>
                    {getCurrentExercise() ? (
                      <div className="space-y-3">
                        <div className="bg-primary/5 p-4 rounded-lg">
                          <p className="font-medium">
                            Question {currentExerciseIndex + 1} of{" "}
                            {experience.session.exercises.length}
                          </p>
                          <p className="mt-2">
                            {getCurrentExercise().question}
                          </p>
                          {getCurrentExercise().hint && (
                            <div className="bg-muted/30 p-2 rounded mt-2 text-sm">
                              <span className="font-medium">Hint:</span>{" "}
                              {getCurrentExercise().hint}
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="response">Your Response</Label>
                          <Textarea
                            id="response"
                            placeholder="Type your answer here..."
                            value={userResponse}
                            onChange={(e) => setUserResponse(e.target.value)}
                            rows={4}
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={handleSubmitResponse}
                            disabled={isSubmitting || !userResponse}
                            className="flex-1"
                          >
                            {isSubmitting ? "Submitting..." : "Submit Response"}
                          </Button>

                          {currentExerciseIndex <
                            experience.session.exercises.length - 1 && (
                            <Button
                              variant="outline"
                              onClick={handleNextExercise}
                              disabled={!feedback}
                              className="flex-1"
                            >
                              Next Exercise
                            </Button>
                          )}

                          {currentExerciseIndex ===
                            experience.session.exercises.length - 1 &&
                            feedback && (
                              <Button
                                variant="outline"
                                onClick={handleCompleteExperience}
                                disabled={isCompleting}
                                className="flex-1"
                              >
                                {isCompleting
                                  ? "Completing..."
                                  : "Complete & Earn"}
                              </Button>
                            )}
                        </div>

                        {feedback && (
                          <div
                            className={`p-4 rounded-lg ${
                              feedback.isCorrect ? "bg-green-50" : "bg-amber-50"
                            }`}
                          >
                            <h4
                              className={`font-medium ${
                                feedback.isCorrect
                                  ? "text-green-700"
                                  : "text-amber-700"
                              }`}
                            >
                              {feedback.isCorrect
                                ? "Correct!"
                                : "Needs Improvement"}
                            </h4>
                            <p className="mt-1 text-sm">{feedback.feedback}</p>
                            {feedback.hint && (
                              <p className="mt-2 text-sm font-medium">
                                Hint: {feedback.hint}
                              </p>
                            )}
                            <p className="mt-2 text-sm font-medium">
                              Next: {feedback.nextRecommendation}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No exercises available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {experience.session.summary}
                  </p>

                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Next Steps</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {experience.session.nextSteps.map(
                        (step: string, index: number) => (
                          <li key={index} className="text-sm">
                            {step}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* World Tab */}
        <TabsContent value="world">
          {experience && experience.world && (
            <Card>
              <CardHeader>
                <CardTitle>{experience.world.name}</CardTitle>
                <CardDescription>
                  Your 3D learning environment for {topic}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-48 rounded-lg flex items-center justify-center">
                  <h3 className="text-white text-xl font-bold">
                    Skillverse Visualization
                  </h3>
                </div>

                <div>
                  <h3 className="font-medium mb-2">World Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {experience.world.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">
                    Central Hub: {experience.world.centralHub.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {experience.world.centralHub.description}
                  </p>

                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Key Elements</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {experience.world.centralHub.keyElements.map(
                        (element: string, index: number) => (
                          <li key={index} className="text-sm">
                            {element}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Learning Zones</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {experience.world.zones.map((zone: any, index: number) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            {zone.name}
                          </CardTitle>
                          <CardDescription>{zone.subTopic}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-2">{zone.description}</p>

                          {zone.challenges && zone.challenges.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                Challenges
                              </h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {zone.challenges.map(
                                  (challenge: any, idx: number) => (
                                    <li key={idx} className="text-xs">
                                      {challenge.name}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Visual Metaphors</h3>
                  <div className="space-y-3">
                    {experience.world.visualMetaphors.map(
                      (metaphor: any, index: number) => (
                        <div key={index} className="bg-muted/20 p-3 rounded-lg">
                          <h4 className="text-sm font-medium">
                            {metaphor.concept}
                          </h4>
                          <p className="text-sm mt-1">
                            Represented as: {metaphor.metaphor}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {metaphor.explanation}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningExperience;
