

# AutoProv Site Audit and Improvement Plan

## Audit Summary

After a thorough review of every page, component, hook, edge function, database schema, SEO assets, and styling, the following improvement areas have been identified. They are grouped by priority and category.

---

## 1. UX and Usability Improvements

### 1.1 Landing Page -- Missing Navigation and Footer Links
The landing page footer has no links to individual tools, a privacy policy, or contact information. The header has no persistent navigation. Users arriving from search have no way to navigate between tools without returning to the landing page.

**Fix:** Add a simple top navigation bar (logo + tool links) and expand the footer with tool links and a "Back to Top" button.

### 1.2 PDI Tool -- No "Start New" / Reset Button
The PDI form (`/pdi`) has no way to clear the form and start a fresh report without manually refreshing the browser. The Distance Sale and Dispute tools both have reset buttons ("Start New Pack" / "New Case"), but PDI does not.

**Fix:** Add a "New Report" reset button to the PDI sticky bottom bar, with a confirmation dialog (matching the pattern in DistanceSale.tsx).

### 1.3 PDI Tool -- No Autosave
The Distance Sale and Dispute tools both autosave to localStorage. The PDI form does not -- if the user accidentally navigates away, all data is lost.

**Fix:** Add localStorage autosave to the PDI form (matching the `AUTOSAVE_KEY` pattern already used in DistanceSale.tsx and DisputeResponse.tsx).

### 1.4 Seller Capture -- canAdvance() Logic is Incomplete
In `SellerCapture.tsx` line 164-165, the `canAdvance()` function for multi-image steps (exterior, interior, dashboard, tyres) has a simplified check (`confirmedSteps.size > 0`) with a comment "will refine". This means a user can skip required sub-captures.

**Fix:** Implement proper per-step validation. For example, exterior should require all 4 angles confirmed, interior all 5 areas, etc. -- or at minimum one per sub-step.

### 1.5 Remote Capture Dashboard -- No Refresh / Real-time Updates
When a seller completes a capture, the dealer dashboard does not update until the page is manually refreshed.

**Fix:** Add `refetchInterval` (e.g. 30 seconds) to the `useCaptureRequests` queries, or enable Supabase Realtime on `capture_requests`.

### 1.6 404 Page -- Generic and Unbranded
The NotFound page is completely unbranded -- plain text on a grey background with no AutoProv styling.

**Fix:** Restyle the 404 page to match the AutoProv brand (dark header, gold accent, logo, link back to portal).

---

## 2. Functional Improvements

### 2.1 Remote Capture -- Expired Requests Not Auto-Updated
Capture requests that pass their `expires_at` remain as "pending" in the database indefinitely. The expiry is only enforced on the seller-facing page (client-side check). The dealer dashboard shows them as "Expired" via a client-side check too, but the underlying status never changes.

**Fix:** Add a database function or scheduled check that transitions `pending` requests past their expiry to `expired` status. Alternatively, add a simple check in `useCaptureRequests` that auto-updates expired records on fetch.

### 2.2 Remote Capture -- No Dealer Name Persistence
Each time a dealer creates a new capture request, they must re-enter their dealer name and email. There is no persistence of dealer details.

**Fix:** Save the last-used dealer name and email to localStorage, and pre-fill the create modal on next use.

### 2.3 Dispute Response -- Toast Says "Email resent" Instead of "Email sent"
In `CaptureRequestCard.tsx` line 54, the success toast message says "Email resent" even on the first send.

**Fix:** Change the toast message to "Email sent".

---

## 3. Accessibility and Mobile Improvements

### 3.1 FAQ Section -- No Animation on Open/Close
The FAQ accordion uses a simple conditional render (show/hide) with no transition. This feels abrupt.

**Fix:** Add a smooth height transition or use the existing Radix Accordion component (already installed) for the FAQ section.

### 3.2 Tool Cards -- Keyboard Navigation Incomplete
The landing page tool cards have `role="button"` and `tabIndex` but the "Coming Soon" card is not clearly distinguished for keyboard users (no `aria-disabled`).

**Fix:** Add `aria-disabled="true"` to the coming-soon card.

### 3.3 Print Layouts -- Capture Review Panel Print Missing Videos
In the capture review print layout, videos are filtered out (`m.file_type !== 'video'`), but there is no indication that video content exists. A dealer printing the report might not realise videos were captured.

