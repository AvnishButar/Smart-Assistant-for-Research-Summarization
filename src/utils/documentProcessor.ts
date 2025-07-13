import { Document } from '../types';
import { PDFProcessor } from './pdfProcessor';

export class DocumentProcessor {
  static async processFile(file: File): Promise<Document> {
    const content = await this.extractContent(file);
    
    return {
      id: Date.now().toString(),
      name: file.name,
      type: file.type === 'application/pdf' ? 'pdf' : 'txt',
      content,
      uploadedAt: new Date()
    };
  }

  private static async extractContent(file: File): Promise<string> {
    if (file.type === 'text/plain') {
      return await file.text();
    }
    
    if (file.type === 'application/pdf') {
      return await PDFProcessor.extractTextFromPDF(file);
    }
    
    throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
  }

  static generateSummary(content: string): { text: string; wordCount: number } {
    // Clean and prepare content
    const cleanContent = content.replace(/\s+/g, ' ').trim();
    const sentences = cleanContent.split(/[.!?]+/).filter(s => s.trim().length > 15);
    
    if (sentences.length === 0) {
      return {
        text: "The document appears to be empty or contains no readable content.",
        wordCount: 12
      };
    }

    // Target 140-150 words for summary - create actual summary, not just first lines
    // Helper function to count words accurately
    const countWords = (text: string): number => {
      return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    // Analyze document structure and extract key information
    const documentAnalysis = this.analyzeDocument(cleanContent, sentences);
    
    let summary = '';
    let currentWordCount = 0;
    const targetWords = 145;
    const usedSentences = new Set<number>();

    // Strategy: Select most important sentences based on content analysis
    const importantSentences = documentAnalysis.importantSentenceIndices;
    
    // Add sentences in order of importance
    for (const sentenceIndex of importantSentences) {
      if (!usedSentences.has(sentenceIndex)) {
        const sentence = sentences[sentenceIndex].trim();
        const sentenceWordCount = countWords(sentence);
        
        if (currentWordCount + sentenceWordCount <= targetWords) {
          if (summary) summary += ' ';
          summary += sentence + '.';
          currentWordCount += sentenceWordCount;
          usedSentences.add(sentenceIndex);
        }
      }
    }

    // If we need more content, add from remaining important sentences
    if (currentWordCount < targetWords * 0.8) {
      const remainingSentences = documentAnalysis.secondaryImportantIndices.filter(i => !usedSentences.has(i));
      
      for (const sentenceIndex of remainingSentences) {
        if (currentWordCount >= targetWords) break;
        
        const sentence = sentences[sentenceIndex].trim();
        const sentenceWordCount = countWords(sentence);
        
        if (currentWordCount + sentenceWordCount <= targetWords) {
          if (summary) summary += ' ';
          summary += sentence + '.';
          currentWordCount += sentenceWordCount;
          usedSentences.add(sentenceIndex);
        }
      }
    }

    // Final fallback: use first part of document if summary is still too short
    if (!summary.trim()) {
      const words = cleanContent.split(/\s+/).slice(0, targetWords);
      summary = words.join(' ') + (words.length === targetWords ? '...' : '');
      currentWordCount = words.length;
    }

    // Ensure accurate word count
    const finalWordCount = countWords(summary);

    return {
      text: summary.trim(),
      wordCount: finalWordCount
    };
  }

  private static analyzeDocument(content: string, sentences: string[]): {
    importantSentenceIndices: number[];
    secondaryImportantIndices: number[];
  } {
    // Analyze word frequency to identify important terms
    const words = content.toLowerCase().split(/\s+/);
    const wordFreq: { [key: string]: number } = {};
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
      }
    });

    // Get top important words (excluding common words)
    const commonWords = new Set(['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other', 'more', 'very', 'what', 'know', 'just', 'first', 'into', 'over', 'think', 'also', 'your', 'work', 'life', 'only', 'can', 'still', 'should', 'after', 'being', 'now', 'made', 'before', 'here', 'through', 'when', 'where', 'much', 'some', 'these', 'many', 'then', 'them', 'well', 'were']);
    
    const importantWords = Object.entries(wordFreq)
      .filter(([word, freq]) => freq > 1 && !commonWords.has(word) && word.length > 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word]) => word);

    // Score sentences based on important word content and position
    const sentenceScores = sentences.map((sentence, index) => {
      const lowerSentence = sentence.toLowerCase();
      let score = 0;
      
      // Score based on important words
      importantWords.forEach(word => {
        const wordCount = (lowerSentence.match(new RegExp(word, 'g')) || []).length;
        score += wordCount * 2;
      });
      
      // Boost score for sentences at important positions
      if (index === 0) score += 3; // First sentence
      if (index === sentences.length - 1) score += 2; // Last sentence
      if (index < sentences.length * 0.2) score += 1; // Early sentences
      if (index > sentences.length * 0.8) score += 1; // Late sentences
      
      // Boost score for longer, more substantial sentences
      const wordCount = sentence.split(/\s+/).length;
      if (wordCount > 15) score += 1;
      if (wordCount > 25) score += 1;
      
      // Penalize very short sentences
      if (wordCount < 8) score -= 1;
      
      return { index, score, sentence };
    });

    // Sort by score and select top sentences
    const sortedSentences = sentenceScores.sort((a, b) => b.score - a.score);
    
    const importantSentenceIndices = sortedSentences
      .slice(0, Math.min(8, sentences.length))
      .map(s => s.index)
      .sort((a, b) => a - b); // Sort by original order
    
    const secondaryImportantIndices = sortedSentences
      .slice(8, Math.min(15, sentences.length))
      .map(s => s.index)
      .sort((a, b) => a - b);

    return {
      importantSentenceIndices,
      secondaryImportantIndices
    };
  }
}