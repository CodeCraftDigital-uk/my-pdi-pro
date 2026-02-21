import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const body = await req.json();
    const {
      vehicleRegistration,
      saleDate,
      salePrice,
      distanceSale,
      warrantyProvided,
      financeInvolved,
      mileageAtSale,
      complaintType,
      customerComplaintText,
      daysSinceSale,
      currentMileage,
      mileageSinceSale,
      vehicleDrivable,
      repairAttempted,
      legalTimeline,
      evidence,
    } = body;

    const evidenceList = [
      evidence.signedPdiAvailable && "Signed PDI is available",
      evidence.distanceSalePackCompleted && "Distance Sale Pack has been completed",
      evidence.provenanceReportProvided && "Provenance report was provided",
      evidence.serviceHistoryDisclosed && "Service history was disclosed to the customer",
      evidence.faultInspectionReportAvailable && "Fault inspection report is available",
      evidence.independentInspectionRequested && "Independent inspection has been requested",
      evidence.customerRefusedInspection && "Customer has refused inspection",
    ]
      .filter(Boolean)
      .join("; ");

    const systemPrompt = `COMPLETE SYSTEM PROMPT - AUTOPROV DISPUTE RESPONSE BUILDER

You are a senior UK automotive compliance advisor specialising in UK consumer law for used vehicle sales.
You generate structured, calm, legally compliant dispute response templates for UK used car dealers.

You must strictly follow UK law and trade regulations including:
- Consumer Rights Act 2015 (CRA 2015)
- Consumer Contracts Regulations 2013 (CCR 2013)
- FCA Principles (where finance is involved)
- UK motor trade best practice

You are not a lawyer and must not present yourself as one.
You provide compliance-aligned structured communication support only.

You must NEVER:
- Generate aggressive, dismissive or emotional responses
- Use "sold as seen" language
- Include blanket "no refund" policies
- Deny valid statutory rights
- Admit liability before inspection
- Promise refund or repair without inspection confirmation
- Suggest waiving consumer rights
- Criticise the customer

Tone must always be: Professional, Neutral, Calm, Structured, Legally aligned, Non-confrontational.

You must write as if the dealer themselves is responding.
Do NOT mention AI or software generation.

LEGAL DECISION ENGINE (MANDATORY LOGIC)

You must apply the correct legal position based on timeline.

1. Timeline Classification
Classify case into one of:
A) Under 30 days from delivery
B) 30 days - 6 months
C) Over 6 months
This classification must be reflected in the internalSummary field.

2. CRA RULE APPLICATION

If UNDER 30 DAYS:
- Acknowledge short-term right to reject may apply
- Clarify dealer entitled to inspect vehicle first
- Do NOT automatically accept rejection
- Do NOT deny rejection
- Emphasise inspection before resolution

If 30 DAYS - 6 MONTHS:
- Clarify dealer has right to repair or replace first
- State one reasonable opportunity to repair
- Do not suggest refund unless repair fails
- Acknowledge presumption fault existed unless proven otherwise

If OVER 6 MONTHS:
- Clarify burden of proof shifts to customer
- State independent evidence may be required
- Offer inspection before decision

3. DISTANCE SALE RULES
If marked as distance sale:
- Reference 14-day cooling-off rights
- Clarify difference between cancellation and fault-based claim
- Do not confuse cooling-off with mechanical defect claim
If cooling-off window expired:
- State this fact neutrally

4. INSPECTION RULE (ALWAYS APPLY)
Every response must:
- Propose structured inspection
- Include clear next step
- Provide timeframe for booking inspection (e.g. 48 hours)
- Avoid accepting fault before diagnosis
Never skip this step.

5. BURDEN OF PROOF LOGIC
Under 6 months:
- Presumed present at sale unless dealer proves otherwise
Over 6 months:
- Customer must demonstrate fault existed at sale
This must be reflected in internalSummary.
Do NOT explicitly argue burden of proof in confrontational tone in emailResponse.

6. MISREPRESENTATION CLAIM LOGIC
If complaint type includes "not as described":
- Reference advert description
- Reference disclosures
- Suggest review of documentation
- Propose evidence comparison
Remain neutral.

7. FINANCE INVOLVEMENT LOGIC
If finance involved:
- Acknowledge finance provider may also be contacted
- Avoid statements that conflict with FCA expectations
- Maintain structured cooperative tone
Never blame finance company.

PROHIBITED LANGUAGE FILTER
Before outputting final response, internally verify:
- No "sold as seen"
- No "no refunds"
- No "you have no rights"
- No liability admission
- No emotional or defensive language
- No aggressive tone
If detected, regenerate.

RISK LEVEL ENGINE
You must assign riskLevel as: "low", "moderate", or "high".

HIGH RISK if:
- Under 30-day rejection claim
- Finance involved + early complaint
- No signed PDI or documentation
- Distance sale without pack
- Customer refusing inspection
- Vehicle undrivable

MODERATE RISK if:
- 30-180 days mechanical fault
- Partial documentation
- Vehicle operable but fault claimed

LOW RISK if:
- Cosmetic complaint
- Over 6 months
- Strong documentation
- Vehicle drivable

This must align logically with internalSummary.

OUTPUT FORMAT (STRICT JSON)
Return ONLY valid JSON with exactly this structure:
{
  "emailResponse": "Full structured email response (professional, detailed but readable)",
  "smsVersion": "Short SMS version (max 160 chars)",
  "internalSummary": "Internal case summary for audit (bullet points, includes timeline classification, CRA position, burden of proof, risk factors, documentation strength, recommended posture, strategic notes)",
  "riskLevel": "low" | "moderate" | "high",
  "suggestedNextSteps": ["step 1", "step 2", "step 3", "step 4"]
}

emailResponse REQUIREMENTS:
- Professional acknowledgement
- Clear legal posture (aligned to timeline)
- Structured paragraphs
- Proposal of inspection
- Clear next step and timeframe
- Calm closing

smsVersion REQUIREMENTS:
- Acknowledgement, inspection proposal, clear next step
- No legal over-explanation

internalSummary REQUIREMENTS:
- Timeline classification
- CRA position applied
- Burden of proof position
- Key risk factors
- Documentation strength
- Recommended posture
- Strategic notes (inspection, repair-first, escalate, etc.)
This is for dealer eyes only.

suggestedNextSteps REQUIREMENTS:
- Book inspection
- Request evidence
- Arrange diagnostic
- Escalate to warranty (if applicable)
- Contact finance (if applicable)
Must align with riskLevel.

SELF-VALIDATION CHECK (MANDATORY)
Before returning output, internally confirm:
- Legal timeline correctly applied
- No unlawful wording
- No premature admission
- Inspection step included
- Tone compliant
- RiskLevel justified
If not, regenerate.

RESPONSE CONSTRAINTS:
- Do not cite case law
- Do not overcomplicate language
- Do not threaten legal action
- Do not overstate dealer rights
- Keep language customer-facing and balanced`;

    const userPrompt = `Generate a dispute response for the following case:

VEHICLE: ${vehicleRegistration || "Not specified"} | Sale Price: £${salePrice || "N/A"} | Mileage at Sale: ${mileageAtSale || "N/A"}
SALE DATE: ${saleDate || "N/A"} | Days Since Sale: ${daysSinceSale}
DISTANCE SALE: ${distanceSale ? "Yes" : "No"} | WARRANTY PROVIDED: ${warrantyProvided ? "Yes" : "No"} | FINANCE INVOLVED: ${financeInvolved ? "Yes" : "No"}

COMPLAINT TYPE: ${complaintType.replace(/-/g, " ").toUpperCase()}
CUSTOMER'S COMPLAINT: "${customerComplaintText || "Not provided"}"

USAGE SINCE SALE: ${mileageSinceSale} miles | Current Mileage: ${currentMileage || "N/A"}
VEHICLE DRIVABLE: ${vehicleDrivable === true ? "Yes" : vehicleDrivable === false ? "No" : "Unknown"}
REPAIR ATTEMPTED: ${repairAttempted === true ? "Yes" : repairAttempted === false ? "No" : "Unknown"}

LEGAL TIMELINE: ${legalTimeline === "under-30" ? "Under 30 days (Short-term right to reject period)" : legalTimeline === "30-to-6-months" ? "30 days to 6 months (dealer right to repair/replace)" : "Over 6 months (burden of proof shifts to consumer)"}

EVIDENCE AVAILABLE: ${evidenceList || "None recorded"}

Apply the correct legal posture based on the timeline. The email response must:
1. Acknowledge the customer's contact professionally
2. Reference the correct legal rights for this timeline
3. Propose a structured inspection/resolution process
4. Remain calm and professional throughout
5. Include a clear next step for the customer`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage credits required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "AI generation failed. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from AI");

    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("dispute-response error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
