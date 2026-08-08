# How to Run Locally - Step by Step

## Prerequisites
- Node.js 18+ installed
- A Gemini API key from https://aistudio.google.com/apikey

## Quick Start (5 Steps)

### Step 1: Navigate to Project
```bash
cd /Users/nripeshkumar/Desktop/Career/product_management/projects/payment-dispute-classifier
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Get Gemini API Key
1. Go to https://aistudio.google.com/apikey
2. Sign in with Google account
3. Click "Get API Key"
4. Copy the key (starts with `AIza...`)

### Step 4: Create .env.local File
```bash
# Create the file
touch .env.local

# Add your API key (replace with your actual key)
echo "GEMINI_API_KEY=AIzaSyD-Your-Actual-Key-Here" > .env.local
```

Or manually create `.env.local` with:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### Step 5: Start the Development Server
```bash
npm run dev
```

### Step 6: Open in Browser
Visit: http://localhost:3000

---

## If You Get Errors

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "GEMINI_API_KEY is not set"
```bash
# Make sure .env.local exists and has your key
cat .env.local

# Should show:
# GEMINI_API_KEY=AIzaSy...
```

### "Port 3000 already in use"
```bash
# Use a different port
npm run dev -- -p 3001
```

---

## Testing the Application

### Test Case 1: Fraud Dispute
```
Transaction ID: TXN-88432-XYZ
Cardholder ID: CARD-78901
Amount: 249.99
Currency: USD
Transaction Date: 2024-01-10 14:22
Dispute Date: 2024-01-18 09:15
Dispute Reason: I did not authorize this transaction. My card was in my wallet.
Merchant Name: QuickTech Gadgets
MCC: 5999
Country: CN
```

**Expected Result:** FRAUD category, 90%+ confidence

### Test Case 2: Consumer Dispute
```
Transaction ID: TXN-55432-ABC
Cardholder ID: CARD-12345
Amount: 89.50
Currency: USD
Transaction Date: 2024-01-05 10:30
Dispute Date: 2024-01-12 14:20
Dispute Reason: Item never arrived. Seller has not responded.
Merchant Name: Fashion Marketplace
MCC: 5999
Country: US
```

**Expected Result:** CONSUMER_DISPUTE category

---

## What to Expect

1. **Form loads** - You see the dispute submission form
2. **Fill form** - Enter dispute details (use test cases above)
3. **Click "Classify Dispute"** - Button shows "Classifying..."
4. **Wait 2-5 seconds** - Gemini API processes
5. **See results** - Classification appears with:
   - Primary category (FRAUD, CONSUMER_DISPUTE, etc.)
   - Confidence score (0-100%)
   - AI reasoning
   - Recommended action
   - Resolution path
   - Risk flags

---

## Troubleshooting

### API Returns 500 Error
- Check Gemini API key is valid
- Check browser console for error details
- Verify you haven't exceeded Gemini API quota

### Slow Response
- Normal: 2-5 seconds for Gemini to respond
- If > 10 seconds, check internet connection

### Form Not Submitting
- Check all required fields are filled
- Open browser console (F12) to see errors
- Verify API endpoint is correct: `/api/classify`

---

## Next Steps After Testing

1. ✅ Verify it works locally
2. 📹 Record demo video (2-3 minutes)
3. 🚀 Deploy to Vercel (see README_VERCEL.md)
4. 📝 Update portfolio with live link

---

## Need Help?

Check:
- `.env.local` has correct API key
- `npm install` completed successfully
- Node.js version is 18+: `node --version`
- Visit http://localhost:3000 (not 3001 or other port)

---

**That's it! You should now have a working AI dispute classifier running locally.** 🎯