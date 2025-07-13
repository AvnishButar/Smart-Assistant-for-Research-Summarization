import React from 'react';
import { Book, Eye } from 'lucide-react';
import { Document } from '../types';

interface DocumentViewerProps {
  document: Document;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const truncatedContent = document.content.length > 2000 
    ? `${document.content.substring(0, 2000)}...` 
    : document.content;

  return (
    <div className="bg-white border border-gray-200 rounded-lg h-full flex flex-col">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <Eye className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Document Preview</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">{document.name}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-700 font-mono">
            {truncatedContent}
          </pre>
        </div>
        
        {document.content.length > 2000 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-700">
              <Book className="w-4 h-4" />
              <span className="text-sm font-medium">
                Document preview truncated. Full content is being analyzed by AI.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};