package com.bank.dispute.service;

import com.bank.dispute.dto.ClaudeClassificationRequest;
import com.bank.dispute.dto.ClaudeClassificationResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClaudeService {
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    @Value("${app.claude.api-key}")
    private String apiKey;
    
    @Value("${app.claude.model}")
    private String model;
    
    @Value("${app.claude.max-tokens}")
    private Integer maxTokens;
    
    private static final String ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
    
    public ClaudeClassificationResponse classifyDispute(ClaudeClassificationRequest request) {
        try {
            String prompt = buildClassificationPrompt(request);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey);
            headers.set("anthropic-version", "2023-06-01");
            headers.set("dangerously-allow-browser", "true");
            
            Map<String, Object> requestBody = Map.of(
                "model", model,
                "max_tokens", maxTokens,
                "messages", List.of(Map.of("role", "user", "content", prompt)),
                "system", "You are an expert payment dispute analyst for a major financial institution."
            );
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                ANTHROPIC_API_URL,
                HttpMethod.POST,
                entity,
                Map.class
            );
            
            return parseClaudeResponse(response.getBody());
            
        } catch (Exception e) {
            log.error("Error calling Claude API", e);
            throw new ClassificationException("Failed to classify dispute: " + e.getMessage(), e);
        }
    }
    
    private String buildClassificationPrompt(ClaudeClassificationRequest request) {
        String additionalContext = request.getAdditionalContext() != null ? request.getAdditionalContext() : "None provided";
        String merchantCountry = request.getMerchantCountry() != null ? request.getMerchantCountry() : "Not specified";
        BigDecimal merchantAmount = request.getMerchantAmount() != null ? request.getMerchantAmount() : request.getAmount();
        String settlementCurrency = request.getSettlementCurrency() != null ? request.getSettlementCurrency() : request.getCurrency();
        
        return String.format("""
            Classify this payment dispute and provide a structured analysis.
            
            **Dispute Details:**
            - Transaction ID: %s
            - Cardholder ID: %s
            - Amount: %s %s
            - Transaction Date: %s
            - Dispute Filed: %s
            - Dispute Reason: %s
            - Additional Context: %s
            - Merchant: %s (MCC: %s)
            - Merchant Country: %s
            
            **Classification Framework:**
            
            Primary Categories:
            1. FRAUD - Unauthorized transactions, identity theft, card-not-present fraud
            2. AUTHORIZATION - Missing authorization, incorrect authorization code, expired card
            3. PROCESSING_ERROR - Duplicate processing, incorrect amount, wrong currency, late presentment
            4. CONSUMER_DISPUTE - Goods not received, goods defective, canceled recurring, not as described
            5. INQUIRY - Information request, potential fraud
            
            Sub-categories by primary category:
            - FRAUD: Card-not-present, Card-present, Application fraud, Account takeover
            - AUTHORIZATION: No authorization, Expired card, Incorrect auth code
            - PROCESSING_ERROR: Duplicate processing, Incorrect amount, Late presentment, Currency mismatch
            - CONSUMER_DISPUTE: Not received, Not as described, Defective, Canceled recurring
            - INQUIRY: Potential fraud, Copy request, Transaction verification
            
            **Required JSON Response Format:**
            {
              "primaryCategory": "FRAUD | AUTHORIZATION | PROCESSING_ERROR | CONSUMER_DISPUTE | INQUIRY",
              "subCategory": "specific sub-category from list above",
              "reasoning": "2-3 sentences explaining the classification with specific evidence",
              "confidenceScore": 0.0-1.0,
              "recommendedAction": "specific action like 'Issue chargeback', 'Request additional documentation', 'Close dispute', etc.",
              "resolutionPath": "detailed steps to resolve this dispute",
              "isHighRisk": true/false,
              "riskIndicators": "comma-separated risk factors if high risk, otherwise empty",
              "requiresRegulatoryReview": true/false,
              "regulatoryNotes": "specific regulatory requirements if applicable"
            }
            
            Analyze the dispute reason carefully. Consider:
            - Time between transaction and dispute (regulatory time limits apply)
            - Amount relative to typical transactions
            - Merchant category and geographic location
            - Specific language in the dispute reason
            
            Respond ONLY with valid JSON, no additional text.
            """,
            request.getTransactionId(),
            request.getCardholderId(),
            request.getAmount(),
            request.getCurrency(),
            request.getTransactionDate(),
            request.getDisputeDate(),
            request.getDisputeReason(),
            additionalContext,
            request.getMerchantName(),
            request.getMerchantCategoryCode(),
            merchantCountry
            );
    }
    
    private ClaudeClassificationResponse parseClaudeResponse(Map<String, Object> responseBody) throws Exception {
        Map<String, Object> content = (Map<String, Object>) ((List<Object>) responseBody.get("content")).get(0);
        String responseText = (String) content.get("text");
        
        // Clean up response - extract JSON if wrapped in markdown code blocks
        if (responseText.contains("```json")) {
            responseText = responseText.substring(responseText.indexOf("```json") + 7);
            responseText = responseText.substring(0, responseText.indexOf("```")).trim();
        } else if (responseText.contains("```")) {
            responseText = responseText.substring(responseText.indexOf("```") + 3);
            responseText = responseText.substring(0, responseText.lastIndexOf("```")).trim();
        }
        
        return objectMapper.readValue(responseText, ClaudeClassificationResponse.class);
    }
}