package com.bank.dispute.service;

import com.bank.dispute.dto.ClaudeClassificationRequest;
import com.bank.dispute.dto.ClaudeClassificationResponse;
import com.bank.dispute.dto.HumanReviewRequest;
import com.bank.dispute.exception.ClassificationException;
import com.bank.dispute.exception.DisputeNotFoundException;
import com.bank.dispute.model.*;
import com.bank.dispute.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassificationService {
    
    private final DisputeRepository disputeRepository;
    private final ClassificationRepository classificationRepository;
    private final AuditLogRepository auditLogRepository;
    private final ClaudeService claudeService;
    
    @Value("${app.classification.confidence-threshold}")
    private Double confidenceThreshold;
    
    @Value("${app.classification.high-confidence}")
    private Double highConfidenceThreshold;
    
    @Value("${app.classification.model-version}")
    private String modelVersion;
    
    @Transactional
    public ClassificationResponse classifyDispute(ClaudeClassificationRequest request, String performedBy) {
        log.info("Classifying dispute for transaction: {}", request.getTransactionId());
        
        // Check if dispute already exists
        Dispute dispute = disputeRepository.findByTransactionId(request.getTransactionId())
            .orElseGet(() -> createDispute(request));
        
        // Check if already classified
        if (classificationRepository.findByDispute(dispute).isPresent()) {
            throw new ClassificationException("Dispute already classified: " + request.getTransactionId());
        }
        
        // Call Claude API for classification
        ClaudeClassificationResponse claudeResponse;
        try {
            claudeResponse = claudeService.classifyDispute(request);
        } catch (Exception e) {
            log.error("Classification failed for transaction: {}", request.getTransactionId(), e);
            dispute.setStatus(Dispute.DisputeStatus.ESCALATED);
            disputeRepository.save(dispute);
            throw new ClassificationException("Classification service unavailable. Dispute escalated for manual review.");
        }
        
        // Determine confidence level
        Classification.ConfidenceLevel confidenceLevel = determineConfidenceLevel(claudeResponse.getConfidenceScore());
        
        // Create classification entity
        Classification classification = new Classification();
        classification.setDispute(dispute);
        classification.setPrimaryCategory(claudeResponse.getPrimaryCategory());
        classification.setSubCategory(claudeResponse.getSubCategory());
        classification.setReasoning(claudeResponse.getReasoning());
        classification.setConfidenceScore(claudeResponse.getConfidenceScore());
        classification.setConfidenceLevel(confidenceLevel);
        classification.setRecommendedAction(claudeResponse.getRecommendedAction());
        classification.setResolutionPath(claudeResponse.getResolutionPath());
        classification.setHighRisk(claudeResponse.getIsHighRisk());
        classification.setRiskIndicators(claudeResponse.getRiskIndicators());
        classification.setRequiresRegulatoryReview(claudeResponse.getRequiresRegulatoryReview());
        classification.setRegulatoryNotes(claudeResponse.getRegulatoryNotes());
        classification.setModelVersion(modelVersion);
        
        // Determine dispute status based on confidence
        if (confidenceLevel == Classification.ConfidenceLevel.LOW) {
            dispute.setStatus(Dispute.DisputeStatus.PENDING_HUMAN_REVIEW);
            classification.setConfidenceLevel(Classification.ConfidenceLevel.LOW);
            log.warn("Low confidence classification ({}): {}", claudeResponse.getConfidenceScore(), request.getTransactionId());
        } else if (confidenceLevel == Classification.ConfidenceLevel.MEDIUM) {
            dispute.setStatus(Dispute.DisputeStatus.CLASSIFIED);
            classification.setConfidenceLevel(Classification.ConfidenceLevel.MEDIUM);
        } else {
            dispute.setStatus(Dispute.DisputeStatus.CLASSIFIED);
            classification.setConfidenceLevel(Classification.ConfidenceLevel.HIGH);
        }
        
        disputeRepository.save(dispute);
        Classification savedClassification = classificationRepository.save(classification);
        
        // Create audit log
        AuditLog auditLog = new AuditLog();
        auditLog.setDisputeId(dispute.getId());
        auditLog.setAction("CLASSIFICATION_COMPLETED");
        auditLog.setDetails(String.format("Classification: %s | Confidence: %.2f | Level: %s", 
            claudeResponse.getPrimaryCategory(), 
            claudeResponse.getConfidenceScore(),
            confidenceLevel));
        auditLog.setPerformedBy(performedBy);
        auditLogRepository.save(auditLog);
        
        log.info("Classification completed for transaction: {} - Category: {}, Confidence: {}", 
            request.getTransactionId(), claudeResponse.getPrimaryCategory(), claudeResponse.getConfidenceScore());
        
        return ClassificationResponse.fromEntity(savedClassification);
    
    @Transactional
    public ClassificationResponse submitHumanReview(UUID disputeId, HumanReviewRequest request, String performedBy) {
        Dispute dispute = disputeRepository.findById(disputeId)
            .orElseThrow(() -> new DisputeNotFoundException("Dispute not found: " + disputeId));
        
        Classification classification = classificationRepository.findByDisputeId(disputeId)
            .orElseThrow(() -> new DisputeNotFoundException("Classification not found for dispute: " + disputeId));
        
        // Update classification with human review
        classification.setHumanReviewNotes(request.getReviewNotes());
        classification.setReviewedBy(request.getReviewedBy());
        classification.setReviewedAt(LocalDateTime.now());
        
        // Apply corrections if provided
        if (request.getCorrectedCategory() != null) {
            classification.setPrimaryCategory(request.getCorrectedCategory());
        }
        if (request.getCorrectedSubCategory() != null) {
            classification.setSubCategory(request.getCorrectedSubCategory());
        }
        if (request.getCorrectedResolutionPath() != null) {
            classification.setResolutionPath(request.getCorrectedResolutionPath());
        }
        
        // Update dispute status
        dispute.setStatus(Dispute.DisputeStatus.RESOLVED);
        disputeRepository.save(dispute);
        
        Classification savedClassification = classificationRepository.save(classification);
        
        // Create audit log
        AuditLog auditLog = new AuditLog();
        auditLog.setDisputeId(disputeId);
        auditLog.setAction("HUMAN_REVIEW_COMPLETED");
        auditLog.setDetails(String.format("Reviewed by: %s | Notes: %s", 
            request.getReviewedBy(), 
            request.getReviewNotes()));
        auditLog.setPerformedBy(performedBy);
        auditLogRepository.save(auditLog);
        
        log.info("Human review completed for dispute: {} by {}", disputeId, request.getReviewedBy());
        
        return ClassificationResponse.fromEntity(savedClassification);
    }
    
    private Dispute createDispute(ClaudeClassificationRequest request) {
        Dispute dispute = new Dispute();
        dispute.setTransactionId(request.getTransactionId());
        dispute.setCardholderId(request.getCardholderId());
        dispute.setAmount(request.getAmount());
        dispute.setCurrency(request.getCurrency());
        dispute.setTransactionDate(request.getTransactionDate());
        dispute.setDisputeDate(request.getDisputeDate());
        dispute.setDisputeReason(request.getDisputeReason());
        dispute.setAdditionalContext(request.getAdditionalContext());
        dispute.setMerchantCategoryCode(request.getMerchantCategoryCode());
        dispute.setMerchantName(request.getMerchantName());
        dispute.setMerchantCountry(request.getMerchantCountry());
        dispute.setMerchantAmount(request.getMerchantAmount());
        dispute.setSettlementCurrency(request.getSettlementCurrency());
        return disputeRepository.save(dispute);
    }
    
    private Classification.ConfidenceLevel determineConfidenceLevel(Double confidenceScore) {
        if (confidenceScore >= highConfidenceThreshold) {
            return Classification.ConfidenceLevel.HIGH;
        } else if (confidenceScore >= confidenceThreshold) {
            return Classification.ConfidenceLevel.MEDIUM;
        } else {
            return Classification.ConfidenceLevel.LOW;
        }
    }
}
    }