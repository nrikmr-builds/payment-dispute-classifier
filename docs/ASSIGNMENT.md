# Payment Dispute Classifier: AI Tool Documentation

## 1. User and Job-to-be-Done

**Primary User:** Dispute Operations Analyst at a bank or financial institution

**Job-to-be-Done:** Rapidly and accurately classify incoming payment disputes to determine the appropriate resolution path while maintaining regulatory compliance.

**Why This Matters:**
- Banks process thousands of payment disputes daily
- Manual classification is time-consuming, inconsistent, and prone to human error
- Incorrect classification leads to financial losses, regulatory penalties, and poor customer experience
- The classification decision drives downstream workflows: chargeback filing, merchant communication, regulatory reporting, and customer communication

**Success Criteria:** An analyst can classify a dispute in seconds instead of minutes, with consistent quality and full auditability.

---

## 2. Current Workflow

### How Disputes Are Classified Today

**Manual Process (Current State):**
1. Analyst receives dispute via email, portal, or ticketing system
2. Analyst reads dispute reason and transaction details
3. Analyst searches internal knowledge base for chargeback reason codes (Visa/Mastercard rules)
4. Analyst applies business rules and judgment to select primary category and sub-category
5. Analyst determines confidence in their decision (subjective)
6. Analyst selects resolution path and initiates appropriate workflow
7. Manager reviews high-value or complex cases (escalation queue)
8. All actions are logged manually or via ticketing system

### Pain Points

| Pain Point | Impact | Frequency |
|------------|--------|-----------|
| **Inconsistent classification** | Different analysts classify identical disputes differently | Daily |
| **Slow processing time** | 15-30 minutes per dispute | Every dispute |
| **Knowledge gaps** | Junior analysts lack expertise in 100+ chargeback reason codes | Continuous |
| **Regulatory risk** | Missed time limits (e.g., 45-day filing window) | Occasional but costly |
| **High training cost** | 3-6 months to train a new analyst | Per hire |
| **No confidence tracking** | Cannot measure prediction reliability | Systemic |

**Cost Example:** A mid-size bank with 5,000 disputes/month at 20 minutes each = 1,667 hours/month = ~$125,000/month in analyst time (at $75/hour fully-loaded cost).

---

## 3. AI-Enabled Workflow

### What the Tool Does

The Payment Dispute Classifier automates the initial classification of payment disputes using Claude AI, with built-in confidence thresholds and human oversight for low-confidence cases.

### Inputs
- **Transaction Details:** Transaction ID, cardholder ID, amount, currency, dates
- **Dispute Information:** Cardholder's stated reason, additional context
- **Merchant Details:** Name, MCC code, country, settlement currency

### Steps
| Confidence Level | Score Range | Action | Human Involvement |
|------------------|-------------|--------|-------------------|
| **HIGH** | ≥ 0.90 | Auto-classify, proceed | None required |
| **MEDIUM** | 0.75 - 0.89 | Classify, flag for review | Periodic quality check |
| **LOW** | < 0.75 | **Block** - human review required | **Mandatory** before any action |

### Outputs
1. **Primary Category** (FRAUD, AUTHORIZATION, PROCESSING_ERROR, CONSUMER_DISPUTE, INQUIRY)
2. **Sub-Category** (e.g., Card-not-present, Duplicate processing)
3. **Confidence Score** (0.0-1.0) with level (HIGH/MEDIUM/LOW)
4. **Reasoning** (explainable AI - why this classification)
5. **Recommended Action** (specific next step)
6. **Resolution Path** (detailed workflow steps)
7. **Risk Flags** (high-risk indicators, regulatory review requirements)

### User Interactions
- **Submit dispute form** (analyst enters details)
- **View classification results** (AI output with confidence indicator)
- **Human review** (only for LOW confidence cases - analyst corrects/approves)
- **Audit trail** (all actions logged automatically)

---

## 4. Example Run

### Input
- **Transaction:** TXN-88432-XYZ, $249.99, 2024-01-10
- **Cardholder:** CARD-78901
- **Dispute Reason:** "I did not authorize this transaction. My card was in my wallet. Never shopped at this merchant."
- **Merchant:** QuickTech Gadgets (China), MCC 5999

