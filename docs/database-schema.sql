-- Payment Dispute Classifier Database Schema
-- PostgreSQL

-- Disputes table
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    cardholder_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    dispute_date TIMESTAMP NOT NULL,
    dispute_reason TEXT NOT NULL,
    additional_context TEXT,
    merchant_category_code VARCHAR(10) NOT NULL,
    merchant_name VARCHAR(255) NOT NULL,
    merchant_country VARCHAR(2),
    merchant_amount DECIMAL(10, 2),
    settlement_currency VARCHAR(3),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_CLASSIFICATION',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Classifications table
CREATE TABLE IF NOT EXISTS classifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_id UUID NOT NULL UNIQUE REFERENCES disputes(id),
    primary_category VARCHAR(50) NOT NULL,
    sub_category VARCHAR(100) NOT NULL,
    reasoning TEXT NOT NULL,
    confidence_score DECIMAL(3, 2) NOT NULL,
    confidence_level VARCHAR(20) NOT NULL,
    recommended_action TEXT NOT NULL,
    resolution_path TEXT NOT NULL,
    is_high_risk BOOLEAN NOT NULL DEFAULT FALSE,
    risk_indicators TEXT,
    requires_regulatory_review BOOLEAN NOT NULL DEFAULT FALSE,
    regulatory_notes TEXT,
    model_version VARCHAR(50) NOT NULL,
    classified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    human_review_notes TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_id UUID NOT NULL REFERENCES disputes(id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    performed_by VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- Indexes for performance
CREATE INDEX idx_disputes_transaction_id ON disputes(transaction_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_created_at ON disputes(created_at);
CREATE INDEX idx_classifications_dispute_id ON classifications(dispute_id);
CREATE INDEX idx_classifications_confidence_level ON classifications(confidence_level);
CREATE INDEX idx_audit_logs_dispute_id ON audit_logs(dispute_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Seed data for testing
INSERT INTO disputes (transaction_id, cardholder_id, amount, currency, transaction_date, dispute_date, dispute_reason, merchant_category_code, merchant_name, merchant_country, status)
VALUES 
('TXN-001-TEST', 'CARD-001', 149.99, 'USD', '2024-01-15 10:30:00', '2024-01-20 14:22:00', 
 'I did not authorize this transaction. My card was in my possession at all times.', '5999', 'Online Electronics Store', 'US', 'PENDING_CLASSIFICATION'),
('TXN-002-TEST', 'CARD-002', 89.50, 'USD', '2024-01-10 16:45:00', '2024-01-18 09:15:00',
 'Item never arrived. Seller has not responded to my messages.', '5999', 'Fashion Marketplace', 'CN', 'PENDING_CLASSIFICATION'),
('TXN-003-TEST', 'CARD-003', 1250.00, 'USD', '2024-01-05 11:20:00', '2024-01-25 16:30:00',
 'Charged twice for the same purchase. Only one item was ordered.', '5912', 'Home Improvement Store', 'US', 'PENDING_CLASSIFICATION')
ON CONFLICT (transaction_id) DO NOTHING;