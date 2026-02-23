import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SendCaptureEmailRequest {
  sellerName: string;
  sellerEmail: string;
  captureUrl: string;
  dealerName?: string;
  vehicleRef?: string;
  expiresAt: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(apiKey);
    const {
      sellerName,
      sellerEmail,
      captureUrl,
      dealerName,
      vehicleRef,
      expiresAt,
    }: SendCaptureEmailRequest = await req.json();

    if (!sellerEmail || !captureUrl) {
      return new Response(
        JSON.stringify({ error: "sellerEmail and captureUrl are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const expiryDate = new Date(expiresAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const dealerLine = dealerName ? `<p style="font-size:14px;color:#333;margin:0 0 8px;">From: <strong>${dealerName}</strong></p>` : "";
    const vehicleLine = vehicleRef ? `<p style="font-size:14px;color:#333;margin:0 0 8px;">Vehicle: <strong>${vehicleRef}</strong></p>` : "";

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a3558,#1e3f6b);padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">AutoProv</h1>
          <p style="margin:6px 0 0;color:#c9a227;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;">Remote Vehicle Capture</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px;">
          <h2 style="margin:0 0 16px;color:#1a3558;font-size:18px;font-weight:700;">Hello ${sellerName},</h2>
          <p style="font-size:14px;color:#555;line-height:1.6;margin:0 0 20px;">
            You've been invited to complete a remote vehicle inspection. Please use the link below to capture photos and information about your vehicle.
          </p>

          ${dealerLine}
          ${vehicleLine}

          <div style="text-align:center;margin:28px 0;">
            <a href="${captureUrl}" style="display:inline-block;background:#1e3a5f;color:#ffffff;font-size:15px;font-weight:600;padding:14px 36px;border-radius:8px;text-decoration:none;">
              Start Vehicle Capture
            </a>
          </div>

          <p style="font-size:12px;color:#999;text-align:center;margin:0 0 12px;">
            This link expires on ${expiryDate}
          </p>

          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">

          <p style="font-size:11px;color:#aaa;line-height:1.5;margin:0;">
            This remote capture does not replace a physical inspection. No valuation or guarantee of purchase is implied. If you did not expect this email, please disregard it.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: dealerName ? `${dealerName} via AutoProv <support@autoprov.ai>` : "AutoProv <support@autoprov.ai>",
      to: [sellerEmail],
      subject: `Vehicle Capture Request${dealerName ? ` from ${dealerName}` : ""}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data?.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-capture-link:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
