# AI/ML API Setup Guide

## ✅ Step-by-Step Setup

### 1. Get Your API Key (Already Done!)

You've already gotten the coupon from lablab.ai. Now:

1. Go to: https://aimlapi.com/app/keys
2. Login with your account
3. Click "Create New Key"
4. Name it: `DayOne-Hackathon`
5. **COPY THE KEY** (starts with something like `sk-...`)
6. Save it somewhere safe!

### 2. Apply Your $10 Coupon

1. Go to: https://aimlapi.com/app/billing/plans
2. Click "Top up" or "Add Credits"
3. Enter your coupon code from lablab.ai
4. Verify balance shows: **$10.00**

### 3. Update Your .env File

Open `backend/.env` and replace with your actual API key:

```bash
# Replace this with your actual AI/ML API key
AIMLAPI_KEY=sk-your-actual-key-here

# Recommended model (change if needed)
MODEL_NAME=gpt-4o-mini
```

**Model Options:**
- `gpt-4o-mini` - Fast, cheap, good quality (RECOMMENDED)
- `claude-3-5-sonnet` - Best quality, more expensive
- `gpt-4o` - Balanced option
- `claude-3-5-haiku` - Cheaper Claude option

### 4. Test Locally

```bash
# Navigate to backend
cd backend

# Install dependencies (if not done)
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload

# In another terminal, run test
python test_api.py
```

Expected output:
```
Testing /health endpoint...
Status: 200
Response: {'status': 'healthy', 'active_sessions': 0, 'active_connections': 0}

Testing /api/analyze endpoint...
Status: 200
Session ID: <some-uuid>
Status: started

⏳ Still processing...
```

### 5. Monitor Usage

Check your usage at: https://aimlapi.com/app/

You should see:
- API calls being logged
- Credits being used
- Remaining balance

**Cost Estimates:**
- Each full pipeline (6 agents) ≈ $0.05-0.10
- Your $10 should cover **100-200 complete runs**

### 6. Troubleshooting

**Error: "Invalid API key"**
- Make sure you copied the key correctly
- Check for extra spaces in `.env` file
- Verify key is active at https://aimlapi.com/app/keys

**Error: "Insufficient credits"**
- Check balance at https://aimlapi.com/app/billing
- Verify coupon was applied correctly

**Error: "Model not found"**
- Check model name spelling
- Try `gpt-4o-mini` (most reliable)

**Slow responses?**
- Normal for first request (cold start)
- Should be faster after warming up
- Consider using `gpt-3.5-turbo` for testing (faster/cheaper)

## 🚀 Next Steps

Once local testing works:
1. Deploy backend to Railway/Render
2. Build frontend in Native.Builder
3. Connect them via API
4. Submit to hackathon!

## 📊 Recommended Models by Use Case

| Use Case | Model | Why |
|----------|-------|-----|
| Development/Testing | `gpt-3.5-turbo` | Fastest, cheapest |
| Production Demo | `gpt-4o-mini` | Best balance |
| Final Submission | `claude-3-5-sonnet` | Highest quality |
| Budget-Conscious | `gpt-4o-mini` | Good enough, low cost |

## 💡 Pro Tips

1. **Cache responses during development** to save credits
2. **Use gpt-4o-mini for 5 agents**, `claude-3-5-sonnet` for CEO only
3. **Test with short ideas** first to verify pipeline
4. **Monitor your balance** regularly at aimlapi.com/app

## ✅ Checklist

- [ ] Got API key from AI/ML API
- [ ] Applied $10 coupon
- [ ] Updated `.env` with real API key
- [ ] Tested locally with `test_api.py`
- [ ] Verified agents are responding
- [ ] Checked usage/balance
- [ ] Ready to deploy!

---

**Need help?** Check AI/ML API docs: https://docs.aimlapi.com/
