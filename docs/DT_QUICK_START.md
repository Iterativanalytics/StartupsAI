# Design Thinking Enhancement - Quick Start Guide

**For:** Developers & Product Managers  
**Time to Complete:** 10 minutes  
**Last Updated:** October 6, 2025

---

## 🚀 Quick Start (5 Steps)

### Step 1: Start the Server (1 min)

```bash
cd /Users/lgfutwa/Documents/GitHub/Startups
npm run dev
```

**Expected Output:**
```
✓ Server running on http://localhost:3000
✓ WebSocket server initialized
✓ Design Thinking routes loaded
```

### Step 2: Test API Health (1 min)

```bash
curl http://localhost:3000/api/dt/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "healthy",
  "services": {
    "dtAgent": "active",
    "collaboration": "active",
    "analytics": "ready",
    "workflows": "operational"
  }
}
```

### Step 3: Create Your First Workflow (2 min)

```bash
curl -X POST http://localhost:3000/api/dt/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First DT Workflow",
    "description": "Testing the enhanced DT system",
    "currentPhase": "empathize",
    "aiFacilitationEnabled": true
  }'
```

**Save the workflow ID from the response!**

### Step 4: Add Empathy Data (3 min)

```bash
curl -X POST http://localhost:3000/api/dt/workflows/{WORKFLOW_ID}/empathy-data \
  -H "Content-Type: application/json" \
  -d '{
    "dataType": "interview",
    "participantPersona": "Sarah, 35, working mom with 2 kids",
    "painPoints": [
      "No time to cook healthy meals",
      "Feels guilty ordering takeout",
      "Kids are picky eaters"
    ],
    "needs": [
      "Quick meal preparation",
      "Healthy options",
      "Family-friendly recipes"
    ],
    "behaviors": [
      "Orders takeout 3x per week",
      "Meal preps on Sundays when possible",
      "Uses meal kit services occasionally"
    ],
    "emotions": [
      "Stressed about dinner time",
      "Guilty about nutrition",
      "Overwhelmed by choices"
    ]
  }'
```

### Step 5: Generate AI Insights (3 min)

```bash
# Generate POV Statements
curl -X POST http://localhost:3000/api/dt/workflows/{WORKFLOW_ID}/pov-statements/generate \
  -H "Content-Type: application/json"

# View Generated POV Statements
curl http://localhost:3000/api/dt/workflows/{WORKFLOW_ID}/pov-statements

# Generate HMW Questions (use POV ID from previous response)
curl -X POST http://localhost:3000/api/dt/pov-statements/{POV_ID}/hmw-questions/generate \
  -H "Content-Type: application/json"

# View HMW Questions
curl http://localhost:3000/api/dt/workflows/{WORKFLOW_ID}/hmw-questions
```

---

## 🎨 Frontend Quick Start

### Access the UI

1. **DT Readiness Assessment:**
   ```
   http://localhost:3000/assessments/dt-readiness
   ```

2. **Workflow Dashboard:**
   ```
   http://localhost:3000/design-thinking/{WORKFLOW_ID}/dashboard
   ```

3. **Empathy Map Builder:**
   ```
   http://localhost:3000/design-thinking/{WORKFLOW_ID}/empathy
   ```

4. **POV Statement Builder:**
   ```
   http://localhost:3000/design-thinking/{WORKFLOW_ID}/pov
   ```

5. **HMW Question Generator:**
   ```
   http://localhost:3000/design-thinking/{WORKFLOW_ID}/hmw
   ```

6. **Idea Evaluation Matrix:**
   ```
   http://localhost:3000/design-thinking/{WORKFLOW_ID}/ideate
   ```

---

## 🧪 Complete Test Scenario

### Scenario: Mobile Meal Planning App

**Context:** You're designing a meal planning app for busy parents.

#### 1. Create Workflow
```bash
WORKFLOW_ID=$(curl -X POST http://localhost:3000/api/dt/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meal Planning App",
    "description": "DT for busy parent meal planning solution",
    "industry": "food_tech",
    "innovationType": "product"
  }' | jq -r '.data.id')

echo "Workflow ID: $WORKFLOW_ID"
```

#### 2. Add Multiple Empathy Data Points
```bash
# Interview 1: Sarah
curl -X POST http://localhost:3000/api/dt/workflows/$WORKFLOW_ID/empathy-data \
  -H "Content-Type: application/json" \
  -d '{
    "dataType": "interview",
    "participantPersona": "Sarah, 35, working mom",
    "painPoints": ["No time to cook", "Feels guilty", "Kids picky"],
    "needs": ["Quick meals", "Healthy options", "Family time"],
    "behaviors": ["Takeout 3x/week", "Sunday meal prep"],
    "emotions": ["Stressed", "Guilty", "Overwhelmed"]
  }'

# Interview 2: Mike
curl -X POST http://localhost:3000/api/dt/workflows/$WORKFLOW_ID/empathy-data \
  -H "Content-Type: application/json" \
  -d '{
    "dataType": "interview",
    "participantPersona": "Mike, 42, single dad",
    "painPoints": ["Limited cooking skills", "Budget constraints", "Time pressure"],
    "needs": ["Simple recipes", "Budget-friendly", "Kid-approved meals"],
    "behaviors": ["Rotates same 5 meals", "Shops multiple times/week"],
    "emotions": ["Frustrated", "Inadequate", "Tired"]
  }'

# Interview 3: Jessica
curl -X POST http://localhost:3000/api/dt/workflows/$WORKFLOW_ID/empathy-data \
  -H "Content-Type: application/json" \
  -d '{
    "dataType": "interview",
    "participantPersona": "Jessica, 29, new mom",
    "painPoints": ["Unpredictable schedule", "Baby needs", "Nutrition concerns"],
    "needs": ["Flexible meal timing", "One-handed cooking", "Nutritious food"],
    "behaviors": ["Eats while feeding baby", "Relies on frozen meals"],
    "emotions": ["Exhausted", "Anxious", "Isolated"]
  }'
```

