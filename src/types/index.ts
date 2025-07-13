export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'txt';
  content: string;
  uploadedAt: Date;
}

export interface Summary {
  text: string;
  wordCount: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'comprehension' | 'logical' | 'inference';
  correctAnswer?: string;
  explanation?: string;
}

export interface Answer {
  questionId: string;
  userAnswer: string;
  feedback: string;
  isCorrect: boolean;
  documentReference: string;
}

export interface Conversation {
  id: string;
  question: string;
  answer: string;
  documentReference: string;
  timestamp: Date;
}

export interface AppState {
  document: Document | null;
  summary: Summary | null;
  conversations: Conversation[];
  currentMode: 'upload' | 'ask' | 'challenge';
  generatedQuestions: Question[];
  userAnswers: Answer[];
}