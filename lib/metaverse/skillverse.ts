import { generateText } from "ai";
import { google } from "@ai-sdk/google";

// Use the provided Gemini API key
const GEMINI_API_KEY = "AIzaSyD4yPEZ3fqrSSyqqetySjnDg8vknyCFpLg";

/**
 * Skillverse Service
 * Handles the metaverse integration for visualizing skills and learning paths
 * in an immersive 3D environment
 */
export class SkillverseService {
  private static instance: SkillverseService;
  private userWorlds: Record<string, any> = {};
  private initialized: boolean = false;

  private constructor() {}

  /**
   * Get singleton instance of SkillverseService
   */
  public static getInstance(): SkillverseService {
    if (!SkillverseService.instance) {
      SkillverseService.instance = new SkillverseService();
    }
    return SkillverseService.instance;
  }

  /**
   * Initialize the Skillverse service
   */
  public async initialize(): Promise<void> {
    try {
      this.initialized = true;
      console.log("Skillverse service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Skillverse service:", error);
      throw error;
    }
  }

  /**
   * Generate a 3D world based on a learning topic or skill
   */
  public async generateWorld(
    userId: string,
    topic: string,
    complexity: "simple" | "moderate" | "complex" = "moderate"
  ): Promise<any> {
    try {
      if (!this.initialized) {
        // Auto-initialize if not initialized
        await this.initialize();
      }

      try {
        // Generate world description using AI
        const { text: worldDescription } = await generateText({
          model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY }),
          prompt: `
            Create a detailed description of a 3D learning environment (Skillverse) for the topic "${topic}".

            The world should be ${complexity} in complexity and include:
            1. A central hub area that represents the main concept
            2. Different zones or regions for sub-topics
            3. Interactive elements that represent key learning points
            4. Challenges or quests that test knowledge
            5. Visual metaphors that help understand complex concepts

            Format the response as a JSON object with the following structure:
            {
              "name": "World name",
              "description": "Overall world description",
              "theme": "Visual theme/aesthetic",
              "centralHub": {
                "name": "Hub name",
                "description": "Hub description",
                "keyElements": ["Element 1", "Element 2", ...]
              },
              "zones": [
                {
                  "name": "Zone name",
                  "description": "Zone description",
                  "subTopic": "Related sub-topic",
                  "interactiveElements": [
                    { "name": "Element name", "description": "Element description", "learningPoint": "What this teaches" }
                  ],
                  "challenges": [
                    { "name": "Challenge name", "description": "Challenge description", "reward": "What user earns" }
                  ]
                },
                ...
              ],
              "visualMetaphors": [
                { "concept": "Complex concept", "metaphor": "Visual representation", "explanation": "How it helps understanding" }
              ],
              "recommendedPath": ["Zone 1", "Challenge 2", ...]
            }
          `,
        });

        // Parse the world description
        const world = JSON.parse(worldDescription);

        // Store the world for this user
        this.userWorlds[userId] = {
          ...world,
          createdAt: new Date().toISOString(),
          lastVisited: new Date().toISOString(),
        };

        return world;
      } catch (aiError) {
        console.error("Error with AI world generation:", aiError);

        // Create a mock world for demo purposes
        const mockWorld = {
          name: `${topic} Learning World`,
          description: `A vibrant, interactive 3D environment designed to help you master ${topic} through exploration and challenges.`,
          theme: "Futuristic Digital Landscape",
          centralHub: {
            name: `${topic} Central Hub`,
            description: `The central gathering point that introduces the core concepts of ${topic}.`,
            keyElements: [
              "Knowledge Repository",
              "Skill Assessment Station",
              "Learning Path Visualizer",
            ],
          },
          zones: [
            {
              name: "Fundamentals Zone",
              description: `The starting area where learners grasp the basic principles of ${topic}.`,
              subTopic: `${topic} Basics`,
              interactiveElements: [
                {
                  name: "Concept Visualizer",
                  description:
                    "An interactive display that breaks down complex ideas into visual components.",
                  learningPoint: "Visual understanding of abstract concepts",
                },
                {
                  name: "Practice Arena",
                  description:
                    "A space where learners can apply basic concepts in simple scenarios.",
                  learningPoint:
                    "Practical application of fundamental principles",
                },
              ],
              challenges: [
                {
                  name: "Fundamentals Challenge",
                  description:
                    "Test your understanding of the basic principles.",
                  reward: "Foundation Badge",
                },
              ],
            },
            {
              name: "Advanced Applications Zone",
              description: `A more complex area where learners apply ${topic} concepts to real-world scenarios.`,
              subTopic: `Applied ${topic}`,
              interactiveElements: [
                {
                  name: "Simulation Engine",
                  description:
                    "Create and test complex scenarios in a controlled environment.",
                  learningPoint: "Problem-solving and application",
                },
              ],
              challenges: [
                {
                  name: "Real-World Application Challenge",
                  description:
                    "Solve a complex problem using advanced techniques.",
                  reward: "Expert Practitioner Badge",
                },
              ],
            },
            {
              name: "Innovation Lab",
              description: `A creative space where learners can experiment with new ideas in ${topic}.`,
              subTopic: `${topic} Innovation`,
              interactiveElements: [
                {
                  name: "Idea Forge",
                  description:
                    "Combine different concepts to create new approaches and solutions.",
                  learningPoint: "Creative thinking and innovation",
                },
              ],
              challenges: [
                {
                  name: "Innovation Challenge",
                  description:
                    "Create a novel solution to an unsolved problem.",
                  reward: "Innovator Badge",
                },
              ],
            },
          ],
          visualMetaphors: [
            {
              concept: `${topic} Complexity`,
              metaphor: "A growing tree with branching paths",
              explanation:
                "Illustrates how concepts build upon each other and branch into specialized areas",
            },
            {
              concept: "Learning Progress",
              metaphor: "A mountain with multiple paths to the summit",
              explanation:
                "Shows that there are many ways to master the subject, each with different challenges",
            },
          ],
          recommendedPath: [
            "Fundamentals Zone",
            "Advanced Applications Zone",
            "Innovation Lab",
          ],
        };

        // Store the mock world for this user
        this.userWorlds[userId] = {
          ...mockWorld,
          createdAt: new Date().toISOString(),
          lastVisited: new Date().toISOString(),
        };

        return mockWorld;
      }
    } catch (error) {
      console.error("Error generating world:", error);

      // Return a simple mock world for demo purposes
      const simpleWorld = {
        name: `${topic} World`,
        description: `A learning environment for ${topic}.`,
        theme: "Digital Landscape",
        centralHub: {
          name: "Central Hub",
          description: "The main area for learning.",
          keyElements: ["Knowledge Center", "Practice Area"],
        },
        zones: [
          {
            name: "Basics Zone",
            description: "Learn the fundamentals.",
            subTopic: "Fundamentals",
            interactiveElements: [
              {
                name: "Tutorial Station",
                description: "Interactive tutorials.",
                learningPoint: "Basic concepts",
              },
            ],
            challenges: [
              {
                name: "Quiz Challenge",
                description: "Test your knowledge.",
                reward: "Completion Badge",
              },
            ],
          },
        ],
        visualMetaphors: [
          {
            concept: "Learning Journey",
            metaphor: "A path through a landscape",
            explanation: "Represents progress through the material",
          },
        ],
        recommendedPath: ["Basics Zone"],
      };

      return simpleWorld;
    }
  }

  /**
   * Generate 3D model descriptions for world elements
   */
  public async generate3DModelDescriptions(
    worldId: string,
    elements: string[]
  ): Promise<any> {
    try {
      if (!this.initialized) {
        throw new Error("Skillverse service not initialized");
      }

      // Generate 3D model descriptions using AI
      const { text: modelDescriptions } = await generateText({
        model: google("gemini-2.0-flash-001"),
        prompt: `
          Create detailed descriptions for 3D models to represent the following elements in a learning metaverse:
          ${elements.join(", ")}

          For each element, provide:
          1. A detailed visual description
          2. Key features that should be included
          3. Suggested colors and textures
          4. Scale and proportions
          5. Any animations or interactive aspects

          Format the response as a JSON array with objects for each element:
          [
            {
              "element": "Element name",
              "visualDescription": "Detailed description",
              "keyFeatures": ["Feature 1", "Feature 2", ...],
              "colorScheme": "Color palette description",
              "scale": "Size relative to user avatar",
              "animations": ["Animation 1", "Animation 2", ...]
            },
            ...
          ]
        `,
      });

      // Parse the model descriptions
      const models = JSON.parse(modelDescriptions);

      return models;
    } catch (error) {
      console.error("Error generating 3D model descriptions:", error);
      throw error;
    }
  }

  /**
   * Get a user's world
   */
  public async getUserWorld(userId: string): Promise<any> {
    try {
      if (!this.initialized) {
        // Auto-initialize if not initialized
        await this.initialize();
      }

      const world = this.userWorlds[userId];

      if (!world) {
        // Instead of throwing an error, return null
        console.log("No world found for this user, returning null");
        return null;
      }

      // Update last visited timestamp
      world.lastVisited = new Date().toISOString();

      return world;
    } catch (error) {
      console.error("Error getting user world:", error);
      return null; // Return null instead of throwing error
    }
  }

  /**
   * Generate a learning challenge within the world
   */
  public async generateChallenge(
    userId: string,
    zoneName: string,
    difficulty: "beginner" | "intermediate" | "advanced" = "intermediate"
  ): Promise<any> {
    try {
      if (!this.initialized) {
        // Auto-initialize if not initialized
        await this.initialize();
      }

      const world = this.userWorlds[userId];

      if (!world) {
        console.log("No world found for this user, creating a mock challenge");
        // Return a mock challenge instead of throwing an error
        return {
          name: `${difficulty} Challenge`,
          description: `A ${difficulty} level challenge to test your knowledge.`,
          difficulty,
          objectives: ["Complete the quiz", "Apply concepts to a problem"],
          steps: [
            {
              order: 1,
              description: "Read the problem statement",
              hint: "Take your time to understand the requirements",
            },
            {
              order: 2,
              description: "Formulate your solution",
              hint: "Break down the problem into smaller parts",
            },
            {
              order: 3,
              description: "Submit your answer",
              hint: "Double-check your work before submitting",
            },
          ],
          successCriteria: "Correctly answer at least 70% of the questions",
          reward: {
            type: "token",
            name: "Knowledge Token",
            description: "Tokens earned for completing challenges",
            value: "5",
          },
          estimatedTimeMinutes: 15,
        };
      }

      // Find the zone
      const zone = world.zones.find((z: any) => z.name === zoneName);

      if (!zone) {
        console.log(`Zone "${zoneName}" not found, creating a mock challenge`);
        // Return a mock challenge instead of throwing an error
        return {
          name: `${difficulty} Challenge`,
          description: `A ${difficulty} level challenge to test your knowledge.`,
          difficulty,
          objectives: ["Complete the quiz", "Apply concepts to a problem"],
          steps: [
            {
              order: 1,
              description: "Read the problem statement",
              hint: "Take your time to understand the requirements",
            },
            {
              order: 2,
              description: "Formulate your solution",
              hint: "Break down the problem into smaller parts",
            },
            {
              order: 3,
              description: "Submit your answer",
              hint: "Double-check your work before submitting",
            },
          ],
          successCriteria: "Correctly answer at least 70% of the questions",
          reward: {
            type: "token",
            name: "Knowledge Token",
            description: "Tokens earned for completing challenges",
            value: "5",
          },
          estimatedTimeMinutes: 15,
        };
      }

      try {
        // Generate a challenge using AI
        const { text: challengeDescription } = await generateText({
          model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY }),
          prompt: `
          Create a learning challenge for the zone "${zoneName}" in a metaverse learning world.
          The zone is about "${zone.subTopic}" and the challenge should be ${difficulty} difficulty.

          The challenge should:
          1. Test the user's knowledge of ${zone.subTopic}
          2. Be interactive and engaging
          3. Have clear success criteria
          4. Include a reward that helps with further learning

          Format the response as a JSON object with the following structure:
          {
            "name": "Challenge name",
            "description": "Detailed description",
            "difficulty": "${difficulty}",
            "objectives": ["Objective 1", "Objective 2", ...],
            "steps": [
              { "order": 1, "description": "Step description", "hint": "Optional hint" },
              ...
            ],
            "successCriteria": "What constitutes success",
            "reward": {
              "type": "token/credential/item",
              "name": "Reward name",
              "description": "Reward description",
              "value": "Numerical value if applicable"
            },
            "estimatedTimeMinutes": 15
          }
        `,
        });

        // Parse the challenge
        const challenge = JSON.parse(challengeDescription);

        // Add the challenge to the zone
        zone.challenges.push(challenge);

        return challenge;
      } catch (aiError) {
        console.error("Error with AI challenge generation:", aiError);

        // Create a mock challenge
        const mockChallenge = {
          name: `${zone.subTopic} ${difficulty} Challenge`,
          description: `A ${difficulty} level challenge to test your knowledge of ${zone.subTopic}.`,
          difficulty,
          objectives: ["Complete the quiz", "Apply concepts to a problem"],
          steps: [
            {
              order: 1,
              description: "Read the problem statement",
              hint: "Take your time to understand the requirements",
            },
            {
              order: 2,
              description: "Formulate your solution",
              hint: "Break down the problem into smaller parts",
            },
            {
              order: 3,
              description: "Submit your answer",
              hint: "Double-check your work before submitting",
            },
          ],
          successCriteria: "Correctly answer at least 70% of the questions",
          reward: {
            type: "token",
            name: "Knowledge Token",
            description: "Tokens earned for completing challenges",
            value: "5",
          },
          estimatedTimeMinutes: 15,
        };

        // Add the mock challenge to the zone
        zone.challenges.push(mockChallenge);

        return mockChallenge;
      }
    } catch (error) {
      console.error("Error generating challenge:", error);

      // Return a simple mock challenge
      return {
        name: `${difficulty} Challenge`,
        description: `A ${difficulty} level challenge to test your knowledge.`,
        difficulty,
        objectives: ["Complete the quiz"],
        steps: [
          {
            order: 1,
            description: "Answer the questions",
            hint: "Read carefully",
          },
        ],
        successCriteria: "Complete the challenge",
        reward: {
          type: "token",
          name: "Token",
          description: "Basic reward",
          value: "1",
        },
        estimatedTimeMinutes: 5,
      };
    }
  }

  /**
   * Generate a visual representation of a user's skill graph
   */
  public async generateSkillGraph(userId: string, skills: any[]): Promise<any> {
    try {
      if (!this.initialized) {
        throw new Error("Skillverse service not initialized");
      }

      // Generate a skill graph description using AI
      const skillsJson = JSON.stringify(skills);

      const { text: graphDescription } = await generateText({
        model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY }),
        prompt: `
          Create a visual representation of a skill graph for a user with the following skills:
          ${skillsJson}

          The skill graph should:
          1. Show relationships between different skills
          2. Indicate skill levels through visual elements
          3. Highlight potential learning paths
          4. Identify skill gaps or opportunities

          Format the response as a JSON object with the following structure:
          {
            "nodes": [
              {
                "id": "skill1",
                "name": "Skill name",
                "level": "Skill level",
                "size": "Relative size (1-10)",
                "color": "Suggested color",
                "description": "Short description"
              },
              ...
            ],
            "edges": [
              {
                "source": "skill1",
                "target": "skill2",
                "strength": "Connection strength (1-10)",
                "description": "Relationship description"
              },
              ...
            ],
            "clusters": [
              {
                "name": "Cluster name",
                "skills": ["skill1", "skill2", ...],
                "description": "What these skills have in common"
              },
              ...
            ],
            "recommendedFocus": ["skill1", "skill2", ...],
            "visualizationTips": ["Tip 1", "Tip 2", ...]
          }
        `,
      });

      // Parse the graph description
      const graph = JSON.parse(graphDescription);

      return graph;
    } catch (error) {
      console.error("Error generating skill graph:", error);
      throw error;
    }
  }

  /**
   * Generate a collaborative learning space
   */
  public async generateCollaborativeSpace(
    name: string,
    topic: string,
    maxParticipants: number
  ): Promise<any> {
    try {
      if (!this.initialized) {
        throw new Error("Skillverse service not initialized");
      }

      // Generate a collaborative space description using AI
      const { text: spaceDescription } = await generateText({
        model: google("gemini-2.0-flash-001", { apiKey: GEMINI_API_KEY }),
        prompt: `
          Create a collaborative learning space in the metaverse for the topic "${topic}".
          The space should accommodate up to ${maxParticipants} participants and be named "${name}".

          The collaborative space should include:
          1. Different zones for different collaboration activities
          2. Tools and features that facilitate learning together
          3. Roles that participants can take
          4. Activities that promote collaborative learning

          Format the response as a JSON object with the following structure:
          {
            "name": "${name}",
            "topic": "${topic}",
            "maxParticipants": ${maxParticipants},
            "description": "Overall space description",
            "zones": [
              {
                "name": "Zone name",
                "purpose": "What this zone is for",
                "features": ["Feature 1", "Feature 2", ...],
                "activities": ["Activity 1", "Activity 2", ...]
              },
              ...
            ],
            "roles": [
              {
                "name": "Role name",
                "description": "Role description",
                "responsibilities": ["Responsibility 1", "Responsibility 2", ...],
                "maxNumber": "Maximum number of this role"
              },
              ...
            ],
            "collaborativeActivities": [
              {
                "name": "Activity name",
                "description": "Activity description",
                "participants": "Min-max participants",
                "duration": "Estimated duration",
                "outcomes": ["Outcome 1", "Outcome 2", ...]
              },
              ...
            ],
            "communicationTools": ["Tool 1", "Tool 2", ...]
          }
        `,
      });

      // Parse the space description
      const space = JSON.parse(spaceDescription);

      return space;
    } catch (error) {
      console.error("Error generating collaborative space:", error);
      throw error;
    }
  }
}

export default SkillverseService;
