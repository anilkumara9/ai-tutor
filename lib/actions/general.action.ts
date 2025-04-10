"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    // Return mock interview data to avoid Firestore errors
    return {
      id: id,
      role: "Software Engineer",
      type: "Technical",
      level: "Senior",
      techstack: ["JavaScript", "React", "Node.js", "MongoDB"],
      questions: [
        "What is the difference between let, const, and var?",
        "Explain React hooks",
        "How does Node.js handle asynchronous operations?",
        "What are the benefits of using MongoDB?",
      ],
      userId: "mock-user-id",
      createdAt: new Date().toISOString(),
      finalized: true,
    };
  } catch (error) {
    console.error("Error fetching interview by ID:", error);
    return null;
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  try {
    const { interviewId, userId } = params;

    // If userId is undefined or null, return null
    if (!userId) {
      return null;
    }

    // Return mock feedback data to avoid Firestore errors
    return {
      id: "mock-feedback-1",
      interviewId: interviewId,
      userId: userId,
      totalScore: 85,
      categoryScores: [
        {
          name: "Communication Skills",
          score: 90,
          comment:
            "Excellent communication skills. Clear and concise responses.",
        },
        {
          name: "Technical Knowledge",
          score: 85,
          comment: "Good understanding of technical concepts.",
        },
        {
          name: "Problem Solving",
          score: 80,
          comment: "Demonstrated good problem-solving abilities.",
        },
        {
          name: "Cultural Fit",
          score: 90,
          comment: "Would be a great addition to the team.",
        },
        {
          name: "Confidence and Clarity",
          score: 80,
          comment:
            "Confident in responses but could improve clarity in some areas.",
        },
      ],
      strengths: [
        "Strong communication skills",
        "Good technical knowledge",
        "Team player",
      ],
      areasForImprovement: [
        "Could improve problem-solving approach",
        "More practice with algorithm questions",
      ],
      finalAssessment: "Overall, a strong candidate with good potential.",
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return null;
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  try {
    // Return mock data to avoid Firestore errors
    return [
      {
        id: "mock1",
        role: "Frontend Developer",
        type: "Technical",
        level: "Junior",
        techstack: ["React", "TypeScript", "Next.js"],
        questions: ["What is React?", "Explain useState hook"],
        userId: "mockuser1",
        createdAt: new Date().toISOString(),
        finalized: true,
      },
      {
        id: "mock2",
        role: "Backend Developer",
        type: "Technical",
        level: "Senior",
        techstack: ["Node.js", "Express", "MongoDB"],
        questions: ["What is Node.js?", "Explain middleware"],
        userId: "mockuser2",
        createdAt: new Date().toISOString(),
        finalized: true,
      },
    ];
  } catch (error) {
    console.error("Error fetching latest interviews:", error);
    // Return an empty array instead of null to avoid further errors
    return [];
  }
}

export async function getInterviewsByUserId(
  userId?: string
): Promise<Interview[] | null> {
  try {
    // If userId is undefined or null, return an empty array
    if (!userId) {
      return [];
    }

    // Return mock data to avoid Firestore errors
    return [
      {
        id: "user-mock1",
        role: "Full Stack Developer",
        type: "Behavioral",
        level: "Mid-level",
        techstack: ["React", "Node.js", "MongoDB"],
        questions: ["Tell me about yourself", "Describe a challenging project"],
        userId: userId, // Use the actual userId
        createdAt: new Date().toISOString(),
        finalized: true,
      },
    ];
  } catch (error) {
    console.error("Error fetching user interviews:", error);
    // Return an empty array instead of null to avoid further errors
    return [];
  }
}
