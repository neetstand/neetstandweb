import { createAdminClient } from "@/utils/supabase/admin";
import { SignJWT, jwtVerify } from "jose";
import { createHash, randomInt } from "crypto";

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY || "fallback_secret");

interface SendOtpResult {
    success?: boolean;
    token?: string;
    message?: string;
    error?: string;
}

interface VerifyOtpResult {
    success?: boolean;
    actionLink?: string;
    error?: string;
}

export class OtpService {
    static async send(identifier: string, isPhone: boolean): Promise<SendOtpResult> {
        let targetEmail = "";


        try {
            const supabase = createAdminClient();

            if (isPhone) {
                // Find user to get email
                const { data: { users }, error } = await supabase.auth.admin.listUsers();
                if (error) throw error;
                const user = users.find(u => u.phone === identifier);
                if (!user || !user.email) {
                    return { error: "User not found or no email linked to this phone number." };
                }
                targetEmail = user.email;
            } else {
                targetEmail = identifier;
            }

            // Generate OTP
            const otp = randomInt(100000, 999999).toString();
            const otpHash = createHash("sha256").update(otp).digest("hex");

            // Create Token
            const token = await new SignJWT({
                otpHash,
                email: targetEmail,
                phone: isPhone ? identifier : undefined
            })
                .setProtectedHeader({ alg: "HS256" })
                .setIssuedAt()
                .setExpirationTime("5m")
                .sign(JWT_SECRET);

            // Send Email via Database Function
            const { error: fnError } = await supabase.rpc("send_email", {
                to_email: targetEmail,
                subject: "Your Login OTP",
                html_body: `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 5 minutes.</p>`
            });

            if (fnError) {
                console.error("DB Email Error:", fnError);
                throw new Error("Failed to send email");
            }

            // For debugging
            console.log(`[DEV] OTP for ${targetEmail}: ${otp}`);

            return { success: true, token, message: `OTP sent to ${targetEmail}` };

        } catch (error) {
            console.error("Send OTP Error:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to send OTP";
            return { error: errorMessage };
        }
    }

    static async verify(token: string, otp: string): Promise<VerifyOtpResult> {


        try {
            const supabase = createAdminClient();

            // Verify Token
            const { payload } = await jwtVerify(token, JWT_SECRET);
            const { otpHash, email } = payload as { otpHash: string; email: string; phone?: string };

            // Verify OTP
            const inputHash = createHash("sha256").update(otp).digest("hex");
            if (inputHash !== otpHash) {
                return { error: "Invalid Code" };
            }

            const { data, error } = await supabase.auth.admin.generateLink({
                type: "magiclink",
                email: email,
            });

            if (error) throw error;
            if (!data.properties?.action_link) throw new Error("Failed to generate login link");

            return { success: true, actionLink: data.properties.action_link };

        } catch (error) {
            console.error("Verify OTP Error:", error);
            return { error: "Verification failed or expired" };
        }
    }
}
