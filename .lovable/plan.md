

# Consistent AutoProv Branding on All Print Reports

## Goal

Make it clear on every printed report that:
1. The report was **created by the dealer/business** (they are the author)
2. It was **generated using the AutoProv Platform** (AutoProv is the tool, not the author)

This applies to all three tools: PDI, Distance Sale Pack, and Dispute Response Builder.

---

## Current State

- **PDI print header**: Shows AutoProv icon + "Used Vehicle PDI" but no dealer name. Footer says generic compliance text with no AutoProv branding attribution.
- **DSS print header**: Shows "AutoProv" as if AutoProv created the document. Footer says "AutoProv Digital Distance Sale Pack".
- **DRB print header**: Shows dealer name on the left, AutoProv logo on the right — closest to the desired pattern already. Footer says "AutoProv Dispute Response Builder".

None currently say "Generated using the AutoProv Platform" — they imply AutoProv is the author.

---

## Design Approach

Every print report will follow a consistent layout:

```text
+--------------------------------------------------+
|  [Dealer Name / Business]          [AutoProv Logo]|
|  [Dealer Address / Contact]    Generated using the|
|                                 AutoProv Platform  |
+--------------------------------------------------+
|  REPORT TITLE                                     |
|  Report ID: XXX  |  Date: XX/XX/XXXX              |
+--------------------------------------------------+
```

**Footer on every page:**

```text
This report was generated using the AutoProv Platform (autexa.ai)
It does not represent the views or position of AutoProv.
[Report Type] · [Report/Case/Pack ID] · [Date]
```

---

## Changes by File

### 1. `src/components/pdi/HeaderSection.tsx`
- Add a **dealer name** input field to the PDI form (or at minimum a prop for it)
- Update the **print-only header** to show the dealer/technician name prominently on the left, AutoProv logo + "Generated using the AutoProv Platform" on the right
- Keep the screen header (gradient banner) unchanged

### 2. `src/components/pdi/VehicleDetails.tsx`
- The "Technician Name" and "Sales Executive" fields already exist — the dealer/business identity will come from a new "Dealership Name" field added to this section

### 3. `src/types/pdi.ts`
- Add `dealershipName` to `VehicleDetailsData` interface

### 4. `src/hooks/usePDIForm.ts`
- Initialise the new `dealershipName` field

### 5. `src/pages/Index.tsx` (PDI page)
- Pass `dealershipName` to `HeaderSection` for print display
- Update the print footer text

### 6. `src/components/dss/DSSPrintLayout.tsx`
- Restructure the header: dealer business name on the left (already available from `dealer.businessName`), AutoProv logo + "Generated using the AutoProv Platform" on the right
- Update footer to: "This report was generated using the AutoProv Platform (autexa.ai)"

### 7. `src/components/dispute/DRBPrintLayout.tsx`
- Already has dealer name on the left — update the right side to say "Generated using the AutoProv Platform" beneath the logo
- Update footer to match the same attribution line

### 8. `src/index.css`
- Add/adjust print CSS for the new "generated using" attribution text styling — small, subtle, professional

---

## Key Messaging

The exact wording on every printed report will be:

- **Header (top-right)**: AutoProv logo + "Generated using the AutoProv Platform"
- **Footer**: "This report was generated using the AutoProv Platform (autexa.ai). The content of this report is the responsibility of the issuing business."

This makes it unambiguous that:
- The **dealer** is the author of the report
- **AutoProv** is the tool they used to create it

