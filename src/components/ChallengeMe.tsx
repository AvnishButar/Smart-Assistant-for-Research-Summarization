import React, { useState, useEffect } from 'react';
import { Brain, CheckCircle, XCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { Question, Answer } from '../types';
import { MockAI } from '../utils/mockAI';

interface ChallengeMeProps {
  onBack: () => void;
}

export const ChallengeMe: React.FC<ChallengeMeProps> = ({ onBack }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = () => {
    const generatedQuestions = MockAI.generateQuestions();
    setQuestions(generatedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setCurrentAnswer('');
    setIsSubmitted(false);
    setIsComplete(false);
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    const evaluation = MockAI.evaluateAnswer(currentQuestion, currentAnswer);
    
    const newAnswers = [...userAnswers, evaluation];
    setUserAnswers(newAnswers);
    setIsSubmitted(true);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentAnswer('');
        setIsSubmitted(false);
      } else {
        setIsComplete(true);
      }
    }, 3000);
  };

  const handleRestart = () => {
    generateQuestions();
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentEvaluation = userAnswers[currentQuestionIndex];
  const correctAnswers = userAnswers.filter(a => a.isCorrect).length;

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Generating questions...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
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
              <Brain className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Challenge Complete!</h2>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Challenge Complete!
              </h3>
              <p className="text-lg text-gray-600">
                You scored {correctAnswers} out of {questions.length} correct answers.
              </p>
            </div>

            <div className="space-y-6">
              {questions.map((question, index) => {
                const answer = userAnswers[index];
                return (
                  <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        answer.isCorrect ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {answer.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Question {index + 1}: {question.text}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Your Answer: </span>
                            <span className="text-gray-600">{answer.userAnswer}</span>
                          </div>
                          {!answer.isCorrect && (
                            <div>
                              <span className="font-medium text-gray-700">Correct Answer: </span>
                              <span className="text-green-600">{question.correctAnswer}</span>
                            </div>
                          )}
                          <div className="pt-2 border-t border-gray-100">
                            <span className="font-medium text-gray-700">Explanation: </span>
                            <span className="text-gray-600">{answer.feedback}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleRestart}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Take Another Challenge</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Challenge Me</h2>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + (isSubmitted ? 1 : 0)) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full uppercase mb-3">
                {currentQuestion?.type}
              </span>
              <h3 className="text-lg font-medium text-gray-900">
                {currentQuestion?.text}
              </h3>
            </div>

            {!isSubmitted ? (
              <div className="space-y-4">
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  rows={4}
                />
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!currentAnswer.trim()}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Submit Answer
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Your Answer:</span> {currentAnswer}
                  </p>
                </div>

                {currentEvaluation && (
                  <div className={`p-4 rounded-lg ${
                    currentEvaluation.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {currentEvaluation.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        currentEvaluation.isCorrect ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {currentEvaluation.isCorrect ? 'Correct!' : 'Not quite right'}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      currentEvaluation.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {currentEvaluation.feedback}
                    </p>
                  </div>
                )}

                <div className="text-center">
                  <div className="animate-pulse text-sm text-gray-500">
                    {currentQuestionIndex < questions.length - 1 
                      ? 'Moving to next question...' 
                      : 'Preparing results...'
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};