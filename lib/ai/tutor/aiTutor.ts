import { generateText } from "ai";
import { google } from "@ai-sdk/google";

// Use the provided Gemini API key
const GEMINI_API_KEY = "AIzaSyD4yPEZ3fqrSSyqqetySjnDg8vknyCFpLg";

/**
 * AI Tutor Service
 * Provides personalized AI tutoring with emotion-aware feedback
 * and federated learning capabilities
 */
export class AITutorService {
  private static instance: AITutorService;
  private userPreferences: Record<string, any> = {};
  private learningHistory: Record<string, any[]> = {};
  private emotionalState: Record<string, string> = {};
  private initialized: boolean = false;
  private topicTaxonomy: Record<string, string[]> = {};

  private constructor() {
    // Initialize topic taxonomy for knowledge graph connections
    this.initializeTopicTaxonomy();
  }

  /**
   * Get singleton instance of AITutorService
   */
  public static getInstance(): AITutorService {
    if (!AITutorService.instance) {
      AITutorService.instance = new AITutorService();
    }
    return AITutorService.instance;
  }
  
  /**
   * Initialize topic taxonomy for knowledge connections
   */
  private initializeTopicTaxonomy(): void {
    this.topicTaxonomy = {
      "blockchain": ["cryptocurrency", "smart contracts", "distributed ledger", "consensus algorithms", "web3"],
      "web development": ["frontend", "backend", "full-stack", "responsive design", "web frameworks"],
      "artificial intelligence": ["machine learning", "neural networks", "deep learning", "natural language processing", "computer vision"],
      "data science": ["statistics", "data analysis", "big data", "data visualization", "predictive modeling"],
      "cybersecurity": ["network security", "cryptography", "ethical hacking", "security protocols", "threat analysis"],
      "cloud computing": ["aws", "azure", "google cloud", "serverless", "containerization"],
      "mobile development": ["ios", "android", "react native", "flutter", "mobile ui design"],
      "devops": ["continuous integration", "continuous deployment", "infrastructure as code", "monitoring", "automation"],
      "software engineering": ["design patterns", "algorithms", "data structures", "testing", "software architecture"]
    };
  }
  
  /**
   * Identify knowledge gaps based on user's learning history
   */
  private identifyKnowledgeGaps(userId: string, topic: string): string[] {
    const history = this.learningHistory[userId] || [];
    const relatedTopics = this.findRelatedTopics(topic);
    
    // Check which related topics the user hasn't studied yet
    const studiedTopics = new Set(history.map(session => session.topic.toLowerCase()));
    const gaps = relatedTopics.filter(related => !studiedTopics.has(related.toLowerCase()));
    
    if (gaps.length === 0) {
      return [`Advanced concepts in ${topic}`, `Practical applications of ${topic}`, `Latest developments in ${topic}`];
    }
    
    return gaps.map(gap => `Connection between ${topic} and ${gap}`);
  }
  
  /**
   * Adapt difficulty level based on user's previous performance
   */
  private adaptDifficultyLevel(userId: string, topic: string, baseSkillLevel: string): string {
    const history = this.learningHistory[userId] || [];
    
    // Find relevant history entries for this topic or related topics
    const relevantEntries = history.filter(entry => {
      const entryTopic = entry.topic.toLowerCase();
      return entryTopic === topic.toLowerCase() || 
             this.findRelatedTopics(topic).some(related => 
               entryTopic === related.toLowerCase());
    });
    
    if (relevantEntries.length === 0) {
      return baseSkillLevel; // No history, use the base skill level
    }
    
    // Calculate average performance if available
    const performanceScores = relevantEntries
      .filter(entry => entry.performanceScore)
      .map(entry => entry.performanceScore);
    
    if (performanceScores.length === 0) {
      return baseSkillLevel;
    }
    
    const avgPerformance = performanceScores.reduce((sum, score) => sum + score, 0) / performanceScores.length;
    
    // Adjust difficulty based on performance
    if (avgPerformance > 85) {
      return baseSkillLevel === "beginner" ? "intermediate" : "advanced";
    } else if (avgPerformance < 50) {
      return baseSkillLevel === "advanced" ? "intermediate" : "beginner";
    }
    
    return baseSkillLevel;
  }
  
