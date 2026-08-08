package com.bank.dispute.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HumanReviewRequest {
    
    @NotBlank(message = "Review notes are required")
    private String reviewNotes;
    
    @NotBlank(message = "Reviewer ID is required")
    private String reviewedBy;
    
    private String correctedCategory;
    private String correctedSubCategory;
    private String correctedResolutionPath;
}