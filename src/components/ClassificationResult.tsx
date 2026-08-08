"use client";

import React from "react";
import type { ClassificationResponse } from "@/lib/types";
import { CONFIDENCE_COLORS, CATEGORY_COLORS } from "@/lib/types";

interface ClassificationResultProps {
  result: ClassificationResponse;
  onNewClassification: () => void;
}

export const ClassificationResult = ({ result, onNewClassification }: ClassificationResultProps) => {
  const confidencePct = Math.round(result.confidenceScore * 100);
  const confidenceColor = result.confidenceScore >= 0.9 ? "text-green-600" : result.confidenceScore >= 0.75 ? "text-yellow-600" : "text-red-600";
  const barColor = result.confidenceScore >= 0.9 ? "bg-green-500" : result.confidenceScore >= 0.75 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Triage Banner */}
      <div className={`border rounded-lg p-4 ${result.confidenceLevel === "LOW" ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"}`}>
        <div className="flex items-start">
          <svg className={`w-6 h-6 mr-2 mt-0.5 ${result.confidenceLevel === "LOW" ? "text-yellow-600" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className={`text-lg font-semibold ${result.confidenceLevel === "LOW" ? "text-yellow-900" : "text-blue-900"}`}>
              Triage Analysis Complete — Human Review Required
            </h3>
            <p className={`text-sm mt-1 ${result.confidenceLevel === "LOW" ? "text-yellow-700" : "text-blue-700"}`}>
              This is an AI-generated recommendation for dispute <strong>{result.transactionId}</strong>. 
              {result.confidenceLevel === "LOW" 
                ? " Low confidence detected — manual review is mandatory before any action." 
                : " An analyst should validate this classification before proceeding."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Primary Category</h4>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${CATEGORY_COLORS[result.primaryCategory as keyof typeof CATEGORY_COLORS] || "bg-gray-100 text-gray-800"}`}>
                {result.primaryCategory}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Sub-Category</h4>
              <p className="text-base font-medium">{result.subCategory}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Suggested Action</h4>
              <p className="text-base">{result.recommendedAction}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">AI Reasoning</h4>
              <p className="text-sm bg-gray-50 p-3 rounded-md">{result.reasoning}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Confidence Score</h4>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={`h-3 rounded-full ${barColor}`} style={{ width: `${confidencePct}%` }}></div>
                  </div>
                </div>
                <span className={`text-2xl font-bold ${confidenceColor}`}>{confidencePct}%</span>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${CONFIDENCE_COLORS[result.confidenceLevel]}`}>
                  {result.confidenceLevel} CONFIDENCE
                </span>
              </div>
              {result.confidenceLevel === "LOW" && (
                <p className="text-xs text-red-600 mt-2">⚠️ Low confidence - requires human review before action</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Risk Assessment</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">High Risk:</span>
                  <span className={`text-sm font-medium ${result.isHighRisk ? "text-red-600" : "text-green-600"}`}>
                    {result.isHighRisk ? "Yes" : "No"}
                  </span>
                </div>
                {result.isHighRisk && result.riskIndicators && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{result.riskIndicators}</div>
                )}
              </div>
            </div>

            {result.requiresRegulatoryReview && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">⚠️ Regulatory Review Required</h4>
                <p className="text-xs text-yellow-700">{result.regulatoryNotes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-3">Suggested Resolution Path</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm whitespace-pre-wrap">{result.resolutionPath}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={onNewClassification} className="px-4 py-2 border rounded-md hover:bg-gray-50">
          Classify Another Dispute
        </button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        <p>Classified by AI Model {result.modelVersion} • {new Date(result.classifiedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};