#### 3. Generate POV Statements
```bash
curl -X POST http://localhost:3000/api/dt/workflows/$WORKFLOW_ID/pov-statements/generate

# View results
curl http://localhost:3000/api/dt/workflows/$WORKFLOW_ID/pov-statements | jq
```

#### 4. Generate HMW Questions
```bash
# Get first POV ID
POV_ID=$(curl http://localhost:3000/api/dt/workflows/$WORKFLOW_ID/pov-statements | jq -r '.data[0].id')

# Generate HMW questions
curl -X POST http://localhost:3000/api/dt/pov-statements/$POV_ID/hmw-questions/generate

# View results
curl http://localhost:3000/api/dt/workflows/$WORKFLOW_ID/hmw-questions | jq
```

#### 5. Create and Evaluate Ideas
```bash
# Create ideas
curl -X POST http://localhost:3000/api/dt/workflows/$WORKFLOW_ID/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Meal Planning Assistant",
    "description": "AI-powered meal planner that learns family preferences",
    "userBenefit": "Saves 5 hours per week on meal planning and shopping",
    "businessValue": "Subscription model with high retention",
    "implementationApproach": "Mobile app with AI recommendation engine"
  }'

curl -X POST http://localhost:3000/api/dt/workflows/$WORKFLOW_ID/ideas \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meal Prep Marketplace",
    "description": "Connect busy parents with local meal prep services",
    "userBenefit": "Fresh, healthy meals without cooking",
    "businessValue": "Commission-based marketplace model",
    "implementationApproach": "Two-sided marketplace platform"
  }'

# Evaluate all ideas with AI
curl -X POST http://localhost:3000/api/dt/workflows/$WORKFLOW_ID/ideas/evaluate

# View evaluated ideas
curl http://localhost:3000/api/dt/workflows/$WORKFLOW_ID/ideas | jq
```

#### 6. View Workflow Summary
```bash
curl http://localhost:3000/api/dt/workflows/$WORKFLOW_ID | jq
```

**Expected Output:**
```json
{
  "success": true,
  "data": {
    "workflow": { ... },
    "stats": {
      "empathyDataCount": 3,
      "povStatementCount": 3-5,
      "hmwQuestionCount": 6-30,
      "ideaCount": 2,
      "prototypeCount": 0,
      "testSessionCount": 0,
      "insightCount": 5-10
    },
    "recentActivity": { ... }
  }
}
```

---

## 🔍 Troubleshooting

### Issue: "Failed to generate POV statements"

**Cause:** No empathy data or OpenAI API key not configured

**Solution:**
1. Check empathy data exists: `GET /api/dt/workflows/:id/empathy-data`
2. Verify OpenAI API key in `.env`
3. Check server logs for detailed error

### Issue: "Workflow not found"

**Cause:** Invalid workflow ID or workflow deleted

**Solution:**
1. List all workflows: `GET /api/dt/workflows`
2. Verify workflow ID is correct
3. Create new workflow if needed

### Issue: WebSocket not connecting

**Cause:** WebSocket server not initialized or CORS issue

**Solution:**
1. Check server logs for WebSocket initialization
2. Verify CLIENT_URL in `.env`
3. Check browser console for CORS errors

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

**Usage Metrics:**
```bash
# Total workflows
curl http://localhost:3000/api/dt/workflows | jq '.count'

# Workflows by phase
curl http://localhost:3000/api/dt/workflows?phase=empathize | jq '.count'
curl http://localhost:3000/api/dt/workflows?phase=define | jq '.count'
curl http://localhost:3000/api/dt/workflows?phase=ideate | jq '.count'
```

**AI Usage:**
- POV statements generated (AI vs manual)
- HMW questions generated
- Ideas evaluated
- Insights synthesized

**Engagement:**
- Average empathy data per workflow
- Average ideas per workflow
- Completion rate by phase

---

## 🎉 Success!

You now have a **fully functional AI-powered Design Thinking system** with:

✅ Complete workflow management  
✅ AI-powered insight generation  
✅ Automated POV and HMW generation  
✅ Smart idea evaluation  
✅ Real-time collaboration infrastructure  
✅ Beautiful, intuitive UI  
✅ Comprehensive documentation

**Next:** Start testing with real users and gather feedback for Phase 1 enhancements!

---

**Questions?** Check the comprehensive documentation in `/docs` or review the implementation status document.