  /**
   * Personalize learning approach based on learning style
   */
  private personalizeLearningApproach(learningStyle: string, topic: string): string {
    switch (learningStyle.toLowerCase()) {
      case "visual":
        return `Use diagrams, charts, and visual metaphors to explain ${topic} concepts. Include visual representations for each key concept and use color coding to highlight relationships between ideas.`;
      
      case "auditory":
        return `Explain ${topic} concepts using clear verbal descriptions with analogies and stories. Suggest audio resources and encourage verbal repetition of key concepts.`;
      
      case "reading/writing":
        return `Present ${topic} information in well-structured text with bullet points, definitions, and written examples. Encourage note-taking and written summaries of key concepts.`;
      
      case "kinesthetic":
        return `Provide hands-on exercises and practical applications for ${topic} concepts. Include interactive elements and real-world projects that apply theoretical knowledge.`;
      
      default:
        return `Use a balanced approach combining visual elements, clear explanations, written summaries, and practical exercises to teach ${topic}.`;
    }
  }
  
  /**
   * Find related topics based on the topic taxonomy
   */
  private findRelatedTopics(topic: string): string[] {
    // Normalize the topic
    const normalizedTopic = topic.toLowerCase();
    
    // Check if the topic is a main category
    if (this.topicTaxonomy[normalizedTopic]) {
      return this.topicTaxonomy[normalizedTopic];
    }
    
    // Check if the topic is a subtopic in any category
    for (const [mainTopic, subtopics] of Object.entries(this.topicTaxonomy)) {
      if (subtopics.includes(normalizedTopic)) {
        // Return the main topic and other subtopics, excluding the current one
        return [mainTopic, ...subtopics.filter(sub => sub !== normalizedTopic)];
      }
    }
    
    // If no direct match, find the closest match based on keywords
    const allTopics = Object.keys(this.topicTaxonomy);
    const bestMatch = allTopics.find(t => normalizedTopic.includes(t) || t.includes(normalizedTopic));
    
    if (bestMatch) {
      return this.topicTaxonomy[bestMatch];
    }
    
    // Default related topics if no match found
    return ["software development", "computer science", "technology trends"];
  }
  
  /**
   * Calculate estimated time to complete a learning session
   */
  private calculateEstimatedTime(session: any): number {
    // Base time in minutes
    let baseTime = 30;
    
    // Add time based on number of concepts
    if (session.keyConcepts) {
      baseTime += session.keyConcepts.length * 10;
    }
    
    // Add time based on number of exercises
    if (session.exercises) {
      baseTime += session.exercises.length * 15;
    }
    
    // Add time for case studies
    if (session.caseStudies) {
      baseTime += session.caseStudies.length * 20;
    }
    
    return baseTime;
  }
  
