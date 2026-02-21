

# Update Dispute Response Builder System Prompt

## Summary

Replace the existing system prompt in the dispute response edge function with the comprehensive new prompt provided. This is a single-file change.

## What Changes

**File:** `supabase/functions/dispute-response/index.ts`

The `systemPrompt` variable (currently ~30 lines) will be replaced with the full new prompt covering:

- Expanded legal decision engine with timeline-based CRA rule application
- Distance sale rules with cooling-off period logic
- Mandatory inspection step in every response
- Burden of proof logic (under/over 6 months)
- Misrepresentation claim handling
- Finance involvement logic
- Prohibited language filter (no "sold as seen", no blanket refusals)
- Structured risk level engine with explicit HIGH/MODERATE/LOW criteria
- Detailed output format requirements for all five JSON fields
- Self-validation check before returning output

The output JSON format remains identical (`emailResponse`, `smsVersion`, `internalSummary`, `riskLevel`, `suggestedNextSteps`), so no frontend changes are needed.

## Technical Detail

- Only the `systemPrompt` constant string changes — no other code in the edge function is modified
- The user prompt, API call structure, error handling, and response parsing all remain the same
- The emoji characters in the prompt will be stripped to keep the prompt clean for the AI model — section headers will use plain text labels instead (e.g., "LEGAL DECISION ENGINE", "RISK LEVEL ENGINE")

