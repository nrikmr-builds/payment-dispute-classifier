# Dispute Triage Assistant

> **AI-Powered Routing and Context for Dispute Analysts**

A triage assistant that helps bank analysts classify payment disputes faster using AI-generated recommendations. It does NOT make decisions — it surfaces the right context, suggests likely categories, flags regulatory requirements, and routes uncertain cases to human review.

## 🎯 Project Overview

This project demonstrates **AI Product Management** expertise in building responsible, human-centered AI tools for regulated industries. It was created as a portfolio piece for AI Product Management roles and as coursework for AI Tools development.

### Key PM Signals Demonstrated
- ✅ **Triage-first design** — AI as assistant, not decision-maker
- ✅ **Confidence thresholds** that route uncertainty to humans
- ✅ **Human-in-the-loop** design with mandatory review paths
- ✅ **Audit trails** and explainability for regulated environments
- ✅ **Honest failure mode disclosure** — what it can't do
- ✅ **Before/after metrics** demonstrating business value
- ✅ **Edge case handling** and risk mitigation
- ✅ **Reflection on human judgment** — where it remains essential

## 🏦 The User Story

> "A dispute analyst at a mid-size bank reviews 50+ disputes daily. Each one requires reading unstructured text, identifying the dispute type, cross-referencing resolution playbooks, and flagging compliance requirements. This takes an estimated 15-30 minutes per case. My tool does it in seconds and surfaces the right context for the analyst to make the final call."

### The Problem
- **Slow:** an estimated 15-30 minutes per dispute for manual review (estimate from research, not measured with analysts)
- **Inconsistent:** Different analysts classify identical disputes differently
- **Expensive:** manual review ties up analyst time on every case
- **Risky:** Missed regulatory time limits and human errors lead to financial losses

## ✨ How It Works

The tool follows a **triage-first workflow** — it analyzes disputes and provides recommendations, but never makes autonomous decisions:

1. **Input**: Analyst submits dispute details (or batch uploads cases)
2. **Analysis**: AI reads the dispute reason, transaction details, and merchant context
3. **Classification**: Returns suggested category, sub-category, and confidence score
4. **Context**: Provides likely resolution path and regulatory flags
5. **Routing**: 
   - **HIGH confidence (90%+)**: Suggests classification with reasoning — analyst validates
   - **MEDIUM confidence (75-89%)**: Flags for review — analyst confirms or overrides
   - **LOW confidence (<75%)**: **Blocks automation** — mandatory human review required

### Confidence Thresholds

| Confidence | Score | AI Output | Human Action |
|------------|-------|-----------|--------------|
| **HIGH** | ≥ 90% | "This looks like [category] — here's the resolution path" | Validate and proceed |
| **MEDIUM** | 75-89% | "This likely looks like [category] — verify details" | Review and confirm |
| **LOW** | < 75% | "Unclear — this needs human judgment" | Mandatory full review |

## 🛠️ Tech Stack

### Backend
- **Spring Boot 3.2** - REST API with clean architecture
- **PostgreSQL** - Persistent storage for disputes, classifications, and audit logs
- **Claude API (Anthropic)** - AI classification engine
- **Lombok** - Boilerplate reduction
- **Maven** - Dependency management

### Frontend
- **React 18** - Modern UI with TypeScript
- **Vite** - Fast development and build
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client

### Key Features
- 📊 **Triage classification** into 5 primary categories and 15+ sub-categories
- 🎯 **Confidence scoring** that routes uncertainty to humans
- ⚠️ **Risk flagging** (high-risk transactions, regulatory requirements)
- 📝 **Explainable AI** - detailed reasoning for every classification
- 🔍 **Audit trails** - complete history of all actions
- 👤 **Mandatory human review** for low-confidence cases
- 🔄 **Fallback handling** - graceful degradation when AI fails

## 🔍 Known Limitations & Failure Modes

We believe in honest disclosure of what this tool can and cannot do:

### What This Tool Struggles With
- **Novel scam types** not in training data (e.g., new social engineering tactics)
- **Cross-border disputes** with mixed jurisdiction rules
- **Poor communication** — customers with language barriers or unclear descriptions
- **Contradictory evidence** — when dispute reason contradicts transaction history
- **First-time fraud patterns** that deviate from known signatures

### Human Escalation Path
When the AI reaches its limits, here's how cases flow to humans:
- **LOW confidence cases** → Senior analyst review within 2 hours
- **High-value transactions (>$10K)** → Mandatory supervisor approval
- **Regulatory complexity** → Compliance team consultation
- **Repeat customer disputes** → Account manager engagement

## 🤔 Reflection: Where Human Judgment Remains Essential

This is the most important section. AI can surface patterns and suggest classifications, but certain decisions require human wisdom:

1. **Validating customer intent** — Is "I don't recognize this" fraud, or did they forget about a legitimate subscription?
2. **Assessing relationship value** — Should we make an exception for a 10-year high-value customer?
3. **Interpreting ambiguous evidence** — Does this timestamp mean fraud, or a family member using the card?
4. **Making exceptions** — When do standard rules not apply?
5. **Regulatory judgment** — Does this case require escalation to compliance, or is it a routine dispute?
6. **Empathy and communication** — How do we explain the decision to a frustrated customer?

