import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

/**
 * Advanced Analytics Service
 * Provides AI-powered analytics and insights for the learning platform
 */
export class AnalyticsService {
  private static instance: AnalyticsService;
  private userAnalytics: Record<string, any> = {};
  private initialized: boolean = false;

  private constructor() {}

  /**
   * Get singleton instance of AnalyticsService
   */
  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Initialize the Analytics service with user data
   */
  public async initialize(userId: string): Promise<void> {
    try {
      // In a real implementation, this would load user data from a database
      this.userAnalytics[userId] = {
        learningPatterns: {},
        skillGaps: [],
        recommendations: [],
        performanceMetrics: {},
        lastUpdated: new Date().toISOString(),
      };

      this.initialized = true;
      console.log("Analytics service initialized for user:", userId);
    } catch (error) {
      console.error("Failed to initialize Analytics service:", error);
      throw error;
    }
  }

  /**
   * Generate learning insights based on user activity
   */
  public async generateLearningInsights(userId: string, learningHistory: any[]): Promise<any> {
    try {
      if (!this.initialized) {
        await this.initialize(userId);
      }

      // Format learning history for AI analysis
      const formattedHistory = JSON.stringify(learningHistory);

      // Generate insights using AI
      const { text: insightsContent } = await generateText({
        model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY }),
        prompt: `
          Analyze this student's learning history and provide meaningful insights:
          ${formattedHistory}

          Generate insights about:
          1. Learning patterns (time of day, duration, frequency)
          2. Strengths and weaknesses
          3. Progress trends
          4. Engagement levels
          5. Skill development areas

          Format the response as a JSON object with the following structure:
          {
            "learningPatterns": {
              "preferredTimes": ["morning", "evening"],
              "averageDuration": "45 minutes",
              "frequency": "3-4 times per week"
            },
            "strengths": ["topic1", "topic2"],
            "weaknesses": ["topic3", "topic4"],
            "progressTrend": "improving/declining/steady",
            "engagementLevel": "high/medium/low",
            "skillDevelopment": {
              "improving": ["skill1", "skill2"],
              "needsAttention": ["skill3", "skill4"]
            }
          }
        `,
      });

      // Parse the insights
      const insights = JSON.parse(insightsContent);

      // Update user analytics
      this.userAnalytics[userId] = {
        ...this.userAnalytics[userId],
        learningInsights: insights,
        lastUpdated: new Date().toISOString(),
      };

