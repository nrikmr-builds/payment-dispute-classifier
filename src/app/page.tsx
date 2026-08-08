"use client";

import React, { useState } from "react";
import { DisputeForm } from "@/components/DisputeForm";
import { ClassificationResult } from "@/components/ClassificationResult";
import type { ClassificationResponse } from "@/lib/types";

type View = "form" | "result";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>("form");
  const [classificationResult, setClassificationResult] = useState<ClassificationResponse | null>(null);
  const [error, setError] = useState<string>("");

  const handleClassificationComplete = (result: ClassificationResponse) => {
    setClassificationResult(result);
    setCurrentView("result");
    setError("");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleNewClassification = () => {
    setCurrentView("form");
    setClassificationResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dispute Triage Assistant
                </h1>
                <p className="text-sm text-gray-600">
                  AI-powered routing and context for dispute analysts
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Demo Mode
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* View Router */}
        {currentView === "form" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Submit Dispute for Triage
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Enter the dispute details below. The AI will analyze and classify
                the dispute type, suggest a likely resolution path, and flag regulatory requirements.
                <strong> This is a recommendation — human review is always required.</strong>
              </p>
            </div>
            <DisputeForm
              onClassificationComplete={handleClassificationComplete}
              onError={handleError}
            />
          </div>
        )}

        {currentView === "result" && classificationResult && (
          <div>
            <ClassificationResult
              result={classificationResult}
              onNewClassification={handleNewClassification}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              Payment Dispute Classifier • Built for AI Product Management
              Portfolio
            </p>
            <p className="mt-1">
              Demonstrating confidence thresholds, human-in-the-loop design, and
              enterprise AI best practices
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}