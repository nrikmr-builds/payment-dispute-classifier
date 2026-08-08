# Quick Start Guide

Get the Payment Dispute Classifier running in 5 minutes!

## Option 1: Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Anthropic API key

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd payment-dispute-classifier
```

2. **Set your Anthropic API key**
```bash
export ANTHROPIC_API_KEY=your-api-key-here
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Verify services are running**
```bash
# Check backend health
curl http://localhost:8080/actuator/health

# Check frontend
open http://localhost:5173
```

5. **View logs (if needed)**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

6. **Stop services**
```bash
docker-compose down
```

## Option 2: Manual Setup

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+
- Anthropic API key

### Step 1: Database Setup

```bash
# Start PostgreSQL
brew services start postgresql  # macOS
# OR
sudo systemctl start postgresql  # Linux

# Create database
createdb dispute_classifier

# Run schema
psql -d dispute_classifier -f docs/database-schema.sql
```

### Step 2: Backend Setup

```bash
cd backend

# Set environment variables
export ANTHROPIC_API_KEY=your-api-key
export DB_USERNAME=postgres
export DB_PASSWORD=postgres

# Run the application
mvn spring-boot:run
```

Backend will be available at `http://localhost:8080`

### Step 3: Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Verify Installation

1. Open `http://localhost:5173` in your browser
2. You should see the "Payment Dispute Classifier" interface
3. Try submitting a test dispute (use the seed data from database-schema.sql)

## Test with Sample Data

Use these pre-loaded test disputes:

### Test Case 1: Fraud (Card-not-present)
```
Transaction ID: TXN-001-TEST
Cardholder ID: CARD-001
Amount: 149.99
Currency: USD
Transaction Date: 2024-01-15 10:30
Dispute Date: 2024-01-20 14:22
Dispute Reason: "I did not authorize this transaction. My card was in my possession at all times."
Merchant: Online Electronics Store
MCC: 5999
Merchant Country: US
```

**Expected Result:** FRAUD, Card-not-present, HIGH confidence (90%+)

### Test Case 2: Consumer Dispute (Item not received)
```
Transaction ID: TXN-002-TEST
Cardholder ID: CARD-002
Amount: 89.50
Currency: USD
Transaction Date: 2024-01-10 16:45
Dispute Date: 2024-01-18 09:15
Dispute Reason: "Item never arrived. Seller has not responded to my messages."
Merchant: Fashion Marketplace
MCC: 5999
Merchant Country: CN
```

**Expected Result:** CONSUMER_DISPUTE, Not received, HIGH or MEDIUM confidence

### Test Case 3: Processing Error (Duplicate charge)
```
Transaction ID: TXN-003-TEST
Cardholder ID: CARD-003
Amount: 1250.00
Currency: USD
Transaction Date: 2024-01-05 11:20
Dispute Date: 2024-01-25 16:30
Dispute Reason: "Charged twice for the same purchase. Only one item was ordered."
Merchant: Home Improvement Store
MCC: 5912
Merchant Country: US
```

**Expected Result:** PROCESSING_ERROR, Duplicate processing, HIGH confidence

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `pg_isready`
- Verify environment variables are set: `echo $ANTHROPIC_API_KEY`
- Check logs: `docker-compose logs backend` or check console output

### Frontend won't connect to backend
- Verify backend is running on port 8080
- Check CORS configuration in `application.yml`
- For Docker: ensure services are on the same network

### Claude API errors
- Verify API key is valid: `echo $ANTHROPIC_API_KEY`
- Check API quota: https://console.anthropic.com/
- Review network connectivity

### Database connection issues
- Verify PostgreSQL is running
- Check credentials in `application.yml`
- Ensure database `dispute_classifier` exists

## Next Steps

1. ✅ **Run test cases** - Try the sample disputes above
2. 📖 **Read the documentation** - Check `docs/ASSIGNMENT.md` for complete details
3. 🔧 **Customize thresholds** - Adjust confidence thresholds in `application.yml`
4. 🎨 **Customize the UI** - Modify React components in `frontend/src/`
5. 🚀 **Deploy** - Set up production deployment (see DEPLOYMENT.md)

## Getting Help

- Check the [documentation](./docs/ASSIGNMENT.md)
- Review [troubleshooting section](#troubleshooting)
- Open an issue on GitHub

---

**Happy classifying! 🎯**