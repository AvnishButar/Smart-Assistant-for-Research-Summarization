import React, { useState } from 'react';
import { DocumentUpload } from './components/DocumentUpload';
import { MainInterface } from './components/MainInterface';
import { DocumentProcessor } from './utils/documentProcessor';
import { Document, Summary } from './types';

function App() {
  const [document, setDocument] = useState<Document | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);

  const handleDocumentUpload = (uploadedDocument: Document) => {
    setDocument(uploadedDocument);
    const generatedSummary = DocumentProcessor.generateSummary(uploadedDocument.content);
    setSummary(generatedSummary);
  };

  const handleNewDocument = () => {
    setDocument(null);
    setSummary(null);
  };

  if (!document || !summary) {
    return <DocumentUpload onDocumentUpload={handleDocumentUpload} />;
  }

  return <MainInterface document={document} summary={summary} />;
}

export default App;