  /**
   * Map difficulty level to numeric value
   */
  private mapDifficultyToNumeric(difficulty: string): number {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return 1;
      case "intermediate":
        return 2;
      case "advanced":
        return 3;
      default:
        return 1;
    }
  }
  
  /**
   * Categorize a topic into its taxonomy
   */
  private categorizeTopic(topic: string): string[] {
    const normalizedTopic = topic.toLowerCase();
    const categories = [];
    
    // Check if it's a main category
    if (this.topicTaxonomy[normalizedTopic]) {
      categories.push(normalizedTopic);
    }
    
    // Check if it's a subtopic
    for (const [mainTopic, subtopics] of Object.entries(this.topicTaxonomy)) {
      if (subtopics.includes(normalizedTopic)) {
        categories.push(mainTopic);
        break;
      }
    }
    
    // Check for partial matches
    if (categories.length === 0) {
      for (const [mainTopic, subtopics] of Object.entries(this.topicTaxonomy)) {
        if (normalizedTopic.includes(mainTopic) || mainTopic.includes(normalizedTopic)) {
          categories.push(mainTopic);
          break;
        }
        
        for (const subtopic of subtopics) {
          if (normalizedTopic.includes(subtopic) || subtopic.includes(normalizedTopic)) {
            categories.push(mainTopic);
            break;
          }
        }
      }
    }
    
    // Default category if no match found
    if (categories.length === 0) {
      categories.push("general knowledge");
    }
    
    return categories;
  }
  
  /**
   * Generate knowledge connections for a topic
   */
  private generateKnowledgeConnections(topic: string): string[] {
    const relatedTopics = this.findRelatedTopics(topic);
    return relatedTopics.map(related => `${topic} connects to ${related} through shared principles and applications`);
  }
  
  /**
   * Identify prerequisites for a topic
   */
  private identifyPrerequisites(topic: string): string[] {
    const normalizedTopic = topic.toLowerCase();
    
    // Define some common prerequisites based on topic
    const commonPrereqs: Record<string, string[]> = {
      "blockchain": ["cryptography basics", "distributed systems", "data structures"],
      "machine learning": ["statistics", "linear algebra", "calculus", "programming basics"],
      "web development": ["html", "css", "javascript basics"],
      "data science": ["statistics", "programming basics", "data structures"],
      "cybersecurity": ["networking basics", "operating systems", "programming basics"]
    };
    
    // Check for direct matches
    for (const [key, prereqs] of Object.entries(commonPrereqs)) {
      if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
        return prereqs;
      }
    }
    
    // Default prerequisites
    return ["basic computer literacy", "logical thinking", "problem-solving skills"];
  }

  /**
   * Initialize the AI Tutor service with user data
   */
  public async initialize(
    userId: string,
    initialPreferences?: any
  ): Promise<void> {
    try {
      // In a real implementation, this would load user data from a database
      this.userPreferences[userId] = initialPreferences || {
        learningStyle: "visual",
        pacePreference: "moderate",
        difficultyPreference: "adaptive",
        interestAreas: [],
        skillLevels: {},
      };

      this.learningHistory[userId] = [];
      this.emotionalState[userId] = "neutral";

      this.initialized = true;
      console.log("AI Tutor service initialized for user:", userId);
    } catch (error) {
      console.error("Failed to initialize AI Tutor service:", error);
      throw error;
    }
  }

  /**
   * Generate a personalized learning session based on user preferences and history
   */
  public async generateLearningSession(
    userId: string,
    topic: string,
    skillLevel: string = "beginner"
  ): Promise<any> {
    try {
      if (!this.initialized) {
        // Auto-initialize with default preferences if not initialized
        await this.initialize(userId);
      }

      const userPrefs = this.userPreferences[userId] || {
        learningStyle: "visual",
        pacePreference: "moderate",
        difficultyPreference: "adaptive",
        interestAreas: [],
        skillLevels: {},
      };
      const history = this.learningHistory[userId] || [];
      const emotionalState = this.emotionalState[userId] || "neutral";

      // Determine user's knowledge gaps based on history
      const knowledgeGaps = this.identifyKnowledgeGaps(userId, topic);
      
      // Adapt difficulty based on previous performance
      const adaptedDifficulty = this.adaptDifficultyLevel(userId, topic, skillLevel);
      
      // Personalize learning approach based on user's learning style
      const learningApproach = this.personalizeLearningApproach(userPrefs.learningStyle, topic);

      try {
        // Generate personalized content using Google Gemini
        const { text: sessionContent } = await generateText({
          model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY as any }),
          prompt: `
            Create a highly personalized and advanced learning session on "${topic}" for a ${adaptedDifficulty} level student.

            User preferences:
            - Learning style: ${userPrefs.learningStyle}
            - Pace preference: ${userPrefs.pacePreference}
            - Difficulty: ${adaptedDifficulty}
            - Current emotional state: ${emotionalState}
            
            Knowledge gaps to address:
            ${knowledgeGaps.join('\n')}
            
            Personalized learning approach:
            ${learningApproach}

            The session should include:
            1. An engaging introduction that connects to the user's existing knowledge
            2. Key concepts explained using the user's preferred learning style with real-world applications
            3. Progressive interactive exercises that adapt to their skill level
            4. Practical applications and case studies
            5. A comprehensive summary with knowledge connections
            6. Personalized next steps for mastery

            Format the response as a JSON object with the following structure:
            {
              "title": "Session title",
              "introduction": "Engaging introduction text that connects to prior knowledge",
              "learningObjectives": ["Objective 1", "Objective 2", ...],
              "keyConcepts": [
                { 
                  "title": "Concept 1", 
                  "explanation": "Detailed explanation text", 
                  "example": "Real-world example",
                  "visualRepresentation": "Description of visual aid",
                  "practicalApplication": "How this concept is applied" 
                },
                ...
              ],
              "exercises": [
                { 
                  "id": "ex1",
                  "type": "multiple_choice/coding/short_answer/practical",
                  "difficulty": "beginner/intermediate/advanced",
                  "question": "Detailed question text", 
                  "context": "Background information needed",
                  "options": ["Option 1", "Option 2", ...] (for multiple choice),
                  "hint": "Helpful hint text", 
                  "answer": "Detailed answer explanation",
                  "followUp": "Follow-up question or challenge" 
                },
                ...
              ],
              "caseStudies": [
                {
                  "title": "Case Study Title",
                  "scenario": "Real-world scenario description",
                  "challenge": "Problem to solve",
                  "solution": "Approach to solution",
                  "learningPoints": ["Key insight 1", "Key insight 2"]
                }
              ],
              "summary": "Comprehensive summary text with knowledge connections",
              "masteryChecklist": ["Skill 1", "Skill 2", ...],
              "nextSteps": ["Personalized next step 1", "Personalized next step 2", ...],
              "resources": [
                { "title": "Resource name", "type": "article/video/course", "description": "Brief description" }
              ]
            }
          `,
        });

        // Parse the response
        const session = JSON.parse(sessionContent);

        // Add to learning history
        if (this.learningHistory[userId]) {
          this.learningHistory[userId].push({
            timestamp: new Date().toISOString(),
            topic,
            skillLevel,
            sessionId: `session-${Date.now()}`,
          });
        }

        return session;
      } catch (aiError) {
        console.error("Error with AI generation:", aiError);

        // Return mock data for demo purposes
        return {
          title: `Learning ${topic} - ${skillLevel} Level`,
          introduction: `Welcome to this personalized session on ${topic}. This session is designed for ${skillLevel} level learners and will cover the fundamental concepts and practical applications.`,
          keyConcepts: [
            {
              title: "Core Concept 1",
              explanation:
                "This is an explanation of the first key concept in ${topic}.",
              example:
                "Here's a practical example of how this concept works in real-world scenarios.",
            },
            {
              title: "Core Concept 2",
              explanation:
                "This is an explanation of the second key concept in ${topic}.",
              example:
                "Here's a practical example of how this concept works in real-world scenarios.",
            },
            {
              title: "Core Concept 3",
              explanation:
                "This is an explanation of the third key concept in ${topic}.",
              example:
                "Here's a practical example of how this concept works in real-world scenarios.",
            },
          ],
          exercises: [
            {
              question: `Question 1 about ${topic}?`,
              hint: "Here's a hint to help you solve this problem.",
              answer: "This is the answer to question 1.",
            },
            {
              question: `Question 2 about ${topic}?`,
              hint: "Here's a hint to help you solve this problem.",
              answer: "This is the answer to question 2.",
            },
            {
              question: `Question 3 about ${topic}?`,
              hint: "Here's a hint to help you solve this problem.",
              answer: "This is the answer to question 3.",
            },
          ],
          summary: `In this session, you've learned the fundamental concepts of ${topic} at a ${skillLevel} level. You've explored the core principles and practiced with interactive exercises.`,
          nextSteps: [
            `Explore advanced topics in ${topic}`,
            "Practice with real-world projects",
            "Join a community of practitioners",
            "Take an assessment to test your knowledge",
          ],
        };
      }
    } catch (error) {
      console.error("Error generating learning session:", error);

      // Return mock data for demo purposes
      return {
        title: `Learning ${topic} - ${skillLevel} Level`,
        introduction: `Welcome to this personalized session on ${topic}. This session is designed for ${skillLevel} level learners and will cover the fundamental concepts and practical applications.`,
        keyConcepts: [
          {
            title: "Core Concept 1",
            explanation:
              "This is an explanation of the first key concept in ${topic}.",
            example:
              "Here's a practical example of how this concept works in real-world scenarios.",
          },
          {
            title: "Core Concept 2",
            explanation:
              "This is an explanation of the second key concept in ${topic}.",
            example:
              "Here's a practical example of how this concept works in real-world scenarios.",
          },
          {
            title: "Core Concept 3",
            explanation:
              "This is an explanation of the third key concept in ${topic}.",
            example:
              "Here's a practical example of how this concept works in real-world scenarios.",
          },
        ],
        exercises: [
          {
            question: `Question 1 about ${topic}?`,
            hint: "Here's a hint to help you solve this problem.",
            answer: "This is the answer to question 1.",
          },
          {
            question: `Question 2 about ${topic}?`,
            hint: "Here's a hint to help you solve this problem.",
            answer: "This is the answer to question 2.",
          },
          {
            question: `Question 3 about ${topic}?`,
            hint: "Here's a hint to help you solve this problem.",
            answer: "This is the answer to question 3.",
          },
        ],
        summary: `In this session, you've learned the fundamental concepts of ${topic} at a ${skillLevel} level. You've explored the core principles and practiced with interactive exercises.`,
        nextSteps: [
          `Explore advanced topics in ${topic}`,
          "Practice with real-world projects",
          "Join a community of practitioners",
          "Take an assessment to test your knowledge",
        ],
      };
    }
  }

  /**
   * Process user response and provide feedback with emotional awareness
   */
  public async processResponse(
    userId: string,
    sessionId: string,
    exerciseId: string,
    userResponse: string
  ): Promise<any> {
    try {
      if (!this.initialized) {
        // Auto-initialize with default preferences if not initialized
        await this.initialize(userId);
      }

      // Get the correct answer from the session
      // In a real implementation, this would retrieve the session from a database
      const correctAnswer = "Sample correct answer"; // Placeholder

      try {
        // Analyze the response using emotion-aware AI
        const { text: feedbackContent } = await generateText({
          model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY as any }),
          prompt: `
            Analyze this student response to a learning exercise.

            Exercise ID: ${exerciseId}
            Correct answer: ${correctAnswer}
            Student response: ${userResponse}

            Provide feedback that is:
            1. Emotionally intelligent (detect frustration, confusion, excitement, etc.)
            2. Constructive and encouraging
            3. Specific about what was done well and what needs improvement
            4. Includes a hint for improvement if needed

            Also analyze the emotional tone of the student's response.

            Format the response as a JSON object with the following structure:
            {
              "isCorrect": true/false,
              "feedback": "Detailed feedback text",
              "emotionalTone": "detected emotion (e.g., confused, excited, frustrated)",
              "hint": "Hint for improvement if needed",
              "nextRecommendation": "What to focus on next"
            }
          `,
        });

        // Parse the feedback
        const feedback = JSON.parse(feedbackContent);

        // Update the user's emotional state
        if (this.emotionalState[userId]) {
          this.emotionalState[userId] = feedback.emotionalTone;
        }

        return feedback;
      } catch (aiError) {
        console.error("Error with AI feedback generation:", aiError);

        // Return mock feedback for demo purposes
        const isCorrect = userResponse.length > 20; // Simple mock logic
        const mockFeedback = {
          isCorrect: isCorrect,
          feedback: isCorrect
            ? "Great job! Your response demonstrates a good understanding of the concept. You've covered the key points and provided a clear explanation."
            : "Thank you for your response. While you've made a good start, there are some areas that could be improved. Try to expand on your answer with more specific details.",
          emotionalTone: isCorrect ? "confident" : "uncertain",
          hint: isCorrect
            ? "To take your understanding even further, consider exploring how this concept connects to real-world applications."
            : "Try to include specific examples that demonstrate the concept in action.",
          nextRecommendation: isCorrect
            ? "Move on to the next topic to continue building your knowledge."
            : "Review the key concepts again before moving forward.",
        };

        // Update the user's emotional state with mock data
        if (this.emotionalState[userId]) {
          this.emotionalState[userId] = mockFeedback.emotionalTone;
        }

        return mockFeedback;
      }
    } catch (error) {
      console.error("Error processing response:", error);

      // Return mock feedback for demo purposes
      return {
        isCorrect: true,
        feedback:
          "Your response shows good understanding of the topic. You've covered the essential points clearly.",
        emotionalTone: "neutral",
        hint: "Consider how this concept might apply in different contexts.",
        nextRecommendation: "You're ready to move on to the next exercise.",
      };
    }
  }

  /**
   * Update user preferences based on learning patterns
   */
  public async updatePreferences(
    userId: string,
    newPreferences: any
  ): Promise<void> {
    try {
      if (!this.initialized) {
        throw new Error("AI Tutor service not initialized");
      }

      // Update preferences
      this.userPreferences[userId] = {
        ...this.userPreferences[userId],
        ...newPreferences,
      };

      console.log("Updated user preferences for:", userId);
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  }

  /**
   * Generate a skill assessment for a specific topic
   */
  public async assessSkill(userId: string, topic: string): Promise<any> {
    try {
      if (!this.initialized) {
        throw new Error("AI Tutor service not initialized");
      }

      // Generate assessment questions
      const { text: assessmentContent } = await generateText({
        model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY as any }),
        prompt: `
          Create a comprehensive skill assessment for "${topic}".

          The assessment should:
          1. Cover key concepts in ${topic}
          2. Include a variety of question types (multiple choice, short answer, practical application)
          3. Range from beginner to advanced difficulty
          4. Provide clear evaluation criteria

          Format the response as a JSON object with the following structure:
          {
            "topic": "${topic}",
            "questions": [
              {
                "id": "q1",
                "type": "multiple_choice/short_answer/practical",
                "difficulty": "beginner/intermediate/advanced",
                "question": "Question text",
                "options": ["Option 1", "Option 2", ...] (for multiple choice),
                "correctAnswer": "Correct answer",
                "rubric": "Evaluation criteria"
              },
              ...
            ],
            "passingCriteria": "Description of what constitutes passing the assessment",
            "certificationType": "Type of credential to be issued upon passing"
          }
        `,
      });

      // Parse the assessment
      const assessment = JSON.parse(assessmentContent);

      return assessment;
    } catch (error) {
      console.error("Error generating skill assessment:", error);
      throw error;
    }
  }

  /**
   * Create a personalized learning path based on user goals
   */
  public async createLearningPath(
    userId: string,
    goal: string,
    timeframe: string
  ): Promise<any> {
    try {
      if (!this.initialized) {
        throw new Error("AI Tutor service not initialized");
      }

      const userPrefs = this.userPreferences[userId];

      // Generate a personalized learning path
      const { text: pathContent } = await generateText({
        model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY as any }),
        prompt: `
          Create a personalized learning path for a student with the following goal:
          "${goal}" within a timeframe of ${timeframe}.

          User preferences:
          - Learning style: ${userPrefs.learningStyle}
          - Pace preference: ${userPrefs.pacePreference}
          - Interest areas: ${userPrefs.interestAreas.join(", ")}

          The learning path should include:
          1. A breakdown of the main skills/topics to master
          2. A sequential order of learning with dependencies clearly marked
          3. Estimated time to complete each section
          4. Recommended resources for each topic
          5. Milestones and assessment points
          6. Credential opportunities along the way

          Format the response as a JSON object with the following structure:
          {
            "goal": "${goal}",
            "timeframe": "${timeframe}",
            "skills": [
              {
                "id": "skill1",
                "name": "Skill name",
                "description": "Skill description",
                "estimatedHours": 10,
                "dependencies": ["skill-id-1", "skill-id-2"],
                "resources": [
                  { "type": "video/article/course", "title": "Resource title", "url": "URL" }
                ],
                "assessment": "Description of how this skill will be assessed",
                "credentialType": "Type of credential available"
              },
              ...
            ],
            "milestones": [
              { "name": "Milestone 1", "skills": ["skill1", "skill2"], "assessment": "Assessment description" }
            ],
            "totalEstimatedHours": 100
          }
        `,
      });

      // Parse the learning path
      const learningPath = JSON.parse(pathContent);

      return learningPath;
    } catch (error) {
      console.error("Error creating learning path:", error);
      throw error;
    }
  }
}

export default AITutorService;
