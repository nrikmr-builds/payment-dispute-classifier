# Migration Plan: Spring Boot → Next.js for Vercel Deployment

## Why Migrate?

Following the pattern from `prd-quality-reviewer`, we'll convert the Payment Dispute Classifier to:
- **Next.js 16** (App Router) - Better Vercel integration
- **Google Gemini API** - Matches the PRD reviewer pattern
- **Simpler architecture** - Single deployment instead of separate backend/frontend
- **Easier demo recording** - All in one app

## Architecture Comparison

### Current (Spring Boot + React)
```
backend/ (Spring Boot)
├── src/main/java/...
├── src/main/resources/
└── pom.xml

frontend/ (React + Vite)
├── src/
├── package.json
└── vite.config.ts

Deployment: Separate services (complex)
```

### New (Next.js + Gemini)
```
src/
├── app/
│   ├── api/classify/route.ts   # API endpoint
│   ├── layout.tsx
│   ├── page.tsx                # Main UI
│   └── globals.css
├── lib/
│   ├── gemini.ts               # Gemini API client
│   └── types.ts                # TypeScript types
├── components/
│   ├── DisputeForm.tsx
│   └── ClassificationResult.tsx
└── demo/
    ├── demo.mp4                # Demo video
    └── demo.gif                # Demo GIF

Deployment: Single Next.js app (simple)
```

## Migration Steps

### Step 1: Set up Next.js project structure
- [x] Create package.json with Next.js 16 + Gemini dependencies
- [x] Create next.config.ts
- [x] Create vercel.json
- [x] Create tsconfig.json
- [x] Create tailwind.config.ts
- [x] Create postcss.config.mjs

### Step 2: Migrate backend logic to API routes
- [ ] Create `src/app/api/classify/route.ts` (replaces DisputeController)
- [ ] Create `src/lib/gemini.ts` (replaces ClaudeService)
- [ ] Create `src/lib/types.ts` (replaces DTOs)

### Step 3: Migrate frontend to Next.js components
- [ ] Create `src/app/page.tsx` (main page)
- [ ] Create `src/components/DisputeForm.tsx`
- [ ] Create `src/components/ClassificationResult.tsx`
- [ ] Create `src/app/globals.css`

### Step 4: Add demo assets
- [ ] Record demo video (see DEMO_GUIDE.md)
- [ ] Create demo GIF
- [ ] Add to README

### Step 5: Deploy to Vercel
- [ ] Push to GitHub
- [ ] Import to Vercel
- [ ] Add GEMINI_API_KEY environment variable
- [ ] Test deployment

## Key Changes

### API Integration (Gemini vs Claude)

**Before (Claude):**
```java
// Spring Boot Controller
@PostMapping("/classify")
public ClassificationResponse classify(@RequestBody DisputeRequest request) {
    return classificationService.classify(request);
}
```

**After (Gemini):**
```typescript
// Next.js API Route
export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await classifyDispute(body);
  return NextResponse.json(result);
}
```

### Prompt Structure

The Gemini prompt will be similar to Claude's, just adapted for Gemini's API:
- Same dispute taxonomy
- Same confidence thresholds
- Same reasoning requirements
- Same risk flagging

### Environment Variables

**Before:**
```bash
ANTHROPIC_API_KEY=claude-key
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

**After:**
```bash
GEMINI_API_KEY=gemini-key
GEMINI_MODEL=gemini-2.5-flash
```

## Benefits

1. **Simpler deployment** - One command to deploy
2. **Free hosting** - Vercel free tier is generous
3. **Better demo** - Live URL to share
4. **Faster iteration** - No separate backend to manage
5. **Matches portfolio pattern** - Consistent with PRD reviewer

## Demo Recording Guide

See `DEMO_GUIDE.md` for step-by-step instructions on:
- Recording setup (Loom/OBS)
- Script for 2-3 minute demo
- Editing tips
- Uploading to Vercel

## Timeline

- **Day 1:** Set up Next.js structure (2 hours)
- **Day 2:** Migrate API logic (2 hours)
- **Day 3:** Migrate frontend components (2 hours)
- **Day 4:** Test locally (1 hour)
- **Day 5:** Record demo (1 hour)
- **Day 6:** Deploy to Vercel (30 mins)
- **Day 7:** Update documentation (1 hour)

**Total: ~10 hours over 1 week**

## Next Steps

1. Review this plan
2. Start migration (or keep Spring Boot if preferred)
3. Record demo
4. Deploy to Vercel
5. Update portfolio

## Questions?

- Keep Spring Boot? → More impressive but harder to demo
- Use Gemini or Claude? → Gemini matches PRD reviewer pattern
- Deploy separately? → Render/Railway for backend, Vercel for frontend