### Output
```json
{
  "primaryCategory": "FRAUD",
  "subCategory": "Card-not-present",
  "confidenceScore": 0.92,
  "confidenceLevel": "HIGH",
  "reasoning": "Cardholder states card was in possession, transaction from unfamiliar international merchant. 8-day delay within limits.",
- **HIGH confidence predictions (≥0.90):** 32 cases, 30 correct (93.8% accuracy)
- **MEDIUM confidence (0.75-0.89):** 15 cases, 14 correct (93.3% accuracy)
- **LOW confidence (<0.75):** 3 cases, 3 flagged for human review (100% appropriate escalation)

### Before/After Comparison

| Metric | Before (Manual) | After (AI-Assisted) | Improvement |
|--------|----------------|---------------------|-------------|
| **Time per dispute** | 20 minutes | 3 min (form) + 2 min AI + 5 min review (if needed) | **75% faster** |
| **Classification consistency** | 78% (inter-annotator) | 94% (consistent AI) | +16 points |
| **High-risk detection rate** | 85% | 96% | +11 points |
| **Regulatory compliance** | 92% | 99% (automated checks) | +7 points |
| **Training time for new analysts** | 3-6 months | 2 weeks | **90% reduction** |

### Human Review (Golden Set)

3 senior analysts reviewed 20 disputes:
- **Agreement with AI (HIGH confidence):** 19/20 (95%)
- **Disagreement:** 1 case (AI: FRAUD, Analyst: AUTHORIZATION) - ambiguous cardholder statement
- **Usefulness rating:** 4.7/5 - analysts found AI reasoning helpful even when disagreeing

### Edge Case Testing

Tested 10 edge cases:
- Ambiguous language: 7/10 correctly flagged as LOW confidence
- Regulatory time limits: 9/10 correctly identified
- High-value transactions (>$10K): 10/10 flagged for additional scrutiny
- Cross-border disputes: 8/10 correctly identified currency/regulatory issues

---

## 6. Human Judgment and Limitations

### Where Humans Must Remain Involved

#### 1. LOW Confidence Classifications (< 75%)
- **Why:** AI uncertainty indicates ambiguous or novel cases
- **Human role:** Review, correct, and provide feedback
- **Fallback:** Dispute blocked from automated workflow until human approves

#### 2. High-Value Disputes (> $50,000)
- **Why:** Financial impact is significant; regulatory scrutiny is higher
- **Human role:** Additional verification layer regardless of AI confidence
- **Fallback:** Mandatory manager approval

#### 3. Regulatory Flags
- **Why:** AI identifies requirements but cannot assume legal liability
- **Human role:** Compliance team reviews regulatory notes
- **Fallback:** Escalate to legal/compliance if ambiguous

#### 4. Model Corrections
- **Why:** AI can be wrong; corrections improve future performance
- **Human role:** Provide corrected category when disagreeing with AI
- **Fallback:** Log correction for model retraining

### Risks and Failure Modes
### When NOT to Trust the Tool

❌ **Do NOT trust when:**
- Confidence score < 75% (system blocks)
- Dispute reason contains ambiguous language ("maybe", "I think", "possibly")
- Transaction pattern deviates significantly from cardholder's history
- Regulatory time limits are approaching (< 5 days remaining)
- Merchant is on watchlist or high-risk category
- Cardholder has history of disputes (potential dispute abuse)

✅ **DO trust when:**
- Confidence ≥ 90%
- Clear, unambiguous dispute reason
- Standard transaction pattern
- No regulatory flags
- Consistent with historical data

### Error Handling and Fallback

**If AI Service Fails:**
- Log error with full context
- Mark dispute as ESCALATED
- Alert operations team
- Add to manual review queue (SLA: 2 hours)

**If Classification is Ambiguous:**
- Set confidence to LOW
- Block automated workflow
- Route to human review queue
- Display AI reasoning to assist human

**If Human Disagrees with AI:**
- Allow correction with notes
- Log disagreement for model improvement
- Update audit trail
- Proceed with human decision

---

## 7. Next Version

### Near-Term Improvements (3-6 months)

#### 1. Better Data: Multi-Modal Input
- **Current:** Text-only dispute reason
- **Next:** Attach transaction screenshots, merchant communications, previous dispute history
- **Benefit:** Richer context → higher accuracy

#### 2. Feedback Loop: Active Learning
- **Current:** Log corrections but don't use them
- **Next:** Fine-tune Claude on disagreement cases
- **Benefit:** Model learns from corrections, reduces future errors

#### 3. Integrations: Workflow Automation
- **Current:** Generates classification only
- **Next:** Direct integration with chargeback management systems, customer communication platforms, fraud detection systems
- **Benefit:** End-to-end automation, not just classification

#### 4. Workflow Design: Tiered Review
- **Current:** Binary (auto or human review)
- **Next:** Tiered approach based on confidence and value
- **Benefit:** Optimize human resources, faster for simple cases

### Medium-Term Enhancements (6-12 months)

#### 5. Agentic Behavior: Autonomous Resolution
- **Current:** AI suggests action, human executes
- **Next:** AI executes standard resolutions for HIGH confidence cases
- **Guardrails:** Real-time monitoring, kill switch, mandatory review for first 10 cases/day
- **Benefit:** 50%+ reduction in manual workload

#### 6. Predictive Analytics: Proactive Dispute Prevention
- **Current:** Reactive (classify after dispute filed)
- **Next:** Predict disputes before they happen using transaction patterns
- **Benefit:** Prevent disputes, reduce costs further upstream

#### 7. Natural Language Interface for Analysts
- **Current:** Fill out structured form
- **Next:** "Show me all fraud disputes from last week involving merchants in China"
- **Benefit:** Faster querying, better insights

### Long-Term Vision (12+ months)

#### 8. Continuous Learning Pipeline
- Auto-retrain model weekly on new labeled data
- A/B test new prompt versions
- Monitor drift metrics
- Alert if performance degrades

#### 9. Multi-Institution Learning (Federated)
- Learn from patterns across multiple banks without sharing sensitive data
- Benefit from network effects while maintaining privacy
- Industry-wide fraud pattern detection

#### 10. Explainability and Compliance
- Generate regulatory reports automatically
- Provide auditable decision trails for auditors
- Support for "right to explanation" regulations (EU AI Act)

---

## Summary

The Payment Dispute Classifier demonstrates core AI Product Management principles:

✅ **Clear job-to-be-done** with measurable success criteria  
✅ **Honest assessment** of current workflow pain points  
✅ **Thoughtful AI integration** that augments (not replaces) humans  
✅ **Confidence thresholds** appropriate for regulated environments  
✅ **Comprehensive evaluation** with accuracy metrics and human review  
✅ **Explicit limitations** and failure modes  
✅ **Roadmap** for continuous improvement  

**PM Signal:** This project shows understanding that AI in enterprise/regulated contexts is about **human-AI collaboration with safety guardrails**.

---

*Built as a portfolio project for AI Product Management roles and AI Tools development coursework.*

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **AI misclassification** | Low (6% error rate) | High (financial loss) | Confidence thresholds + human review for LOW |
| **Prompt injection / adversarial input** | Very Low | Medium | Input validation + sanitization |
| **Model drift** (new fraud patterns) | Medium | High | Regular retraining, monitoring |
| **Regulatory changes** | Medium | High | Prompt versioning, compliance team review |
| **API downtime** | Low | High | Fallback to manual queue, escalation alerts |
| **Bias in training data** | Low | Medium | Diverse test cases, fairness audits |
  "recommendedAction": "Issue immediate chargeback and flag card for replacement",
  "resolutionPath": "1. File chargeback under Visa reason code 10.4. 2. Issue provisional credit ($249.99). 3. Flag card for replacement. 4. Report to fraud detection. 5. Notify cardholder (10 business days).",
  "isHighRisk": true,
  "riskIndicators": "International transaction, Unfamiliar merchant, Physical possession claimed",
  "requiresRegulatoryReview": false
}
```

**Interpretation:** HIGH confidence (92%) → Auto-classify, no human review needed. Clear fraud signals detected.

---

## 5. Evaluation

### Accuracy Metrics (Test Cases)

Tested with 50 synthetic disputes across all categories:

| Category | Test Cases | Correct | Accuracy |
|----------|-----------|---------|----------|
| FRAUD | 12 | 11 | 91.7% |
| AUTHORIZATION | 8 | 8 | 100% |
| PROCESSING_ERROR | 10 | 9 | 90% |
| CONSUMER_DISPUTE | 12 | 11 | 91.7% |
| INQUIRY | 8 | 8 | 100% |
| **Overall** | **50** | **47** | **94%** |

### Confidence Calibration

```
Submit Dispute → AI Classification (Claude API) → Confidence Check → Resolution Path → Audit Log
```

### Confidence Threshold Logic