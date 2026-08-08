package com.bank.dispute.repository;

import com.bank.dispute.model.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, UUID> {
    Optional<Dispute> findByTransactionId(String transactionId);
    boolean existsByTransactionId(String transactionId);
}