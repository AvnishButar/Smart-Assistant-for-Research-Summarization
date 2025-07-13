import React, { useCallback, useState } from 'react';
import { Upload, FileText, File, CheckCircle } from 'lucide-react';
import { DocumentProcessor } from '../utils/documentProcessor';
import { Document } from '../types';

interface DocumentUploadProps {
  onDocumentUpload: (document: Document) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'text/plain' && file.type !== 'application/pdf') {
      alert('Please upload a PDF or TXT file.');
      return;
    }

    setIsProcessing(true);
    setUploadedFile(file.name);

    try {
      const document = await DocumentProcessor.processFile(file);
      onDocumentUpload(document);
    } catch (error) {
      console.error('Error processing file:', error);
      alert(`Error processing file: ${error instanceof Error ? error.message : 'Please try again.'}`);
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Research Assistant
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Upload your research document and let AI help you understand, analyze, and explore its content through intelligent questioning and summarization.
          </p>
        </div>

        <div
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ease-in-out
            ${isDragging 
              ? 'border-blue-500 bg-blue-50 scale-105' 
              : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
            }
            ${isProcessing ? 'pointer-events-none opacity-75' : 'cursor-pointer'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />

          <div className="flex flex-col items-center space-y-4">
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                <div className="text-lg font-medium text-gray-900">
                  Processing "{uploadedFile}"...
                </div>
                <div className="text-sm text-gray-500">
                  Analyzing document content and generating summary
                </div>
              </>
            ) : uploadedFile ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-500" />
                <div className="text-lg font-medium text-gray-900">
                  Document processed successfully!
                </div>
                <div className="text-sm text-gray-500">
                  Ready to start your research session
                </div>
              </>
            ) : (
              <>
                <Upload className="w-16 h-16 text-gray-400" />
                <div className="text-lg font-medium text-gray-900">
                  Drop your document here or click to browse
                </div>
                <div className="text-sm text-gray-500">
                  Supports PDF and TXT files up to 10MB
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-center space-x-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <File className="w-4 h-4" />
              <span>PDF Documents</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FileText className="w-4 h-4" />
              <span>Text Files</span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">What you can do:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-blue-600 text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Ask Anything</h4>
                <p className="text-sm text-gray-600">Get answers to specific questions about your document</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-green-600 text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Challenge Me</h4>
                <p className="text-sm text-gray-600">Test your understanding with AI-generated questions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};