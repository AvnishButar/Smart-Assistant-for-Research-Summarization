import React, { useState } from 'react';
import { Send, MessageSquare, Book, ArrowLeft } from 'lucide-react';
import { Conversation } from '../types';
import { MockAI } from '../utils/mockAI';

interface AskAnythingProps {
  conversations: Conversation[];
  onAddConversation: (conversation: Conversation) => void;
  onBack: () => void;
}

export const AskAnything: React.FC<AskAnythingProps> = ({ 
  conversations, 
  onAddConversation, 
  onBack 
}) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const conversation = MockAI.answerQuestion(question);
    onAddConversation(conversation);
    setQuestion('');
    setIsLoading(false);
  };

  const suggestedQuestions = [
    "What are the main benefits of AI in healthcare?",
    "What challenges does the study identify?",
    "How accurate is AI in diagnostic imaging?",
    "What future trends are discussed?"
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Ask Anything</h2>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2 ml-11">
          Ask any question about your document and get detailed answers with references.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Inquiry</h3>
            <p className="text-gray-600 mb-6">Ask questions about your document to get started.</p>
            
            <div className="max-w-md mx-auto space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-3">Try these questions:</p>
              {suggestedQuestions.map((suggested, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(suggested)}
                  className="w-full text-left p-3 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-800"
                >
                  {suggested}
                </button>
              ))}
            </div>
          </div>
        ) : (
          conversations.map((conv) => (
            <div key={conv.id} className="space-y-4">
              <div className="flex justify-end">
                <div className="max-w-2xl bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm">
                  <p className="text-sm">{conv.question}</p>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="max-w-2xl bg-gray-100 p-4 rounded-2xl rounded-tl-sm">
                  <p className="text-sm text-gray-800 mb-3">{conv.answer}</p>
                  <div className="flex items-start space-x-2 pt-2 border-t border-gray-200">
                    <Book className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-600 font-medium">{conv.documentReference}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your document..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};