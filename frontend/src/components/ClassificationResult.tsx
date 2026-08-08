import React from 'react';
import { ClassificationResponse, CONFIDENCE_COLORS, CATEGORY_COLORS } from '../types';

interface ClassificationResultProps {
  result: ClassificationResponse;
  onNewClassification: () => void;
}

export const ClassificationResult: React.FC<ClassificationResultProps> = ({ result, onNewClassification }) => {
  const confidencePercentage = Math.round(result.confidenceScore * 100);
  const confidenceColor = result.confidenceScore >= 0.9 ? 'text-green-600' : 
                          result.confidenceScore >= 0.75 ? 'text-yellow-600' : 'text-red-600';
  
  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-green-900">Classification Complete</h3>
            <p className="text-sm text-green-700">
              Dispute {result.transactionId} has been analyzed
            </p>
          </div>
        </div>
      </div>

      {/* Main Classification Card */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Classification */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Primary Category</h4>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${CATEGORY_COLORS[result.primaryCategory as keyof typeof CATEGORY_COLORS] || 'bg-gray-100 text-gray-800'}`}>
                {result.primaryCategory}
              </span>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Sub-Category</h4>
              <p className="text-base font-medium text-gray-900">{result.subCategory}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Recommended Action</h4>
              <p className="text-base text-gray-900">{result.recommendedAction}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">AI Reasoning</h4>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                {result.reasoning}
              </p>
            </div>
          </div>

          {/* Right Column - Confidence & Risk */}
          <div className="space-y-4">
            {/* Confidence Score */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Confidence Score</h4>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${result.confidenceScore >= 0.9 ? 'bg-green-500' : result.confidenceScore >= 0.75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${confidencePercentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`text-2xl font-bold ${confidenceColor}`}>
                  {confidencePercentage}%
                </span>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${CONFIDENCE_COLORS[result.confidenceLevel]}`}>
                  {result.confidenceLevel} CONFIDENCE
                </span>
              </div>
              {result.confidenceLevel === 'LOW' && (
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Low confidence - requires human review before action
                </p>
              )}
            </div>

            {/* Risk Assessment */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Risk Assessment</h4>
              <div className="space-y-2">
      {/* Resolution Path */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Resolution Path</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{result.resolutionPath}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNewClassification}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Classify Another Dispute
        </button>
        
        {result.confidenceLevel === 'LOW' && (
          <div className="text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-md">
            This dispute requires human review before proceeding
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-500 text-center">
        <p>Classified by AI Model v{result.modelVersion} • {new Date(result.classifiedAt).toLocaleString()}</p>
        {result.reviewedBy && (
          <p>Human reviewed by {result.reviewedBy} • {result.reviewedAt && new Date(result.reviewedAt).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
};
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">High Risk:</span>
                  <span className={`text-sm font-medium ${result.isHighRisk ? 'text-red-600' : 'text-green-600'}`}>
                    {result.isHighRisk ? 'Yes' : 'No'}
                  </span>
                </div>
                {result.isHighRisk && result.riskIndicators && (
                  <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {result.riskIndicators}
                  </div>
                )}
              </div>
            </div>

            {/* Regulatory Review */}
            {result.requiresRegulatoryReview && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">⚠️ Regulatory Review Required</h4>
                <p className="text-xs text-yellow-700">{result.regulatoryNotes}</p>
              </div>
            )}
          </div>
        </div>
      </div>