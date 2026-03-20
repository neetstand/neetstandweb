import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { sendPurchaseSuccessEmail } from "@/lib/email/brevo";

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, planPricingId } = await req.json();

        if (!process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch pricing to get mrp, paid price, and plan duration
        const { data: planPricingDoc, error: pricingErr } = await supabase
            .from("plan_pricing")
            .select("*, plans(*)")
            .eq("id", planPricingId)
            .single();

        if (!planPricingDoc || pricingErr) {
            return NextResponse.json({ error: 'Invalid plan or pricing selected' }, { status: 400 });
        }

        const durationDays = planPricingDoc.plans.duration_days;

        // Atomic Transaction: Execute the stored procedure
        const { error: rpcError } = await supabase.rpc('process_payment_success', {
            p_user_id: user.id,
            p_razorpay_order_id: razorpay_order_id,
            p_razorpay_payment_id: razorpay_payment_id,
            p_razorpay_signature: razorpay_signature,
            p_plan_id: planId,
            p_plan_pricing_id: planPricingId,
            p_mrp_price: planPricingDoc.mrp_price,
            p_paid_price: planPricingDoc.offer_price,
            p_duration_days: durationDays
        });

        if (rpcError) {
            console.error("Payment transaction failed:", rpcError);
            return NextResponse.json({ error: 'Failed to process payment successfully', details: rpcError }, { status: 500 });
        }

        // Send Email Asynchronously inside route execution
        const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";
        const emailToUse = user.email || user.user_metadata?.email;
        
        if (emailToUse) {
            // Fetch email settings from database instead of env
            const { data: settingsData } = await supabase
                .from("settings")
                .select("variable, value")
                .in("variable", ["email_api_key", "email_provider_url"]);

            let emailApiKey = "";
            let emailProviderUrl = "";

            if (settingsData) {
                const keySetting = settingsData.find(s => s.variable === "email_api_key");
                const urlSetting = settingsData.find(s => s.variable === "email_provider_url");
                if (keySetting && keySetting.value) emailApiKey = keySetting.value;
                if (urlSetting && urlSetting.value) emailProviderUrl = urlSetting.value;
            }

            if (emailApiKey && emailProviderUrl) {
                // "void" indicates we're purposefully not waiting so the response doesn't hang.
                // On standard Vercel lambdas, long-running promises without await might get killed,
                // but for simple fetch it usually succeeds within the buffer period before sleep.
                await sendPurchaseSuccessEmail({
                    toEmail: emailToUse,
                    toName: userName,
                    planName: planPricingDoc.plans.plan_name,
                    paidPrice: planPricingDoc.offer_price,
                    mrpPrice: planPricingDoc.mrp_price,
                    durationDays: durationDays,
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    apiKey: emailApiKey,
                    apiUrl: emailProviderUrl,
                }).catch(e => console.error("Email promise rejected:", e));
            } else {
                console.error("Email API key or provider URL missing from database settings. Skipping email.");
            }
        }

        revalidatePath("/", "layout");

        return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } catch (err: unknown) {
        console.error("Payment verification error:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: 'Verification failed', details: errorMessage }, { status: 500 });
    }
}
