

# Replace Landing Page with AutoProv Promotional Page

## What Changes

Replace the current tool-launcher landing page with a clean promotional page that explains what AutoProv is and directs visitors to the live platform at **autoprov.ai**.

## Content Structure

The new landing page will include:

1. **Hero Section** -- AutoProv logo, brand name, tagline ("Automotive Compliance Platform for UK Dealers & Traders"), and a prominent "Visit AutoProv.ai" CTA button linking to https://www.autoprov.ai
2. **Features Overview** -- A grid highlighting what AutoProv offers, based on the uploaded image reference:
   - Industry-beating Provenance (HPI) Check
   - FREE Valuation Tool
   - FREE DVSA Linked MOT History Check
   - Service History Lookup Service
   - Vehicle Build & Specification Data
   - FREE VIN Lookup Tool
   - AI Powered Sales Description Generator
   - FREE PDI Tool
   - FREE Digital Distance Sales Pack Generator
   - FREE AI Powered Dispute Response Generator
   - FREE Remote Vehicle Appraisal Tool
3. **Brief "About" paragraph** -- Explains AutoProv is a comprehensive automotive platform for UK dealers
4. **Footer** -- Simple footer with link to autoprov.ai and copyright

## Routing Changes

- Remove all tool routes (`/pdi`, `/distance-sale`, `/dispute-response`, `/remote-capture`, `/capture/:token`) from `App.tsx` since the tools are now live on autoprov.ai
- Keep only the landing page route (`/`) and the 404 catch-all

## Design

- Same dark Steel Blue (#1e3a5f) and Gold (#c9a227) brand palette
- Clean, modern, single-page layout
- Mobile responsive
- All CTAs link externally to https://www.autoprov.ai

## Technical Details

### Files Modified
| File | Change |
|---|---|
| `src/pages/Landing.tsx` | Complete rewrite -- promotional page with features list and external link to autoprov.ai |
| `src/App.tsx` | Remove tool routes, keep only `/` and `*` |

### Files NOT Deleted
The tool page files (`Index.tsx`, `DistanceSale.tsx`, etc.) and their components will remain in the codebase but will be unreachable via routing. They can be cleaned up in a follow-up if desired.

