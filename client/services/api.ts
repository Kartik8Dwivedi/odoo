// This is a mock API service for demonstration purposes
// In a real application, these would be actual API calls to your backend

// Types
export interface StudentData {
  id: string;
  name: string;
  email: string;
  learningCapability: number;
  subjectProgress: {
    [subject: string]: {
      completedLessons: number;
      totalLessons: number;
      assessmentScores: number[];
    };
  };
  strengths: string[];
  weaknesses: string[];
  learningStyle: string;
}

export interface AssessmentResult {
  score: number;
  learningCapability: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendedApproach: string;
}

// Mock student data
const mockStudentData: StudentData = {
  id: "user123",
  name: "Aaryan Tripathi",
  email: "aaryan@example.com",
  learningCapability: 0.85,
  subjectProgress: {
    physics: {
      completedLessons: 8,
      totalLessons: 12,
      assessmentScores: [85, 92, 78],
    },
    mathematics: {
      completedLessons: 15,
      totalLessons: 20,
      assessmentScores: [90, 88, 95],
    },
    chemistry: {
      completedLessons: 5,
      totalLessons: 15,
      assessmentScores: [75, 82],
    },
  },
  strengths: ["Visual learning", "Problem-solving", "Pattern recognition"],
  weaknesses: ["Verbal explanations", "Memorization of formulas"],
  learningStyle: "Visual-spatial",
};

// Mock assessment results based on student responses
const mockAssessmentResults: { [key: string]: AssessmentResult } = {
  excellent: {
    score: 92,
    learningCapability: 0.95,
    feedback:
      "Your explanation demonstrates an excellent understanding of the concepts. You've shown the ability to connect theoretical knowledge with practical applications and explain complex ideas clearly.",
    strengths: [
      "Conceptual understanding",
      "Clear explanations",
      "Application of knowledge",
    ],
    weaknesses: ["Minor details occasionally missed"],
    recommendedApproach:
      "You're ready for advanced topics. Consider exploring more complex applications and interdisciplinary connections.",
  },
  good: {
    score: 78,
    learningCapability: 0.75,
    feedback:
      "You have a good grasp of the fundamental concepts. Your explanations are mostly clear, though there are some areas where deeper understanding could be developed.",
    strengths: ["Basic concept understanding", "Logical thinking"],
    weaknesses: ["Connecting concepts", "Explaining complex relationships"],
    recommendedApproach:
      "Focus on connecting related concepts and practicing explanations of how different principles interact.",
  },
  needs_improvement: {
    score: 55,
    learningCapability: 0.45,
    feedback:
      "Your explanation shows familiarity with the topic, but there are significant gaps in understanding. Some key concepts were missed or misunderstood.",
    strengths: ["Enthusiasm for learning", "Recognition of basic terms"],
    weaknesses: ["Conceptual understanding", "Application of principles"],
    recommendedApproach:
      "Review the fundamental principles with simpler examples. Try visual learning approaches and break down complex topics into smaller parts.",
  },
};

// API functions
export async function fetchStudentData(
  studentId: string
): Promise<StudentData> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, this would fetch from your backend
  return mockStudentData;
}

export async function submitAssessment(
  studentId: string,
  subject: string,
  topic: string,
  responses: Record<string, string>,
  teachingQuality: number // 0-100 score based on how well the student taught the concept
): Promise<AssessmentResult> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Determine result based on teaching quality
  let resultKey = "needs_improvement";
  if (teachingQuality >= 85) {
    resultKey = "excellent";
  } else if (teachingQuality >= 65) {
    resultKey = "good";
  }

  // In a real app, this would be sent to your backend for processing
  return mockAssessmentResults[resultKey];
}

// Function to analyze student's teaching ability
export async function analyzeTeaching(
  transcript: string,
  subject: string,
  topic: string
): Promise<{
  teachingQuality: number;
  keyPointsCovered: string[];
  missingConcepts: string[];
  explanationClarity: number;
  confidenceLevel: number;
}> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // In a real app, this would use NLP to analyze the teaching transcript
  // For demo purposes, we'll return mock data based on transcript length and keywords

  const keywordsBySubject: Record<string, string[]> = {
    physics: [
      "force",
      "motion",
      "energy",
      "momentum",
      "acceleration",
      "velocity",
      "newton",
      "gravity",
    ],
    mathematics: [
      "equation",
      "formula",
      "theorem",
      "proof",
      "calculation",
      "algebra",
      "geometry",
    ],
    chemistry: [
      "reaction",
      "element",
      "compound",
      "molecule",
      "atom",
      "bond",
      "solution",
    ],
  };

  const relevantKeywords = keywordsBySubject[subject.toLowerCase()] || [];
  const keywordCount = relevantKeywords.filter((keyword) =>
    transcript.toLowerCase().includes(keyword)
  ).length;

  const keywordRatio =
    relevantKeywords.length > 0 ? keywordCount / relevantKeywords.length : 0;
  const lengthFactor = Math.min(1, transcript.length / 500); // Normalize for length up to 500 chars

  // Calculate teaching quality (0-100)
  const teachingQuality = Math.round(
    (keywordRatio * 0.6 + lengthFactor * 0.4) * 100
  );

  // Mock analysis results
  return {
    teachingQuality,
    keyPointsCovered: relevantKeywords.filter((keyword) =>
      transcript.toLowerCase().includes(keyword)
    ),
    missingConcepts: relevantKeywords.filter(
      (keyword) => !transcript.toLowerCase().includes(keyword)
    ),
    explanationClarity: Math.round(lengthFactor * 100),
    confidenceLevel: Math.round(keywordRatio * 100),
  };
}
