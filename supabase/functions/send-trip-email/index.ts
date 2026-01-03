import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.13";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
    email: string;
    subject: string;
    html: string;
    pdfBase64?: string;
    tripName: string;
}

const handler = async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { email, subject, html, pdfBase64, tripName }: EmailRequest = await req.json();

        if (!email) {
            throw new Error("Recipient email is required");
        }

        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: Deno.env.get("SMTP_HOST") || "smtp.gmail.com",
            port: Number(Deno.env.get("SMTP_PORT")) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: Deno.env.get("SMTP_USER"),
                pass: Deno.env.get("SMTP_PASS"),
            },
        });

        const attachments = [];
        if (pdfBase64) {
            attachments.push({
                filename: `${tripName.replace(/\s+/g, "_")}_Itinerary.pdf`,
                content: pdfBase64,
                encoding: 'base64',
            });
        }

        console.log(`Sending email to ${email} via Nodemailer...`);

        const info = await transporter.sendMail({
            from: Deno.env.get("SMTP_FROM") || '"DreamWeaver Trips" <no-reply@dreamweaver.com>',
            to: email,
            subject: subject,
            html: html,
            attachments: attachments,
        });

        console.log("Email sent successfully:", info.messageId);

        return new Response(JSON.stringify({ message: "Email sent", messageId: info.messageId }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
};

serve(handler);
