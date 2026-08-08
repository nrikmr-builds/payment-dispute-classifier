package com.bank.dispute.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private UUID disputeId;
    
    @Column(nullable = false)
    private String action;
    
    @Column(columnDefinition = "TEXT")
    private String details;
    
    @Column(nullable = false)
    private String performedBy;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column
    private String ipAddress;
    
    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}