      return insights;
    } catch (error) {
      console.error("Error generating learning insights:", error);
      // Return a fallback response if AI fails
      return {
        learningPatterns: {
          preferredTimes: ["evening"],
          averageDuration: "30 minutes",
          frequency: "2-3 times per week"
        },
        strengths: ["Basic concepts"],
        weaknesses: ["Advanced applications"],
        progressTrend: "steady",
        engagementLevel: "medium",
        skillDevelopment: {
          improving: ["Fundamentals"],
          needsAttention: ["Practical applications"]
        }
      };
    }
  }

  /**
   * Identify skill gaps based on user performance and goals
   */
  public async identifySkillGaps(userId: string, userSkills: any[], careerGoals: string[]): Promise<any> {
    try {
      if (!this.initialized) {
        await this.initialize(userId);
      }

      // Format user data for AI analysis
      const userData = {
        skills: userSkills,
        goals: careerGoals
      };

      // Generate skill gap analysis using AI
      const { text: gapsContent } = await generateText({
        model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY }),
        prompt: `
          Analyze this student's current skills and career goals to identify skill gaps:
          ${JSON.stringify(userData)}

          Identify:
          1. Missing critical skills needed for their goals
          2. Skills that need improvement
          3. Emerging skills in their field they should learn
          4. Priority level for each skill gap (high/medium/low)

          Format the response as a JSON array with the following structure:
          [
            {
              "skill": "Skill name",
              "category": "Technical/Soft/Domain",
              "currentLevel": "none/basic/intermediate",
              "requiredLevel": "intermediate/advanced",
              "priority": "high/medium/low",
              "relevantGoal": "Which career goal this relates to",
              "learningResources": ["resource1", "resource2"]
            }
          ]
        `,
      });

      // Parse the skill gaps
      const skillGaps = JSON.parse(gapsContent);

      // Update user analytics
      this.userAnalytics[userId] = {
        ...this.userAnalytics[userId],
        skillGaps,
        lastUpdated: new Date().toISOString(),
      };

      return skillGaps;
    } catch (error) {
      console.error("Error identifying skill gaps:", error);
      // Return a fallback response if AI fails
      return [
        {
          skill: "Advanced Data Structures",
          category: "Technical",
          currentLevel: "basic",
          requiredLevel: "advanced",
          priority: "high",
          relevantGoal: "Blockchain Developer",
          learningResources: ["Online courses", "Practice platforms"]
        }
      ];
    }
  }

  /**
   * Generate personalized learning recommendations
   */
  public async generateRecommendations(userId: string, learningHistory: any[], preferences: any): Promise<any> {
    try {
      if (!this.initialized) {
        await this.initialize(userId);
      }

      // Format user data for AI analysis
      const userData = {
        history: learningHistory,
        preferences
      };

      // Generate recommendations using AI
      const { text: recommendationsContent } = await generateText({
        model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY }),
        prompt: `
          Generate personalized learning recommendations for this student based on their history and preferences:
          ${JSON.stringify(userData)}

          Provide recommendations for:
          1. Courses they should take next
          2. Skills they should focus on developing
          3. Learning resources tailored to their preferences
          4. Practice exercises to reinforce learning
          5. Learning schedule optimizations

          Format the response as a JSON array with the following structure:
          [
            {
              "id": "unique-id",
              "type": "course/skill/resource/exercise/schedule",
              "title": "Recommendation title",
              "description": "Detailed description",
              "reason": "Why this is recommended",
              "difficulty": "beginner/intermediate/advanced",
              "estimatedTime": "time to complete",
              "relevance": "high/medium/low"
            }
          ]
        `,
      });

      // Parse the recommendations
      const recommendations = JSON.parse(recommendationsContent);

      // Update user analytics
      this.userAnalytics[userId] = {
        ...this.userAnalytics[userId],
        recommendations,
        lastUpdated: new Date().toISOString(),
      };

      return recommendations;
    } catch (error) {
      console.error("Error generating recommendations:", error);
      // Return a fallback response if AI fails
      return [
        {
          id: "rec-1",
          type: "course",
          title: "Introduction to Blockchain",
          description: "Learn the fundamentals of blockchain technology",
          reason: "Aligns with your interest in decentralized systems",
          difficulty: "beginner",
          estimatedTime: "4 weeks",
          relevance: "high"
        }
      ];
    }
  }

  /**
   * Generate a personalized learning plan
   */
  public async generateLearningPlan(userId: string, timeframe: string, focus: string): Promise<any> {
    try {
      if (!this.initialized) {
        await this.initialize(userId);
      }

      // Get existing analytics data
      const userAnalytics = this.userAnalytics[userId];
      const skillGaps = userAnalytics.skillGaps || [];
      const recommendations = userAnalytics.recommendations || [];

      // Format data for AI analysis
      const planData = {
        skillGaps,
        recommendations,
        timeframe,
        focus
      };

      // Generate learning plan using AI
      const { text: planContent } = await generateText({
        model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY }),
        prompt: `
          Create a personalized learning plan for this student based on their skill gaps and recommendations:
          ${JSON.stringify(planData)}

          The plan should:
          1. Cover a timeframe of ${timeframe}
          2. Focus primarily on ${focus}
          3. Address their highest priority skill gaps
          4. Include their most relevant recommendations
          5. Be structured with clear milestones and goals

          Format the response as a JSON object with the following structure:
          {
            "title": "Plan title",
            "description": "Plan description",
            "timeframe": "${timeframe}",
            "focus": "${focus}",
            "milestones": [
              {
                "title": "Milestone title",
                "description": "Description",
                "duration": "Time to complete",
                "activities": [
                  {
                    "title": "Activity title",
                    "type": "course/project/exercise",
                    "description": "Description",
                    "resources": ["resource1", "resource2"]
                  }
                ]
              }
            ],
            "expectedOutcomes": ["outcome1", "outcome2"]
          }
        `,
      });

      // Parse the learning plan
      const learningPlan = JSON.parse(planContent);

      // Update user analytics
      this.userAnalytics[userId] = {
        ...this.userAnalytics[userId],
        learningPlan,
        lastUpdated: new Date().toISOString(),
      };

      return learningPlan;
    } catch (error) {
      console.error("Error generating learning plan:", error);
      // Return a fallback response if AI fails
      return {
        title: "3-Month Blockchain Development Path",
        description: "A focused plan to develop blockchain development skills",
        timeframe: timeframe,
        focus: focus,
        milestones: [
          {
            title: "Fundamentals",
            description: "Master the core concepts",
            duration: "4 weeks",
            activities: [
              {
                title: "Blockchain Basics",
                type: "course",
                description: "Learn the fundamentals of blockchain technology",
                resources: ["Online course", "Documentation"]
              }
            ]
          }
        ],
        expectedOutcomes: ["Basic blockchain development skills"]
      };
    }
  }

  /**
   * Analyze learning performance and generate metrics
   */
  public async analyzePerformance(userId: string, assessmentResults: any[]): Promise<any> {
    try {
      if (!this.initialized) {
        await this.initialize(userId);
      }

      // Calculate basic metrics
      const totalAssessments = assessmentResults.length;
      const averageScore = assessmentResults.reduce((sum, result) => sum + result.score, 0) / totalAssessments;
      
      // Calculate improvement over time
      const sortedResults = [...assessmentResults].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      const firstHalf = sortedResults.slice(0, Math.floor(sortedResults.length / 2));
      const secondHalf = sortedResults.slice(Math.floor(sortedResults.length / 2));
      
      const firstHalfAvg = firstHalf.reduce((sum, result) => sum + result.score, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, result) => sum + result.score, 0) / secondHalf.length;
      
      const improvementRate = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;

      // Generate performance metrics
      const performanceMetrics = {
        totalAssessments,
        averageScore,
        improvementRate,
        strengths: [],
        weaknesses: [],
        consistentAreas: [],
        volatileAreas: []
      };

      // Use AI to analyze performance in detail
      const { text: analysisContent } = await generateText({
        model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY }),
        prompt: `
          Analyze this student's assessment results and identify patterns:
          ${JSON.stringify(assessmentResults)}

          Based on the assessment data, identify:
          1. Areas of consistent strength
          2. Areas of consistent weakness
          3. Areas with high volatility (inconsistent performance)
          4. Areas showing the most improvement
          5. Areas showing decline or stagnation

          Format the response as a JSON object with the following structure:
          {
            "strengths": ["area1", "area2"],
            "weaknesses": ["area3", "area4"],
            "consistentAreas": ["area5", "area6"],
            "volatileAreas": ["area7", "area8"],
            "improvingAreas": ["area9", "area10"],
            "decliningAreas": ["area11", "area12"]
          }
        `,
      });

      // Parse the analysis
      const analysis = JSON.parse(analysisContent);

      // Combine calculated metrics with AI analysis
      const combinedMetrics = {
        ...performanceMetrics,
        ...analysis
      };

      // Update user analytics
      this.userAnalytics[userId] = {
        ...this.userAnalytics[userId],
        performanceMetrics: combinedMetrics,
        lastUpdated: new Date().toISOString(),
      };

      return combinedMetrics;
    } catch (error) {
      console.error("Error analyzing performance:", error);
      // Return basic metrics if AI fails
      return {
        totalAssessments: assessmentResults.length,
        averageScore: assessmentResults.reduce((sum, result) => sum + result.score, 0) / assessmentResults.length,
        strengths: ["Basic concepts"],
        weaknesses: ["Advanced applications"],
        consistentAreas: ["Fundamentals"],
        volatileAreas: ["Problem solving"]
      };
    }
  }

  /**
   * Predict future performance based on current trends
   */
  public async predictFuturePerformance(userId: string, learningData: any): Promise<any> {
    try {
      if (!this.initialized) {
        await this.initialize(userId);
      }

      // Generate prediction using AI
      const { text: predictionContent } = await generateText({
        model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY }),
        prompt: `
          Based on this student's learning data, predict their future performance:
          ${JSON.stringify(learningData)}

          Predict:
          1. Expected skill levels in 1 month, 3 months, and 6 months
          2. Areas likely to show the most improvement
          3. Areas that may need additional attention
          4. Potential roadblocks to progress
          5. Optimal learning path to maximize improvement

          Format the response as a JSON object with the following structure:
          {
            "predictedSkillLevels": {
              "1month": { "skill1": "level", "skill2": "level" },
              "3months": { "skill1": "level", "skill2": "level" },
              "6months": { "skill1": "level", "skill2": "level" }
            },
            "areasOfImprovement": ["area1", "area2"],
            "areasNeedingAttention": ["area3", "area4"],
            "potentialRoadblocks": ["roadblock1", "roadblock2"],
            "optimalLearningPath": "Description of optimal path"
          }
        `,
      });

      // Parse the prediction
      const prediction = JSON.parse(predictionContent);

      // Update user analytics
      this.userAnalytics[userId] = {
        ...this.userAnalytics[userId],
        performancePrediction: prediction,
        lastUpdated: new Date().toISOString(),
      };

      return prediction;
    } catch (error) {
      console.error("Error predicting future performance:", error);
      // Return a fallback response if AI fails
      return {
        predictedSkillLevels: {
          "1month": { "Blockchain Basics": "intermediate" },
          "3months": { "Blockchain Basics": "advanced" },
          "6months": { "Blockchain Basics": "expert" }
        },
        areasOfImprovement: ["Technical understanding"],
        areasNeedingAttention: ["Practical application"],
        potentialRoadblocks: ["Time constraints"],
        optimalLearningPath: "Focus on hands-on projects after mastering fundamentals"
      };
    }
  }
}

export default AnalyticsService;
