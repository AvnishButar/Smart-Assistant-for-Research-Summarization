import React, { useState } from 'react';
import { MessageSquare, Brain, FileText, ArrowRight } from 'lucide-react';
import { Document, Summary, Conversation } from '../types';
import { DocumentSummary } from './DocumentSummary';
import { DocumentViewer } from './DocumentViewer';
import { AskAnything } from './AskAnything';
import { ChallengeMe } from './ChallengeMe';
import { MockAI } from '../utils/mockAI';

interface MainInterfaceProps {
  document: Document;
  summary: Summary;
}

export const MainInterface: React.FC<MainInterfaceProps> = ({ document, summary }) => {
  const [currentMode, setCurrentMode] = useState<'main' | 'ask' | 'challenge'>('main');
  const [conversations, setConversations] = useState<Conversation[]>([]);

  React.useEffect(() => {
    MockAI.setDocumentContent(document.content);
  }, [document]);

  const handleAddConversation = (conversation: Conversation) => {
    setConversations(prev => [...prev, conversation]);
  };

  if (currentMode === 'ask') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-1/3 p-4">
          <DocumentViewer document={document} />
        </div>
        <div className="flex-1 bg-white">
          <AskAnything
            conversations={conversations}
            onAddConversation={handleAddConversation}
            onBack={() => setCurrentMode('main')}
          />
        </div>
      </div>
    );
  }

  if (currentMode === 'challenge') {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-1/3 p-4">
          <DocumentViewer document={document} />
        </div>
        <div className="flex-1 bg-white">
          <ChallengeMe onBack={() => setCurrentMode('main')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Smart Research Assistant
          </h1>
          <p className="text-gray-600">
            Your document has been processed. Choose how you'd like to interact with it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DocumentSummary document={document} summary={summary} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Ask Anything</h3>
                    <p className="text-sm text-gray-600">Free-form Q&A</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Ask any question about your document. Get detailed answers with specific references to support each response.
                </p>
                <button
                  onClick={() => setCurrentMode('ask')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>Start Asking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Challenge Me</h3>
                    <p className="text-sm text-gray-600">Test your knowledge</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Take on AI-generated questions designed to test your comprehension and critical thinking about the document.
                </p>
                <button
                  onClick={() => setCurrentMode('challenge')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <span>Start Challenge</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {conversations.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversations</h3>
                <div className="space-y-3">
                  {conversations.slice(-3).map((conv) => (
                    <div key={conv.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-1">{conv.question}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{conv.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <DocumentViewer document={document} />
          </div>
        </div>
      </div>
    </div>
  );
};