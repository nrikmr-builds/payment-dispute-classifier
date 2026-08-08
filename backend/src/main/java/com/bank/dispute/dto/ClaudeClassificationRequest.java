package com.bank.dispute.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ClaudeClassificationRequest {
    private String transactionId;
    private String cardholderId;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime transactionDate;
    private LocalDateTime disputeDate;
    private String disputeReason;
    private String additionalContext;
    private String merchantCategoryCode;
    private String merchantName;
    private String merchantCountry;
    private BigDecimal merchantAmount;
    private String settlementCurrency;
}