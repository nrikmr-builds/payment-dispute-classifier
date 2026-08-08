import { GoogleGenerativeAI } from "@google/generative-ai";
import type { DisputeRequest, ClassificationResponse } from "./types";

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not set. Add it to Vercel environment variables."
      );
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

function getModelName(): string {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}

export async function classifyDispute(
  request: DisputeRequest
): Promise<ClassificationResponse> {
  const ai = getClient();
  const modelName = getModelName();
  console.log(`[Dispute Classifier] Using model: ${modelName}`);
  const model = ai.getGenerativeModel({ model: modelName });

  const additionalContext =
    request.additionalContext || "None provided";
  const merchantCountry = request.merchantCountry || "Not specified";
  const merchantAmount = request.merchantAmount || request.amount;
  const settlementCurrency = request.settlementCurrency || request.currency;

  const prompt = `You are an expert payment dispute analyst for a major financial institution.
Classify this payment dispute and provide a structured analysis.

**Dispute Details:**
- Transaction ID: ${request.transactionId}
- Cardholder ID: ${request.cardholderId}
- Amount: ${request.amount} ${request.currency}
- Transaction Date: ${request.transactionDate}
- Dispute Filed: ${request.disputeDate}
- Dispute Reason: ${request.disputeReason}
- Additional Context: ${additionalContext}
- Merchant: ${request.merchantName} (MCC: ${request.merchantCategoryCode})
- Merchant Country: ${merchantCountry}

**Classification Framework:**

Primary Categories:
1. FRAUD - Unauthorized transactions, identity theft, card-not-present fraud
2. AUTHORIZATION - Missing authorization, incorrect authorization code, expired card
3. PROCESSING_ERROR - Duplicate processing, incorrect amount, wrong currency, late presentment
4. CONSUMER_DISPUTE - Goods not received, goods defective, canceled recurring, not as described
5. INQUIRY - Information request, potential fraud

**Confidence Score Guidelines:**

HIGH (0.90-1.0): Use ONLY when there is CLEAR, DEFINITIVE evidence:
- Explicit statement that card was not used or authorized ("I did not make this transaction")
- Clear fraud indicators (card lost/stolen with timestamp evidence)
- Obvious processing errors (duplicate charges with exact same amount/date)
- Unambiguous merchant failures (goods never received, product defective with evidence)

MEDIUM (0.75-0.89): Use when the case is likely valid but needs verification:
- Authorization issues where amounts differ but no clear fraud
- Consumer disputes with some ambiguity
- Processing errors where details need confirmation

LOW (0.0-0.74): Use when the dispute is AMBIGUOUS or INCOMPLETE:
- Cardholder says "I don't recognize this charge" without claiming fraud
- Requests for information without clear dispute
- Vague descriptions with insufficient details to determine category
- Cases where the transaction may be legitimate
- INQUIRY category should almost always be LOW confidence unless fraud is explicitly claimed

**Required JSON Response:**
{
  "primaryCategory": "FRAUD | AUTHORIZATION | PROCESSING_ERROR | CONSUMER_DISPUTE | INQUIRY",
  "subCategory": "specific sub-category",
  "reasoning": "2-3 sentences explaining the classification and confidence level",
  "confidenceScore": 0.0-1.0,
  "recommendedAction": "specific action to take",
  "resolutionPath": "detailed steps to resolve this dispute",
  "isHighRisk": true/false,
  "riskIndicators": "comma-separated risk factors if any",
  "requiresRegulatoryReview": true/false,
  "regulatoryNotes": "specific regulatory requirements if applicable"
}

Analyze the dispute reason carefully. Consider:
- Time between transaction and dispute (regulatory time limits apply)
- Amount relative to typical transactions
- Merchant category and geographic location
- Specific language in the dispute reason
- Whether the cardholder is claiming fraud or just seeking information

**CRITICAL**: If the cardholder is asking "what is this charge?" or says "I don't recognize it" without claiming unauthorized use, this is an INQUIRY with LOW confidence (typically 0.6-0.75).

Respond ONLY with valid JSON, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().trim();
    
    // Clean up response - extract JSON if wrapped in markdown code blocks
    let cleanedText = text;
    if (text.includes("```json")) {
      cleanedText = text.substring(text.indexOf("```json") + 7);
      cleanedText = cleanedText.substring(0, cleanedText.indexOf("```")).trim();
    } else if (text.includes("```")) {
      cleanedText = text.substring(text.indexOf("```") + 3);
      cleanedText = cleanedText.substring(0, cleanedText.lastIndexOf("```")).trim();
    }

    const parsed = JSON.parse(cleanedText);
    
    // Validate required fields
    if (!parsed.primaryCategory || typeof parsed.confidenceScore !== "number") {
      throw new Error("Invalid response format from Gemini");
    }

    // Generate unique IDs
    const disputeId = crypto.randomUUID();
    const classificationId = crypto.randomUUID();
    const now = new Date().toISOString();

    return {
      id: classificationId,
      disputeId,
      transactionId: request.transactionId,
      cardholderId: request.cardholderId,
      amount: request.amount,
      currency: request.currency,
      primaryCategory: parsed.primaryCategory,
      subCategory: parsed.subCategory || "Unknown",
      reasoning: parsed.reasoning || "No reasoning provided",
      confidenceScore: parsed.confidenceScore,
      confidenceLevel: parsed.confidenceScore >= 0.9 ? "HIGH" : parsed.confidenceScore >= 0.75 ? "MEDIUM" : "LOW",
      recommendedAction: parsed.recommendedAction || "Review manually",
      resolutionPath: parsed.resolutionPath || "Manual review required",
      isHighRisk: parsed.isHighRisk || false,
      riskIndicators: parsed.riskIndicators || "",
      requiresRegulatoryReview: parsed.requiresRegulatoryReview || false,
      regulatoryNotes: parsed.regulatoryNotes || "",
      modelVersion: modelName,
      classifiedAt: now,
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(
      `Classification failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}