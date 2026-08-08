package com.bank.dispute.controller;

import com.bank.dispute.dto.ClassificationResponse;
import com.bank.dispute.dto.ClaudeClassificationRequest;
import com.bank.dispute.dto.HumanReviewRequest;
import com.bank.dispute.model.AuditLog;
import com.bank.dispute.service.ClassificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/disputes")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class DisputeController {
    
    private final ClassificationService classificationService;
    
    /**
     * Submit a new dispute for AI classification
     */
    @PostMapping("/classify")
    public ResponseEntity<ClassificationResponse> classifyDispute(
            @Valid @RequestBody ClaudeClassificationRequest request,
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "system") String userId) {
        log.info("Received classification request for transaction: {}", request.getTransactionId());
        ClassificationResponse response = classificationService.classifyDispute(request, userId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get classification result for a dispute
     */
    @GetMapping("/{disputeId}/classification")
    public ResponseEntity<ClassificationResponse> getClassification(@PathVariable UUID disputeId) {
        // This would need a service method to get classification by dispute ID
        // For now, returning placeholder
        return ResponseEntity.ok(null);
    }
    
    /**
     * Submit human review for a low-confidence classification
     */
    @PostMapping("/{disputeId}/review")
    public ResponseEntity<ClassificationResponse> submitHumanReview(
            @PathVariable UUID disputeId,
            @Valid @RequestBody HumanReviewRequest request,
            @RequestHeader(value = "X-User-Id", required = false, defaultValue = "system") String userId) {
        ClassificationResponse response = classificationService.submitHumanReview(disputeId, request, userId);
        return ResponseEntity.ok(response);
    }
}