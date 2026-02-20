
# Landing Page / Navigation Portal Plan

## Brand Analysis

From the logo (`autoprov_icon.png`), the brand palette is:
- **Steel Blue** (left of shield): `#1e3a5f` to `#2d6aad`
- **Gold/Amber** (right of shield): `#c9a227` to `#b8860b`
- **Silver/Chrome**: accent highlights on the checkmark
- Brand name: **AutoProv** (from `autoprov_icon.png`)

The landing page will use these exact colours to create a cohesive, professional platform portal.

---

## Architecture Change

Currently, `/` goes straight to the PDI form (`Index.tsx`). The new structure will be:

- `/` → New **Landing Page** (`src/pages/Landing.tsx`) — the navigation portal
- `/pdi` → Existing PDI form (renamed route, `Index.tsx` unchanged)
- `App.tsx` updated to add the new route

---

## Landing Page Design

### Layout Structure

```text
┌────────────────────────────────────────────────────────────────┐
│  [Shield Logo]  AutoProv                        [Platform v1]  │  ← Full-width hero header
│  Gradient: steel blue (left) → dark navy (right)               │
│                                                                 │
│  "Your Professional Automotive Compliance Platform"             │
│  "Select a tool below to get started"                          │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                       SELECT A TOOL                            │
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐           │
│  │  [Clipboard Icon]   │    │  [Car Icon]          │           │
│  │  Blue left border   │    │  Gold left border    │           │
│  │                     │    │  (coming soon card)  │           │
│  │  Used Vehicle PDI   │    │  Vehicle Valuation   │           │
│  │  Compliance &       │    │  (Coming Soon)       │           │
│  │  Condition Report   │    │                      │           │
│  │                     │    │                      │           │
│  │  [Launch Tool →]    │    │  [Notify Me]         │           │
│  └─────────────────────┘    └─────────────────────┘           │
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐           │
│  │  [FileText Icon]    │    │  [Plus Icon]         │           │
│  │  Service History    │    │  More tools          │           │
│  │  (Coming Soon)      │    │  coming soon...      │           │
│  └─────────────────────┘    └─────────────────────┘           │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  AutoProv Platform  ·  Professional Automotive Compliance       │  ← Footer
│  Consumer Rights Act 2015 Compliant                            │
└────────────────────────────────────────────────────────────────┘
```

### Tool Cards Design

**Active card (Used Vehicle PDI)**:
- White background, `shadow-md`, rounded-xl border
- Left accent border in steel blue (`border-l-4 border-blue-600`)
- Icon in a blue-tinted circular badge
- Title, description, "Active" green badge
- Prominent "Launch Tool →" CTA button in brand blue
- Hover: lifts with `shadow-xl`, slight scale up (`scale-[1.02]`)

**Coming Soon cards**:
- Same card structure but muted/greyed out
- Amber/gold left accent border
- "Coming Soon" badge instead of "Active"
- Disabled "Notify Me" button (outline style)
- Slight opacity reduction to distinguish from active

### Hero Section

- Full-width gradient background: `from-[#1a3558] via-[#1e3f6b] to-[#0f2240]`
- Gold decorative accent line or subtle pattern overlay
- Large logo (96x96px) with a glowing/shadow effect
- Platform name **"AutoProv"** in large white bold text
- Tagline: *"Professional Automotive Compliance Platform"*
- Subtle animated gradient shimmer on the gold accent elements

### Stats/Trust Bar (below hero)

A thin bar showing platform credibility:
- "Consumer Rights Act 2015 Compliant"
- "Professional PDI Reports"
- "Trusted by Automotive Professionals"

---

## Files to Create / Modify

### New File: `src/pages/Landing.tsx`

The complete landing page component including:
- Hero header section with logo, title, tagline
- Tool card grid (responsive: 1 col mobile, 2 col tablet+)
- Trust/stats bar
- Footer strip

### Modified: `src/App.tsx`

Add a new route:
```
Route path="/"    → Landing (new)
Route path="/pdi" → Index (existing PDI form)
```

### No changes to:
- `src/pages/Index.tsx` (PDI form — untouched)
- All PDI components — untouched
- All print styles — untouched
- `src/index.css` — no changes needed (Landing uses Tailwind utility classes only)

---

## Colour Tokens Used

| Element | Colour |
|---|---|
| Hero background | `#1a3558` → `#0f2240` gradient |
| Gold accent (logo shimmer, active badge borders) | `#c9a227` |
| Active tool card left border | `border-blue-600` |
| Coming soon card left border | `border-amber-400` |
| Launch button | `bg-[#1e3a5f]` with `hover:bg-[#2d5a9e]` |
| Card background | `bg-white` with `shadow-md` |
| Page background | `bg-slate-50` |

---

## Responsive Behaviour

- **Mobile**: Single column card grid, hero text scales down, logo centred
- **Tablet (md)**: 2-column card grid
- **Desktop (lg+)**: 2-column or 3-column card grid with max-width container

---

## Navigation Flow

When a user lands on the site they will see the portal. Clicking "Launch Tool →" on the PDI card navigates to `/pdi`. The existing PDI header retains its back-button or the user can navigate back via the browser.

Optionally, a small "← Back to Portal" link can be added at the top of the PDI page (non-printing) so users can return to the landing page without using the browser back button.