**Fix:** Add a note in the print layout: "X walkaround video(s) captured -- view in dashboard" when video media exists.

---

## 4. Code Quality and Maintainability

### 4.1 Type Safety -- Excessive `as any` and `as unknown` Casting
Throughout `useCaptureRequest.ts`, every database query result is cast through `as unknown as CaptureRequest`. This suppresses type checking. The root cause is the auto-generated Supabase types not matching the custom TypeScript types.

**Fix:** Align the custom `CaptureRequest` type with the auto-generated Supabase types, or create proper type-safe wrapper functions that map from the database type to the application type.

### 4.2 Edge Function -- `send-capture-link` Uses Deprecated Deno API
The send-capture-link function uses `import { serve } from "https://deno.land/std@0.190.0/http/server.ts"` (deprecated), while the dispute-response function correctly uses `Deno.serve()`.

**Fix:** Update `send-capture-link/index.ts` to use `Deno.serve()` for consistency and future-proofing.

### 4.3 CSS File is Very Large (1062 Lines)
`src/index.css` is over 1000 lines with extensive print styles. This makes maintenance difficult.

**Fix:** No immediate action required, but consider extracting print styles into a separate file or using Tailwind `@apply` more consistently in future.

---

## 5. SEO and Content Improvements

### 5.1 OG Image URL Uses Temporary Signed URL
The Open Graph image in `index.html` uses a Google Cloud Storage signed URL with an expiry (`Expires=1771179257`). Once this expires (February 2026), social media previews will break.

**Fix:** Host the OG image permanently at `/og-image.png` or another stable URL and update the meta tags.

### 5.2 FAQ Schema Missing Remote Capture Answer Update
The FAQ schema in the JSON-LD (line 160) still references "three tools" in the first answer, even though the visible FAQ text on the page has been updated to four. The schema and page content are out of sync.

**Fix:** Update the FAQPage JSON-LD `acceptedAnswer` for "What are the AutoProv Compliance Tools?" to reference all four tools.

### 5.3 Canonical URL Points to autexa.ai but Published URL is lovable.app
The canonical URL is `https://autexa.ai/` but the live published URL is `https://my-pdi-pro.lovable.app`. If autexa.ai is not yet set up as a custom domain, search engines may encounter a mismatch.

**Fix:** Verify that `autexa.ai` is configured as a custom domain. If not, temporarily update the canonical to the published URL, or set up the custom domain.

---

## 6. Performance

### 6.1 Capture Review Panel -- Sequential Signed URL Loading
In `CaptureReviewPanel.tsx`, signed URLs are loaded sequentially in a `for` loop (line 44). For captures with many images, this creates a waterfall effect.

**Fix:** Use `Promise.all()` to load all signed URLs in parallel.

---

## Implementation Sequence

1. **Quick wins** (items 1.2, 2.2, 2.3, 3.2, 4.2, 5.2): Simple fixes, high impact, low risk
2. **UX improvements** (items 1.1, 1.3, 1.4, 1.6, 3.1, 3.3): Better user experience
3. **Functional fixes** (items 1.5, 2.1, 6.1): Reliability and performance
4. **Technical debt** (items 4.1, 5.1, 5.3): Long-term maintainability

---

## Technical Details

### Files to Modify

| File | Changes |
|---|---|
| `src/pages/Landing.tsx` | Add nav bar, expand footer, improve FAQ with accordion, add aria-disabled |
| `src/pages/Index.tsx` | Add autosave, add "New Report" reset button |
| `src/pages/NotFound.tsx` | Rebrand to match AutoProv styling |
| `src/pages/SellerCapture.tsx` | Fix canAdvance() validation logic |
| `src/pages/RemoteCapture.tsx` | Add refetchInterval to queries |
| `src/hooks/useCaptureRequest.ts` | Add auto-expiry logic, improve type safety, parallel URL loading |
| `src/hooks/usePDIForm.ts` | Add localStorage persistence |
| `src/components/capture/CaptureReviewPanel.tsx` | Parallel signed URL loading, video note in print |
| `src/components/capture/CreateCaptureModal.tsx` | Pre-fill dealer details from localStorage |
| `src/components/capture/CaptureRequestCard.tsx` | Fix "Email resent" toast text |
| `supabase/functions/send-capture-link/index.ts` | Migrate to Deno.serve() |
| `index.html` | Fix FAQ schema, fix OG image URL |

