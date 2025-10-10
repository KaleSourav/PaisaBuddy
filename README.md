# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Setup

Create a `.env` or `.env.local` in the project root. These are loaded by `dotenv` via `src/ai/dev.ts`.

Required variables:

```
# Financial Modeling Prep API key (used by getStockPrice tool)
FMP_API_KEY=your_fmp_api_key_here

# Genkit Google AI API key (optional; only if using real Google models)
# GOOGLE_API_KEY=your_google_api_key_here
```

Notes:
- Do not commit your `.env` files. They are already ignored.
- If `FMP_API_KEY` is not set, the stock price tool falls back to the public `demo` key and mock prices when needed.
