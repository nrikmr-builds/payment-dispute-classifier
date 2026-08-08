package com.bank.dispute.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "classifications")
@Data
@NoArgsConstructor
public class Classification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @OneToOne
    @JoinColumn(name = "dispute_id", nullable = false, unique = true)
    private Dispute dispute;
    
    // Chargeback Reason Codes (standardized)
    @Column(nullable = false)
    private String primaryCategory;
    
    @Column(nullable = false)
    private String subCategory;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String reasoning;
    
    @Column(nullable = false)
    private Double confidenceScore;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ConfidenceLevel confidenceLevel;
    
    @Column(nullable = false)
    private String recommendedAction;
    
    @Column(nullable = false)
    private String resolutionPath;
    
    // Risk flags
    @Column(nullable = false)
    private Boolean isHighRisk;
    
    @Column
    private String riskIndicators;
    
    // Regulatory flags
    @Column(nullable = false)
    private Boolean requiresRegulatoryReview;
    
    @Column
    private String regulatoryNotes;
    
    // Metadata
    @Column(nullable = false)
    private String modelVersion;
    
    @Column(nullable = false)
    private LocalDateTime classifiedAt;
    
    @Column(columnDefinition = "TEXT")
    private String humanReviewNotes;
    
    @Column
    private String reviewedBy;
    
    @Column
    private LocalDateTime reviewedAt;
    
    @PrePersist
    protected void onCreate() {
        classifiedAt = LocalDateTime.now();
    }
    
    public enum ConfidenceLevel {
        HIGH,      // >= 0.90
        MEDIUM,    // 0.75 - 0.89
        LOW        // < 0.75
    }
}