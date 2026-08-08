package com.bank.dispute.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ClaudeClassificationResponse {
    private String primaryCategory;
    private String subCategory;
    private String reasoning;
    private BigDecimal confidenceScore;
    private String recommendedAction;
    private String resolutionPath;
    private Boolean isHighRisk;
    private String riskIndicators;
    private Boolean requiresRegulatoryReview;
    private String regulatoryNotes;
}