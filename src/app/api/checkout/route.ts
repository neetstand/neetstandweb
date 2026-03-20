import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount, planName, planId, planPricingId } = await req.json();

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json({ error: 'Razorpay keys not configured' }, { status: 500 });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!
        });

        const options = {
            amount: amount * 100, // amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: user.id,
                planName
            }
        };

        const order = await razorpay.orders.create(options);

        // Log the order intent in our database via an atomic transaction
        const { error: rpcError } = await supabase.rpc("create_razorpay_order", {
            p_user_id: user.id,
            p_plan_id: planId,
            p_plan_pricing_id: planPricingId,
            p_razorpay_order_id: order.id.toString(),
            p_amount: Number(order.amount),
            p_currency: "INR"
        });

        if (rpcError) {
            console.error("Failed to track Razorpay order intent locally:", rpcError);
        }

        return NextResponse.json({
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (err: any) {
        console.error("Error creating Razorpay order:", err);
        return NextResponse.json({ error: 'Error creating order', details: err.message }, { status: 500 });
    }
}
