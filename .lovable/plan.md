

# Remote Appraisal and Vehicle Capture Tool — Implementation Plan

## Overview

Build a structured, mobile-first remote vehicle inspection capture system within AutoProv. Dealers create capture requests with configurable steps, generate secure tokenised links, and sellers complete a guided media capture flow on their mobile device. Submitted media is stored securely and made available to the dealer for manual review.

No authentication is required for Phase 1 (MVP). No valuation or pricing logic will be included.

---

## What Gets Built

### 1. Database Tables (5 tables)

**capture_requests** — stores each capture request created by a dealer
- id (UUID, primary key)
- token (unique string for the public link)
- dealer_name, dealer_email (text)
- seller_name (required), seller_email, seller_phone
- vehicle_registration, vehicle_vin
- internal_notes
- expires_at (timestamp)
- required_steps (JSONB — which capture steps are toggled on)
- status (enum: pending, in_progress, completed, expired, archived)
- created_at

**capture_submissions** — stores the seller's completed submission
- id (UUID, primary key)
- capture_request_id (FK)
- declaration_name (text)
- declaration_confirmed (boolean)
- submitted_at (timestamp)
- ip_address, user_agent, device_type (text)
- no_damage_confirmed (boolean)

**capture_media** — stores references to uploaded files
- id (UUID, primary key)
- capture_request_id (FK)
- submission_id (FK)
- step (text — e.g. "exterior_front", "interior_dashboard")
- file_path (text — path in storage bucket)
- file_type (text — image/video)
- file_size (integer)
- uploaded_at (timestamp)

**capture_notes** — dealer internal notes added during review
- id (UUID, primary key)
- capture_request_id (FK)
- note_text (text)
- created_at

**capture_status_log** — tracks status changes for audit
- id, capture_request_id, old_status, new_status, changed_at

All tables will have RLS disabled for the MVP (no auth), with a plan to add policies when authentication is introduced.

### 2. Storage Bucket

A private **capture-media** storage bucket for all uploaded images and videos. Public read access via signed URLs only. File size limits enforced (images max 10MB, videos max 50MB).

### 3. New Pages and Routes

| Route | Purpose |
|---|---|
| `/remote-capture` | Dealer dashboard — create, view, manage capture requests |
| `/capture/:token` | Public seller capture interface — guided mobile flow |

### 4. Edge Function

**send-capture-link** — sends the capture link to the seller's email using Resend. This requires a `RESEND_API_KEY` secret from the user. Copy-link functionality works immediately without this.

### 5. Landing Page Update

Add "Remote Capture" as a new active tool card on the landing page, with the Camera icon, linking to `/remote-capture`.

---

## Dealer Dashboard (`/remote-capture`)

Three tabs: **Active**, **Completed**, **Archived**

### Create New Capture Request (modal/form)
- Seller Name (required), Email, Phone
- Vehicle Registration, VIN
- Internal Notes
- Link Expiry selector (24h / 48h / 72h / Custom date)
- Toggleable capture steps: Exterior Photos, Damage Close-ups, Interior Photos, Dashboard (Ignition On), VIN Plate, Tyre Tread Photos, Service History, Walkaround Video
- "Generate Secure Link" button

### Request List View
- Card-based layout showing seller name, vehicle ref, status badge, expiry countdown
- Click to open detailed review

### Dealer Review Interface
- Structured media sections: Exterior, Damage, Interior, Dashboard, VIN, Tyres, Video
- Download individual files or full ZIP (via edge function)
- Add internal notes
- Set status: Approved / Further Review / Reject / Negotiate
- Generate structured PDF summary (browser print-to-PDF, matching existing PDI pattern)

---

## Seller Capture Interface (`/capture/:token`)

White background, large buttons, mobile-first. No login required.

### Flow (9 steps, only enabled steps shown):

1. **Introduction** — dealer name, vehicle ref, authorisation confirmation checkbox
2. **Exterior Capture** — front/rear/left/right with camera overlay guidance, retake option
3. **Damage Disclosure** — upload damage photos OR confirm "No visible damage"
4. **Interior Capture** — driver seat, passenger seat, rear seats, dashboard, centre console
5. **Dashboard Capture** — ignition on, odometer visible, warning lights visible
6. **VIN Plate** — capture with location guidance text
7. **Tyre Tread** — each tyre close-up (if enabled)
8. **Walkaround Video** — 30-60 second video with guidance (if enabled)
9. **Seller Declaration** — typed full name, auto-generated date/timestamp, confirmation checkbox, disclaimer text

Progress bar shown throughout. Steps cannot be skipped. Retake available before confirming each capture.

### Expiry Enforcement
- Token validated on page load
- Expired links show a clear "This link has expired" message
- No uploads accepted after expiry

---

## Technical Architecture

```text
+-------------------+       +------------------+       +-------------------+
|  Dealer Dashboard |       |   Database       |       | Seller Capture UI |
|  /remote-capture  |------>| capture_requests |<------| /capture/:token   |
|                   |       | capture_media    |       |                   |
|  Create request   |       | capture_submissions      |  Upload media     |
|  Review media     |       +------------------+       |  Declaration      |
|  Set status       |              |                   +-------------------+
+-------------------+              v
                           +------------------+
                           | Storage Bucket   |
                           | capture-media    |
                           +------------------+
```

### File Structure (new files)

```text
src/pages/RemoteCapture.tsx              — dealer dashboard page
src/pages/SellerCapture.tsx              — public seller capture page
src/components/capture/
  CreateCaptureModal.tsx                 — new request form
  CaptureRequestCard.tsx                 — list item card
  CaptureReviewPanel.tsx                 — dealer review interface
  SellerStep*.tsx (9 files)             — one per capture step
  CaptureProgressBar.tsx                 — step progress indicator
  CameraCapture.tsx                      — camera/file input with overlay
  CapturePrintLayout.tsx                 — PDF print layout
src/types/capture.ts                     — TypeScript types
src/hooks/useCaptureRequest.ts           — data fetching hooks
supabase/functions/send-capture-link/index.ts  — email sending
```

### Key Design Decisions

- **No auth for MVP**: All capture requests are stored without a dealer user ID. When auth is added later, a `dealer_id` column will be added and linked
- **Token security**: UUIDs used as tokens, validated server-side, with expiry enforcement
- **Media upload**: Direct to storage bucket using the Supabase JS client, with file type and size validation on the client
- **Existing patterns followed**: Step-based wizard UI (matching Dispute Response Builder), card-based dashboard layout (matching Landing page), print-to-PDF approach (matching PDI tool)
- **AutoProv dark theme** for dealer interface, white clean theme for seller interface
- **Disclaimers included**: "This remote capture does not replace a physical inspection" shown in seller flow

### Email Sending Note

The "send via email" feature requires a Resend API key. You will be asked to provide this during implementation. The copy-link feature works without any additional setup.

---

## Implementation Sequence

1. Database migration — create all tables and storage bucket
2. TypeScript types and hooks
3. Seller capture interface (public flow — the core product)
4. Dealer dashboard (create requests, review submissions)
5. Landing page update (add tool card)
6. Email sending edge function (requires Resend API key)
7. PDF print layout for dealer review

---

## What Is NOT Included

- No AI valuation or pricing engine
- No automatic damage detection
- No OCR mileage extraction
- No third-party API integrations
- No authentication (deferred to future phase)
- No virus scanning (deferred — file type validation only)
- No ZIP download (deferred — individual file download only in Phase 1)

