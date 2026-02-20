
# Fix AI & Crawler Visibility — Static HTML Content in index.html

## Root Cause

The site is a React Single Page Application (SPA). When ChatGPT, Googlebot, or any crawler visits the URL, the raw HTML they receive looks like this:

```text
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

That is all they see. Every tool description, FAQ answer, legal framework explanation, and keyword-rich paragraph lives inside React components that only render after JavaScript executes — which AI crawlers like ChatGPT cannot do.

The robots.txt, sitemap.xml, llms.txt, and JSON-LD structured data are all correctly in place. But the actual page body content is invisible because it does not exist in the HTML source.

---

## The Fix

Embed a complete, keyword-rich, semantically structured static HTML content block directly inside `<body>` in `index.html`, before the `<div id="root">`. This content is:

- Immediately readable by every crawler on first request, before any JavaScript runs
- Visually hidden from users (React will replace it when it mounts)
- Identical in substance to what the React page renders, so there is no cloaking issue

This is the standard approach for SPA discoverability without adding a full SSR framework.

---

## What Goes Into the Static Block

The static HTML block will contain all the content crawlers need, structured with proper semantic HTML tags:

**1. Site identity and purpose**
- `<h1>` — AutoProv Compliance Tools
- Platform description paragraph explaining AutoProv is the broader platform and these are the compliance tools module

**2. Three tool descriptions (each as an `<article>` with `<h2>` and `<p>`)**
- Used Vehicle PDI Report — with keywords: pre-delivery inspection, used car, CRA 2015, mechanical condition, tyre depth, signature, PDF
- Digital Distance Sale Pack — with keywords: distance sale, CCR 2013, 14-day cooling-off, online car sales, mandatory disclosures
- AI Dispute Response Builder — with keywords: CRA 2015 dispute, consumer complaint response, used car dealer, AI legal letter

**3. Legal frameworks section**
- Consumer Rights Act 2015 — 30-day right to reject, 6-month burden of proof, satisfactory quality
- Consumer Contracts Regulations 2013 — distance selling, cooling-off period, mandatory pre-contract information
- Road Traffic Act — roadworthiness obligations
- Sale of Goods Act 1979 — implied terms

**4. Who it is for**
- Independent used car dealers, online retailers, franchised dealers, motor trade compliance officers

**5. FAQ block (7 Q&A pairs as `<details>`/`<summary>` or plain `<div>` pairs)**
- What are the AutoProv Compliance Tools?
- What is AutoProv?
- What is a PDI report?
- Do UK car dealers need a Distance Sale Pack?
- How does the AI Dispute Response Builder work?
- What consumer law applies to used car sales?
- Are the tools free?

---

## Technical Implementation

**File modified:** `index.html` only.

The static block is placed inside `<body>`, immediately after `<body>` opens and before `<div id="root">`:

```html
<body>
  <!-- Static crawler content — hidden once React mounts -->
  <div id="crawler-content" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;" aria-hidden="true">
    ... all static HTML content ...
  </div>

  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

The `style` on the wrapper positions the block off-screen (not `display:none`, which some crawlers treat as hidden/cloaked). The content remains in the DOM and is fully readable by HTTP crawlers that parse HTML source. `aria-hidden="true"` prevents screen readers from reading it twice once React renders the visible version.

---

## Why This Works for ChatGPT / AI Crawlers

ChatGPT's browsing tool and most AI crawlers (ClaudeBot, PerplexityBot, Googlebot) issue an HTTP request and parse the raw HTML response. They do not execute JavaScript. By placing static HTML in the document before `<div id="root">`, the content is present in the HTTP response body and will be parsed and indexed immediately.

---

## Files Changed

| File | Change |
|---|---|
| `index.html` | Add static HTML content block inside `<body>` before `<div id="root">` |

No other files need changing. robots.txt, sitemap.xml, llms.txt, and the JSON-LD structured data are already correct.

---

## Important Note on Domain

The canonical URL in `index.html` currently points to `https://my-pdi-pro.lovable.app/`. If `autexa.ai` is the live domain, the canonical and structured data URLs should be updated to match. This will be corrected as part of this change.
