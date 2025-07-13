import { Question, Answer, Conversation } from '../types';

export class MockAI {
  private static documentContent: string = '';

  static setDocumentContent(content: string): void {
    this.documentContent = content;
  }

  static generateQuestions(): Question[] {
    if (!this.documentContent) {
      return [];
    }

    // Extract key concepts and generate questions based on actual content
    const sentences = this.documentContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const words = this.documentContent.toLowerCase().split(/\s+/);
    
    // Find important terms (words that appear multiple times)
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });

    const importantWords = Object.entries(wordFreq)
      .filter(([word, freq]) => freq > 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);

    const questions: Question[] = [];

    // Generate comprehension questions
    if (sentences.length > 0) {
      questions.push({
        id: '1',
        text: `What is the main topic or focus of this document?`,
        type: 'comprehension',
        correctAnswer: this.extractMainTopic(),
        explanation: 'This can be determined from the overall content and key themes discussed throughout the document.'
      });
    }

    if (sentences.length > 2) {
      questions.push({
        id: '2',
        text: `Based on the document, what are the key points or findings mentioned?`,
        type: 'comprehension',
        correctAnswer: this.extractKeyPoints(),
        explanation: 'These points are derived from the main arguments and conclusions presented in the document.'
      });
    }

    if (importantWords.length > 0) {
      questions.push({
        id: '3',
        text: `What role do the following concepts play in the document: ${importantWords.slice(0, 3).join(', ')}?`,
        type: 'inference',
        correctAnswer: this.analyzeConceptRoles(importantWords.slice(0, 3)),
        explanation: 'This requires understanding how these key concepts relate to the overall message of the document.'
      });
    }

    return questions.slice(0, 3);
  }

  private static extractMainTopic(): string {
    if (!this.documentContent) return 'Unable to determine main topic';
    
    // Simple approach: look for repeated themes in first few sentences
    const firstParagraph = this.documentContent.split('\n')[0] || this.documentContent.substring(0, 200);
    return `The document appears to focus on topics related to the content discussed in the opening section: "${firstParagraph.substring(0, 100)}..."`;
  }

  private static extractKeyPoints(): string {
    if (!this.documentContent) return 'No key points identified';
    
    const sentences = this.documentContent.split(/[.!?]+/).filter(s => s.trim().length > 30);
    const keyPoints = sentences.slice(0, 3).map((s, i) => `${i + 1}. ${s.trim()}`).join('; ');
    return keyPoints || 'Key points can be found throughout the document content';
  }

  private static analyzeConceptRoles(concepts: string[]): string {
    return `The concepts ${concepts.join(', ')} appear to be central themes that are discussed throughout the document and contribute to its main arguments and conclusions.`;
  }

  static evaluateAnswer(question: Question, userAnswer: string): Answer {
    const similarity = this.calculateSimilarity(userAnswer.toLowerCase(), question.correctAnswer?.toLowerCase() || '');
    const isCorrect = similarity > 0.3 || userAnswer.length > 20; // More lenient for open-ended questions

    let feedback = '';
    if (isCorrect) {
      feedback = `Good answer! Your response shows understanding of the document content. ${question.explanation}`;
    } else {
      feedback = `Your answer could be more detailed. Consider: ${question.correctAnswer}. ${question.explanation}`;
    }

    return {
      questionId: question.id,
      userAnswer,
      feedback,
      isCorrect,
      documentReference: question.explanation || 'Based on document analysis'
    };
  }

  static answerQuestion(userQuestion: string): Conversation {
    if (!this.documentContent) {
      return {
        id: Date.now().toString(),
        question: userQuestion,
        answer: 'No document content available to answer questions.',
        documentReference: 'Document not loaded',
        timestamp: new Date()
      };
    }

    // Search for relevant content in the actual document
    const lowerQuestion = userQuestion.toLowerCase();
    const lowerContent = this.documentContent.toLowerCase();
    
    // Find relevant sentences
    const sentences = this.documentContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const relevantSentences = sentences.filter(sentence => {
      const lowerSentence = sentence.toLowerCase();
      return lowerQuestion.split(' ').some(word => 
        word.length > 3 && lowerSentence.includes(word)
      );
    });

    let answer = '';
    let reference = '';

    if (relevantSentences.length > 0) {
      // Use the most relevant sentences to form an answer
      answer = `Based on the document content: ${relevantSentences.slice(0, 2).join('. ')}.`;
      reference = `This information is found in the document content where it discusses these topics.`;
    } else {
      // Provide a general response based on document content
      const firstSentences = sentences.slice(0, 2);
      answer = `While I couldn't find specific information about "${userQuestion}" in the document, the document discusses: ${firstSentences.join('. ')}.`;
      reference = 'Based on general document content analysis.';
    }

    return {
      id: Date.now().toString(),
      question: userQuestion,
      answer,
      documentReference: reference,
      timestamp: new Date()
    };
  }

  private static calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(' ').filter(w => w.length > 2);
    const words2 = str2.split(' ').filter(w => w.length > 2);
    const intersection = words1.filter(word => words2.includes(word));
    return intersection.length / Math.max(words1.length, words2.length, 1);
  }
}