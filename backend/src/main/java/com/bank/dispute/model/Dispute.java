package com.bank.dispute.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "disputes")
@Data
@NoArgsConstructor
public class Dispute {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String transactionId;
    
    @Column(nullable = false)
    private String cardholderId;
    
    @Column(nullable = false)
    private Double amount;
    
    @Column(nullable = false)
    private String currency;
    
    @Column(nullable = false)
    private LocalDateTime transactionDate;
    
    @Column(nullable = false)
    private LocalDateTime disputeDate;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String disputeReason;
    
    @Column(columnDefinition = "TEXT")
    private String additionalContext;
    
    @Column(nullable = false)
    private String merchantCategoryCode;
    
    @Column(nullable = false)
    private String merchantName;
    
    @Column
    private String merchantCountry;
    
    @Column
    private Double merchantAmount;
    
    @Column
    private String settlementCurrency;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DisputeStatus status = DisputeStatus.PENDING_CLASSIFICATION;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public enum DisputeStatus {
        PENDING_CLASSIFICATION,
        CLASSIFIED,
        PENDING_HUMAN_REVIEW,
        RESOLVED,
        ESCALATED
    }
}