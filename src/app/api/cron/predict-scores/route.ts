import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculatePredictionForUser, PredictionStage } from "@/lib/prediction-engine";

export const maxDuration = 300; // Allow max duration for cron tasks if on Vercel Pro

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        // Basic authorization check (Optional depending on cron setup)
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', { status: 401 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: users, error: userError } = await supabase
            .from("profiles")
            .select("id, created_at");

        if (userError || !users) {
            return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
        }

        const now = new Date();
        let totalProcessed = 0;
        let totalInserted = 0;

        for (const user of users) {
            if (!user.created_at) continue;
            
            const userDays = Math.floor((now.getTime() - new Date(user.created_at).getTime()) / (1000 * 3600 * 24));
            
            if (userDays < 5) continue; // Not eligible for any stage yet

            const { data: existingPreds } = await supabase
                .from("score_predictions")
                .select("stage")
                .eq("user_id", user.id);
            
            const existingSet = new Set(existingPreds?.map(p => p.stage) || []);
            const stagesToCompute: { stage: PredictionStage; days: number }[] = [];

            if (userDays >= 5 && !existingSet.has("S1")) stagesToCompute.push({ stage: "S1", days: 5 });
            if (userDays >= 10 && !existingSet.has("S2")) stagesToCompute.push({ stage: "S2", days: 10 });
            if (userDays >= 20 && !existingSet.has("S3")) stagesToCompute.push({ stage: "S3", days: 20 });
            if (userDays >= 30 && !existingSet.has("S4")) stagesToCompute.push({ stage: "S4", days: 30 });

            if (stagesToCompute.length === 0) continue;

            totalProcessed++;

            // For each applicable stage, compute and insert.
            // Note: In reality "data collected up to that point" means as of today, 
            // since we don't have historical snapshots of questions. This runs forward natively.
            for (const st of stagesToCompute) {
                const prediction = await calculatePredictionForUser(supabase, user.id, st.stage, st.days);
                
                if (prediction) {
                    const { error: insErr } = await supabase.from("score_predictions").insert({
                        user_id: prediction.userId,
                        stage: prediction.stage,
                        days_covered: prediction.daysCovered,
                        predicted_lower: prediction.predictedLower,
                        predicted_upper: prediction.predictedUpper,
                        confidence_score: prediction.confidenceScore
                    });

                    if (!insErr) {
                        totalInserted++;
                    } else {
                        console.error(`Failed to insert prediction for user ${user.id} stage ${st.stage}`, insErr);
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Cron completed successfully. Processed ${totalProcessed} users, inserted ${totalInserted} new predictions.`
        });

    } catch (error: any) {
        console.error("Cron predict errors error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
