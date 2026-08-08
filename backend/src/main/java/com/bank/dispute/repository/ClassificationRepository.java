package com.bank.dispute.repository;

import com.bank.dispute.model.Classification;
import com.bank.dispute.model.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClassificationRepository extends JpaRepository<Classification, UUID> {
    Optional<Classification> findByDispute(Dispute dispute);
    Optional<Classification> findByDisputeId(UUID disputeId);
}