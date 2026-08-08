package com.bank.dispute.dto;

import com.bank.dispute.model.Classification;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ClassificationResponse {
    private UUID id;
    private UUID disputeId;
    private String transactionId;
    private String cardholderId;
    private Double amount;
    private String currency;
    private String primaryCategory;
    private String subCategory;
    private String reasoning;
    private Double confidenceScore;
    private Classification.ConfidenceLevel confidenceLevel;
    private String recommendedAction;
    private String resolutionPath;
    private Boolean isHighRisk;
    private String riskIndicators;
    private Boolean requiresRegulatoryReview;
    private String regulatoryNotes;
    private String modelVersion;
    private LocalDateTime classifiedAt;
    private String humanReviewNotes;
    private String reviewedBy;
    private LocalDateTime reviewedAt;
    
    public static ClassificationResponse fromEntity(Classification classification) {
        ClassificationResponse response = new ClassificationResponse();
        response.setId(classification.getId());
        response.setDisputeId(classification.getDispute().getId());
        response.setTransactionId(classification.getDispute().getTransactionId());
        response.setCardholderId(classification.getDispute().getCardholderId());
        response.setAmount(classification.getDispute().getAmount());
        response.setCurrency(classification.getDispute().getCurrency());
        response.setPrimaryCategory(classification.getPrimaryCategory());
        response.setSubCategory(classification.getSubCategory());
        response.setReasoning(classification.getReasoning());
        response.setConfidenceScore(classification.getConfidenceScore());
        response.setConfidenceLevel(classification.getConfidenceLevel());
        response.setRecommendedAction(classification.getRecommendedAction());
        response.setResolutionPath(classification.getResolutionPath());
        response.setHighRisk(classification.getIsHighRisk());
        response.setRiskIndicators(classification.getRiskIndicators());
        response.setRequiresRegulatoryReview(classification.getRequiresRegulatoryReview());
        response.setRegulatoryNotes(classification.getRegulatoryNotes());
        response.setModelVersion(classification.getModelVersion());
        response.setClassifiedAt(classification.getClassifiedAt());
        response.setHumanReviewNotes(classification.getHumanReviewNotes());
        response.setReviewedBy(classification.getReviewedBy());
        response.setReviewedAt(classification.getReviewedAt());
        return response;
    }
}