**The AI's job is to reduce cognitive load and surface context. The human's job is to make the final call with wisdom, empathy, and accountability.**

## 🚀 Getting Started

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd payment-dispute-classifier/backend
```

2. **Configure database**
```bash
# Create PostgreSQL database
createdb dispute_classifier

# Run schema
psql -d dispute_classifier -f ../docs/database-schema.sql
```

3. **Configure environment variables**
```bash
export ANTHROPIC_API_KEY=your-api-key
export DB_USERNAME=postgres
export DB_PASSWORD=postgres
```

4. **Run the backend**
```bash
mvn spring-boot:run
```

Backend will start at `http://localhost:8080`

### Frontend Setup

1. **Install dependencies**
```bash
cd ../frontend
npm install
```

2. **Run development server**
### Evaluation status
- **Speed:** results returned in ≤15 seconds per case across 30 synthetic test disputes, timed by hand.
- **Accuracy:** not yet measured. `SAMPLE_INPUTS.md` holds 8 sample disputes (separate from the 30 timed ones) with expected categories and confidence tiers; a labeled eval set with published results is planned.
- The live demo is the Next.js + Gemini app. Every result is marked for analyst review, and LOW-confidence cases require a full manual review.

The figures in [docs/ASSIGNMENT.md](./docs/ASSIGNMENT.md) are design-stage projections, not measured results.

## 🎓 Portfolio Case Study

### What This Project Demonstrates

#### Technical Skills
- Full-stack development (Spring Boot + React)
- AI/ML integration (Claude API, prompt engineering)
- Database design (PostgreSQL, JPA, indexing)
- API design (REST, error handling, validation)
- Frontend development (React, TypeScript, modern UI)

#### AI Product Management Skills
- **Problem framing:** Clear JTBD and success metrics
- **User research:** Understanding analyst workflows and pain points
- **Solution design:** Confidence thresholds, human-in-the-loop
- **Risk management:** Explicit failure modes and mitigation strategies
- **Evaluation:** Quantitative metrics, human review, edge case testing
- **Roadmapping:** Clear vision for future improvements

#### Business Acumen
- Cost-benefit analysis (time savings, training reduction)
- Regulatory awareness (compliance, audit trails)
- Scalability thinking (architecture for production)
- Stakeholder communication (clear documentation)

A: "We have explicit fallback strategies:
- **During classification:** Low confidence → human review
- **If API fails:** Escalate to manual queue with SLA alerts
- **If human disagrees:** Allow correction with notes, log for retraining
- **If model drifts:** Monitor confidence distribution, trigger retraining

The key is designing for failure, not just success. Every AI system will make mistakes—the question is how gracefully you handle them."

## 🎯 Key Takeaways for AI PMs

1. **Start with the problem, not the technology** - This tool solves a real business pain point
2. **Design for failure** - Confidence thresholds and human oversight aren't afterthoughts
3. **Measure everything** - Accuracy, speed, consistency, cost savings
4. **Explainability matters** - Regulated industries need to understand AI decisions
5. **Iterate based on feedback** - Log corrections, retrain models, improve prompts
6. **Communicate clearly** - Documentation is as important as code

---

*This project is designed to showcase both engineering rigor and AI product thinking—exactly what hiring managers look for in AI PM candidates.*
### Interview Talking Points

**Q: "How do you handle AI uncertainty in regulated industries?"**

A: "I set confidence thresholds in code, not in the model. In this dispute classifier, every result goes to an analyst, and anything below 75% confidence is marked for mandatory full review. Where to draw those lines is a product decision that balances efficiency against risk."

**Q: "How do you measure if an AI tool is actually useful?"**

A: "I use a multi-layered evaluation framework:
1. **Accuracy metrics** - Does it classify correctly? (not yet measured; labeled eval set planned)
2. **Confidence calibration** - Does it know when it's uncertain? (LOW confidence cases correctly escalated)
3. **Human review** - Do subject matter experts agree? (not yet measured)
4. **Business impact** - Does it save time/money? (≤15 seconds per case across 30 timed test disputes)
5. **Edge cases** - Does it handle unusual scenarios?"

**Q: "What happens when the AI is wrong?"**
```bash
npm run dev
```

Frontend will start at `http://localhost:5173`

## 📁 Project Structure

```
payment-dispute-classifier/
├── backend/
│   ├── src/main/java/com/bank/dispute/
│   │   ├── config/          # CORS, Claude API config
│   │   ├── controller/      # REST endpoints
│   │   ├── dto/             # Request/response objects
│   │   ├── exception/       # Global exception handling
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Data access layer
│   │   └── service/         # Business logic
│   └── src/main/resources/
│       └── application.yml  # Configuration
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── services/        # API client
│   │   └── types/           # TypeScript interfaces
│   └── package.json
└── docs/
    ├── ASSIGNMENT.md        # Complete assignment writeup
    └── database-schema.sql  # Database schema
```

## 📈 Evaluation Results

### Accuracy
An AI-powered classification system that:
1. **Automates** dispute categorization using Claude AI
2. **Assesses confidence** and routes uncertain cases to humans
3. **Generates** actionable resolution paths
4. **Logs** all decisions for compliance and auditability

### Confidence Threshold Workflow