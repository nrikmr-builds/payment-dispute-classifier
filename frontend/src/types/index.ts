export interface DisputeRequest {
  transactionId: string;
  cardholderId: string;
  amount: number;
  currency: string;
  transactionDate: string;
  disputeDate: string;
  disputeReason: string;
  additionalContext?: string;
  merchantCategoryCode: string;
  merchantName: string;
  merchantCountry?: string;
  merchantAmount?: number;
  settlementCurrency?: string;
}

export interface ClassificationResponse {
  id: string;
  disputeId: string;
  transactionId: string;
  cardholderId: string;
  amount: number;
  currency: string;
  primaryCategory: string;
  subCategory: string;
  reasoning: string;
  confidenceScore: number;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedAction: string;
  resolutionPath: string;
  isHighRisk: boolean;
  riskIndicators: string;
  requiresRegulatoryReview: boolean;
  regulatoryNotes: string;
  modelVersion: string;
  classifiedAt: string;
  humanReviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface HumanReviewRequest {
  reviewNotes: string;
  reviewedBy: string;
  correctedCategory?: string;
  correctedSubCategory?: string;
  correctedResolutionPath?: string;
}

export type DisputeStatus = 
  | 'PENDING_CLASSIFICATION'
  | 'CLASSIFIED'
  | 'PENDING_HUMAN_REVIEW'
  | 'RESOLVED'
  | 'ESCALATED';

export const CONFIDENCE_COLORS = {
  HIGH: 'bg-green-100 text-green-800 border-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  LOW: 'bg-red-100 text-red-800 border-red-200',
} as const;

export const CATEGORY_COLORS = {
  'FRAUD': 'bg-red-100 text-red-800',
  'AUTHORIZATION': 'bg-orange-100 text-orange-800',
  'PROCESSING_ERROR': 'bg-yellow-100 text-yellow-800',
  'CONSUMER_DISPUTE': 'bg-blue-100 text-blue-800',
  'INQUIRY': 'bg-gray-100 text-gray-800',
} as const;