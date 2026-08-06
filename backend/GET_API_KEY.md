# How to Get Your FREE OpenRouter API Key

OpenRouter provides access to multiple AI models with a single API key, including **completely free models** with no credit card required!

## Step-by-Step Instructions

### 1. Sign Up for OpenRouter

Visit: **https://openrouter.ai/auth/signup**

- Sign up with your email or GitHub account
- No credit card required for free models!

### 2. Get Your API Key

1. After signing up, go to: **https://openrouter.ai/settings/keys**
2. Click **"Create Key"**
3. Give it a name (e.g., "Day One Hackathon")
4. Copy the API key (starts with `sk-or-v1-...`)

### 3. Add to Your .env File

Open `backend/.env` and replace:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

With your actual key:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Free Models Available

OpenRouter offers 15+ **completely free models** including:

### Best Free Models for This Project:

1. **`openrouter/free`** (Recommended - Auto Router)
   - Automatically selects from available free models
   - No model selection needed
   - Great for prototyping

2. **`meta-llama/llama-3.2-3b-instruct:free`**
   - Meta's Llama 3.2 3B model
   - Good balance of speed and quality

3. **`qwen/qwen-2.5-7b-instruct:free`**
   - Alibaba's Qwen model
   - Excellent for reasoning

4. **`deepseek/deepseek-chat:free`**
   - DeepSeek's chat model
   - Strong coding abilities

To use a specific model, change in `.env`:

```env
MODEL_NAME=meta-llama/llama-3.2-3b-instruct:free
```

Or use the auto router (default):

```env
MODEL_NAME=openrouter/free
```

## Rate Limits (Free Tier)

OpenRouter free models have generous rate limits:

- **No credit card users**: 10 requests/minute, 200 requests/day
- **With any purchase history**: 20 requests/minute, unlimited daily

For the hackathon, the free tier is perfect since each idea analysis uses 6-8 API calls.

## Advantages of OpenRouter

✅ **No credit card required** for free models
✅ **Multiple model options** with one API key
✅ **Auto fallback** if one model is down
✅ **Same OpenAI-compatible API** (easy to switch providers)
✅ **Usage tracking** dashboard
✅ **No model-specific setup** needed

## Testing Your API Key

After adding your key to `.env`, test it:

```bash
cd backend
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('API Key:', os.getenv('OPENROUTER_API_KEY')[:20] + '...')"
```

You should see your key starting with `sk-or-v1-...`

## Troubleshooting

### "Invalid API key"
- Make sure you copied the entire key from OpenRouter
- Check for extra spaces in the `.env` file
- Regenerate a new key if needed

### "Rate limit exceeded"
- Wait 1 minute and try again
- Consider spacing out your test requests
- Check your usage at: https://openrouter.ai/settings/usage

### "Model not available"
- Try using `openrouter/free` instead of a specific model
- Check current free models: https://openrouter.ai/models?pricing=free

## Cost Comparison

| Provider | Free Tier | Credit Card Required |
|----------|-----------|---------------------|
| **OpenRouter** | ✅ 15+ models | ❌ No |
| OpenAI | ❌ $5 trial | ✅ Yes |
| Anthropic | ❌ Pay-per-use | ✅ Yes |
| Google AI | ✅ Limited | ❌ No |

For a hackathon, OpenRouter is perfect because:
- No payment setup needed
- Multiple model backups
- Generous free limits
- Professional API interface

## Resources

- **Sign Up**: https://openrouter.ai/auth/signup
- **API Keys**: https://openrouter.ai/settings/keys
- **Free Models**: https://openrouter.ai/models?pricing=free
- **Documentation**: https://openrouter.ai/docs
- **Usage Dashboard**: https://openrouter.ai/settings/usage

---

**Ready to start?** Get your free API key now! 🚀
