import React from 'react';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { Summary, Document } from '../types';

interface DocumentSummaryProps {
  document: Document;
  summary: Summary;
}

export const DocumentSummary: React.FC<DocumentSummaryProps> = ({ document, summary }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{document.name}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Uploaded {document.uploadedAt.toLocaleDateString()}</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Processed</span>
              </span>
            </div>
          </div>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full uppercase">
          {document.type}
        </span>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Document Summary
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {summary.wordCount} words
          </span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {summary.text}
        </p>
      </div>
    </div>
  );
};