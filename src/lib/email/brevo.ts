export async function sendPurchaseSuccessEmail({
    toEmail,
    toName,
    planName,
    paidPrice,
    mrpPrice,
    durationDays,
    orderId,
    paymentId,
    apiKey,
    apiUrl
}: {
    toEmail: string;
    toName: string;
    planName: string;
    paidPrice: number;
    mrpPrice: number;
    durationDays: number;
    orderId: string;
    paymentId: string;
    apiKey: string;
    apiUrl: string;
}) {
    if (!apiKey || !apiUrl) {
        console.error("Email API key or URL is not provided. Cannot send email.");
        return;
    }

    const discountPercentage = mrpPrice > paidPrice ? Math.round(((mrpPrice - paidPrice) / mrpPrice) * 100) : 0;
    
    // Website matching theme: gradient sky blue to deep blue, clean typography, rounded cards.
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Your New Learning Journey</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #f8fafc;
                margin: 0;
                padding: 0;
                color: #0f172a;
                -webkit-font-smoothing: antialiased;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            .header {
                background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
                padding: 40px 32px;
                text-align: center;
                color: #ffffff;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
                letter-spacing: -0.025em;
            }
            .header p {
                margin-top: 12px;
                font-size: 16px;
                opacity: 0.9;
                line-height: 1.5;
            }
            .content {
                padding: 40px 32px;
            }
            .greeting {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 24px;
                color: #1e293b;
            }
            .message {
                font-size: 16px;
                line-height: 1.6;
                color: #475569;
                margin-bottom: 32px;
            }
            .card {
                background-color: #f1f5f9;
                border-radius: 12px;
                padding: 24px;
                margin-bottom: 32px;
                border: 1px solid #e2e8f0;
            }
            .card-title {
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                font-weight: 600;
                color: #64748b;
                margin-bottom: 16px;
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 12px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                font-size: 15px;
            }
            .detail-row:last-child {
                margin-bottom: 0;
            }
            .detail-label {
                color: #64748b;
            }
            .detail-value {
                font-weight: 600;
                color: #1e293b;
                text-align: right;
            }
            .price-total {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 1px dashed #cbd5e1;
                font-size: 18px;
                font-weight: 700;
                color: #0ea5e9;
                display: flex;
                justify-content: space-between;
            }
            .button-wrapper {
                text-align: center;
                margin-top: 40px;
                margin-bottom: 16px;
            }
            .button {
                display: inline-block;
                background-color: #0ea5e9;
                color: #ffffff;
                text-decoration: none;
                padding: 14px 32px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                transition: background-color 0.2s;
            }
            .button:hover {
                background-color: #0284c7;
            }
            .footer {
                background-color: #f8fafc;
                padding: 32px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            .footer p {
                margin: 0;
                font-size: 14px;
                color: #64748b;
                line-height: 1.5;
            }
            .brand {
                font-weight: 700;
                color: #0ea5e9;
            }
            .badge {
                display: inline-block;
                background-color: #dcfce7;
                color: #166534;
                padding: 4px 10px;
                border-radius: 9999px;
                font-size: 12px;
                font-weight: 600;
                margin-left: 8px;
                vertical-align: middle;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to NEETstand! 🚀</h1>
                <p>Your subscription to ${planName} is now active.</p>
            </div>
            
            <div class="content">
                <div class="greeting">Hi ${toName || 'Future Doctor'},</div>
                
                <div class="message">
                    Thank you for choosing NEETstand. Your payment has been successfully processed, and your plan is now active. Time to accelerate your NEET preparation!
                </div>
                
                <div class="card">
                    <div class="card-title">Order Details</div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Plan Name:</span>
                        <span class="detail-value">${planName}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value">${durationDays} Days</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Order ID:</span>
                        <span class="detail-value" style="font-family: monospace; font-size: 13px;">${orderId}</span>
                    </div>
                    
                    <div class="detail-row">
                        <span class="detail-label">Payment ID:</span>
                        <span class="detail-value" style="font-family: monospace; font-size: 13px;">${paymentId}</span>
                    </div>
                    
                    <div class="price-total">
                        <span>Total Paid:</span>
                        <span>₹${paidPrice} ${discountPercentage > 0 ? `<span class="badge">Saved ${discountPercentage}%</span>` : ''}</span>
                    </div>
                </div>
                
                <div class="message" style="margin-bottom: 0;">
                    Your personalized dashboard has been updated. You now have immediate access to all the premium videos, practice sessions, and learning materials included in your plan.
                </div>
                
                <div class="button-wrapper">
                    <!-- Assuming the domain points to your SaaS. Typically we would use an env variable for BASE_URL -->
                    <a href="https://neetstand.com/dashboard/ncert-to-neet-30-days" class="button">Go to Dashboard</a>
                </div>
            </div>
            
            <div class="footer">
                <p style="margin-top: 16px;">&copy; 2026 Dhanvid Edutech Pvt. Ltd. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
            },
            body: JSON.stringify({
                sender: { email: "support@neetstand.com", name: "NEETstand Team" },
                to: [{ email: toEmail, name: toName || "Student" }],
                subject: `Welcome to ${planName} | NEETstand`,
                htmlContent: htmlContent,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to send Brevo email:", errorData);
            throw new Error(`Email sending failed with status ${response.status}`);
        }


    } catch (error) {
        console.error("Error sending email:", error);
        // We log it but do not crash the route, so as not to rollback Razorpay/Supabase transactions just because email failed.
    }
}
