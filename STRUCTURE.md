# Project Structure

## Complete File Tree

```
payment-dispute-classifier/
├── .gitignore
├── PROJECT_SUMMARY.md
├── QUICKSTART.md
├── README.md
├── docker-compose.yml
│
├── backend/                            # Spring Boot Backend
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/bank/dispute/
│       │   ├── DisputeClassifierApplication.java
│       │   ├── config/
│       │   │   ├── ClaudeConfig.java
│       │   │   └── CorsConfig.java
│       │   ├── controller/
│       │   │   └── DisputeController.java
│       │   ├── dto/
│       │   │   ├── ClassificationResponse.java
│       │   │   ├── ClaudeClassificationRequest.java
│       │   │   ├── ClaudeClassificationResponse.java
│       │   │   ├── DisputeRequest.java
│       │   │   └── HumanReviewRequest.java
│       │   ├── exception/
│       │   │   ├── ClassificationException.java
│       │   │   ├── DisputeNotFoundException.java
│       │   │   └── GlobalExceptionHandler.java
│       │   ├── model/
│       │   │   ├── AuditLog.java
│       │   │   ├── Classification.java
│       │   │   └── Dispute.java
│       │   ├── repository/
│       │   │   ├── AuditLogRepository.java
│       │   │   ├── ClassificationRepository.java
│       │   │   └── DisputeRepository.java
│       │   └── service/
│       │       ├── ClassificationService.java
│       │       └── ClaudeService.java
│       └── resources/
│           └── application.yml
│
├── frontend/                           # React Frontend
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── components/
│       │   ├── DisputeForm.tsx
│       │   └── ClassificationResult.tsx
│       ├── services/
│       │   └── api.ts
│       └── types/
│           └── index.ts
│
└── docs/                               # Documentation
    ├── ASSIGNMENT.md
    └── database-schema.sql
```