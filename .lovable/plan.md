
# SEO, AEO & AI Search Engine Optimisation

## What This Achieves

This update makes AutoProv fully discoverable by:
- **Traditional search engines** (Google, Bing, DuckDuckGo)
- **AI search platforms** (ChatGPT/OpenAI, Perplexity, Claude/Anthropic, Gemini, Grok)
- **Social crawlers** (LinkedIn, Facebook, Twitter/X)
- **Answer Engine Optimisation (AEO)** — structured data so AI assistants can directly answer "what tools do UK car dealers use for CRA compliance?"

---

## Files Being Created or Modified

### 1. `public/robots.txt` — Updated
Add explicit permission for every major AI crawler bot alongside existing search bots:

- `GPTBot` — OpenAI / ChatGPT
- `ClaudeBot` — Anthropic / Claude
- `PerplexityBot` — Perplexity AI
- `Googlebot-Extended` — Google AI Overviews / Gemini
- `cohere-ai` — Cohere
- `YouBot` — You.com AI search
- `Applebot` — Apple AI / Siri
- `DuckAssistBot` — DuckDuckGo AI
- `Meta-ExternalAgent` — Meta AI
- `Bytespider` — TikTok/ByteDance AI

Also adds `Sitemap:` declaration pointing to `/sitemap.xml`.

---

### 2. `public/sitemap.xml` — New File
A valid XML sitemap covering all public routes:
- `/` — Home / Landing
- `/pdi` — Used Vehicle PDI
- `/distance-sale` — Digital Distance Sale Pack
- `/dispute-response` — Dispute Response Builder

Includes `<lastmod>`, `<changefreq>`, and `<priority>` for each URL, using the published domain `https://my-pdi-pro.lovable.app`.

---

### 3. `public/llms.txt` — New File
This is the emerging **AI-native discovery standard** (similar to `robots.txt` but specifically for LLMs). It provides a plain-text, structured summary of what AutoProv is, what tools it offers, who it is for, and how AI assistants should represent it when users ask questions. Perplexity, ChatGPT, and other AI platforms increasingly read this file.

---

### 4. `index.html` — Structured Data & Enhanced Meta Tags
Add JSON-LD structured data blocks (the machine-readable layer that powers Google's AI Overviews, rich snippets, and AEO responses):

- **`Organization` schema** — brand identity, name, URL
- **`WebSite` schema** — with `SearchAction` for sitelinks search box
- **`SoftwareApplication` schema** — describes AutoProv as a SaaS tool
- **`ItemList` schema** — lists all three tools as individual `ListItem` entries with name, description and URL, so AI can enumerate them
- **`FAQPage` schema** — pre-answers common questions like "What is AutoProv?", "What is a PDI report?", "Do UK car dealers need a Distance Sale Pack?", "What is the CRA 2015?" — these are the exact questions potential customers ask AI assistants

Additional meta tags:
- `<meta name="keywords">` — UK motor trade, CRA compliance, PDI, distance selling, dispute response
- `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">` — explicit permission for AI snippet extraction
- `<link rel="canonical">` — prevents duplicate content issues
- `<meta name="theme-color">` — brand colour for mobile browsers

---

## Technical Notes

- No backend changes required — all files are static and served from `public/`
- The JSON-LD structured data in `index.html` is invisible to users but machine-readable by all crawlers
- The `llms.txt` file follows the draft specification at `llmstxt.org`
- The `FAQPage` schema directly answers the kinds of questions UK car dealers search for on AI platforms
- All canonical URLs use the published domain `https://my-pdi-pro.lovable.app`

---

## Summary of Files

| File | Action | Purpose |
|---|---|---|
| `public/robots.txt` | Update | Allow all AI crawlers + add sitemap declaration |
| `public/sitemap.xml` | Create | Help search engines find all pages |
| `public/llms.txt` | Create | AI-native discovery standard for LLM platforms |
| `index.html` | Update | JSON-LD structured data + enhanced meta tags |
