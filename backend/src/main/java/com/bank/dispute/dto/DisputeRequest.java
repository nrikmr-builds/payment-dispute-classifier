package com.bank.dispute.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DisputeRequest {
    
    @NotBlank(message = "Transaction ID is required")
    private String transactionId;
    
    @NotBlank(message = "Cardholder ID is required")
    private String cardholderId;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private Double amount;
    
    @NotBlank(message = "Currency is required")
    private String currency;
    
    @NotNull(message = "Transaction date is required")
    private LocalDateTime transactionDate;
    
    @NotNull(message = "Dispute date is required")
    private LocalDateTime disputeDate;
    
    @NotBlank(message = "Dispute reason is required")
    private String disputeReason;
    
    private String additionalContext;
    
    @NotBlank(message = "Merchant category code is required")
    private String merchantCategoryCode;
    
    @NotBlank(message = "Merchant name is required")
    private String merchantName;
    
    private String merchantCountry;
    
    private Double merchantAmount;
    
    private String settlementCurrency;
}