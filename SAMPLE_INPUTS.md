# Sample Inputs for Testing

Use these test cases to validate the Payment Dispute Classifier.

---

## Test Case 1: Fraud (Expect HIGH Confidence)

Transaction ID: TXN-2024-001
Cardholder ID: CARD-789
Amount: 2500.00
Currency: USD
Transaction Date: 2024-01-15T14:30
Dispute Date: 2024-01-16T09:15
Merchant Name: QuickCash Online
MCC: 5999
Country: United States
Dispute Reason: I did not authorize this transaction. My card was not physically present during this purchase.
Additional Context: Transaction occurred at 2:30 AM while I was sleeping. Card is still in my possession.

Expected: HIGH confidence, Fraud category, Card-Not-Present Fraud sub-category
---

## Test Case 2: Consumer Dispute (Expect HIGH Confidence)

Transaction ID: TXN-2024-002
Cardholder ID: CARD-456
Amount: 149.99
Currency: EUR
Transaction Date: 2024-01-10T16:45
Dispute Date: 2024-01-14T11:20
Merchant Name: TechGadgets Store
MCC: 5734
Country: Germany
Dispute Reason: Product arrived damaged and seller refuses to refund.
Additional Context: Purchased a laptop, arrived with cracked screen. Seller unresponsive to emails.

Expected: HIGH confidence, Consumer Dispute category, Merchant Services sub-category
---

## Test Case 3: Processing Error (Expect HIGH Confidence)

Transaction ID: TXN-2024-003
Cardholder ID: CARD-123
Amount: 89.50
Currency: GBP
Transaction Date: 2024-01-12T10:20
Dispute Date: 2024-01-13T08:00
Merchant Name: Coffee Shop Downtown
MCC: 5812
Country: United Kingdom
Dispute Reason: I was charged twice for the same transaction.
Additional Context: My statement shows two identical charges on the same day at the same location.

Expected: HIGH confidence, Processing Error category, Duplicate Charge sub-category
---

## Test Case 4: Authorization Issue (Expect MEDIUM Confidence)

Transaction ID: TXN-2024-004
Cardholder ID: CARD-999
Amount: 450.00
Currency: USD
Transaction Date: 2024-01-11T18:30
Dispute Date: 2024-01-15T14:00
Merchant Name: Hotel Luxuria
MCC: 7011
Country: United States
Dispute Reason: The hotel charged me more than the authorized amount.
Additional Context: I authorized $400 for incidentals but was charged $450. No prior notification.

Expected: MEDIUM confidence, Authorization Issue category, Exceeds Authorization sub-category
---

## Test Case 5: Inquiry/Information Request (Expect LOW Confidence)

Transaction ID: TXN-2024-005
Cardholder ID: CARD-777
Amount: 1200.00
Currency: EUR
Transaction Date: 2024-01-08T13:15
Dispute Date: 2024-01-16T10:30
Merchant Name: Unknown Online Retailer
MCC: 5999
Country: France
Dispute Reason: Can you tell me what this charge is? I don't recognize it.
Additional Context: Just seeking clarification on a transaction. May be valid.

Expected: LOW confidence, Inquiry category, Request for Information sub-category
---

## Test Case 6: Fraud - Card Lost/Stolen (Expect HIGH Confidence)

Transaction ID: TXN-2024-006
Cardholder ID: CARD-555
Amount: 3200.00
Currency: GBP
Transaction Date: 2024-01-14T03:45
Dispute Date: 2024-01-14T07:00
Merchant Name: Electronics MegaStore
MCC: 5732
Country: United Kingdom
Dispute Reason: My card was lost yesterday and this transaction occurred after I reported it lost.
Additional Context: Card was reported lost at 6 PM yesterday. Transaction shows 3:45 AM today.

Expected: HIGH confidence, Fraud category, Lost/Stolen Card sub-category
---

## How to Use These Samples

1. Open http://localhost:3000 in your browser
2. Copy the field values from any test case above
3. Paste them into the corresponding form fields
4. Click "Classify Dispute"
5. Verify the results match the expected confidence levels and categories

## Notes

- HIGH Confidence (90%+): Clear-cut cases with strong evidence
- MEDIUM Confidence (75-89%): Requires some investigation but likely valid
- LOW Confidence (<75%): Ambiguous cases requiring human review
- These samples cover all 5 primary dispute categories: Fraud, Consumer Dispute, Processing Error, Authorization Issue, and Inquiry
---

## Test Case 7: Inquiry - Genuine LOW Confidence Example

Transaction ID: TXN-2024-007
Cardholder ID: CARD-888
Amount: 45.99
Currency: USD
Transaction Date: 2024-01-10T19:22
Dispute Date: 2024-01-16T11:45
Merchant Name: CloudStream Services
MCC: 5815
Country: United States
Dispute Reason: What is this charge? I see a transaction on my statement but don't recall making it.
Additional Context: The amount is small. It might be a subscription I forgot about. Can you help me identify the merchant?

Expected: LOW confidence (60-75%), Inquiry category, Request for Information sub-category
---

## Test Case 8: Inquiry - Vague Description (Expect LOW Confidence)

Transaction ID: TXN-2024-008
Cardholder ID: CARD-321
Amount: 250.00
Currency: EUR
Transaction Date: 2024-01-09T08:15
Dispute Date: 2024-01-16T14:20
Merchant Name: DIGITAL*SVCS
MCC: 4816
Country: Germany
Dispute Reason: Can you tell me what this is? Not sure if I made this purchase.
Additional Context: The merchant name on my statement is unclear. Could be legitimate but I need more info before deciding.

Expected: LOW confidence (65-75%), Inquiry category, Request for Information sub-category
---

## Why These Are LOW Confidence

Test Cases 5, 7, and 8 are designed to return LOW confidence because:

1. **No fraud claim**: The cardholder is not saying "I didn't make this transaction" or "My card was stolen"
2. **Seeking information**: They're asking "what is this charge?" or "can you help me identify it?"
3. **Uncertainty**: Language like "I don't recall", "not sure", "might be legitimate" indicates ambiguity
4. **No evidence**: No evidence of unauthorized use, just a request for clarification
5. **Possible legitimate transaction**: The cardholder acknowledges it might be valid

**Key difference from HIGH confidence fraud cases:**
- HIGH: "I did NOT authorize this" or "My card was stolen" (clear fraud claim)
- LOW: "What is this charge?" or "I don't recognize it" (information request)
