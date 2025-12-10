import nodemailer from "nodemailer";
import * as fs from "fs";
import * as path from "path";

const {
	SMTP_HOST,
	SMTP_PORT,
	SMTP_USER,
	SMTP_PASS,
	EMAIL_FROM,
	APP_BASE_URL,
} = process.env as Record<string, string | undefined>;

const baseUrl = APP_BASE_URL || "http://localhost:5173";

const transporter = SMTP_HOST && SMTP_USER && SMTP_PASS
	? nodemailer.createTransport({
		host: SMTP_HOST,
		port: SMTP_PORT ? Number(SMTP_PORT) : 587,
		secure: false,
		auth: { user: SMTP_USER, pass: SMTP_PASS },
	})
	: null;

export async function sendVerificationEmail(
	email: string,
	name: string,
	token: string
): Promise<void> {
	const verifyUrl = `${baseUrl}/verify?token=${encodeURIComponent(token)}`;
	
	// Create logs directory if it doesn't exist
	const logsDir = path.join(process.cwd(), "logs");
	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true });
	}
	
	// Write URL to file synchronously for debugging
	const logFile = path.join(logsDir, "verification-emails.log");
	const timestamp = new Date().toISOString();
	const logEntry = `[${timestamp}] Email: ${email}, Token: ${token}, URL: ${verifyUrl}\n`;
	fs.appendFileSync(logFile, logEntry, "utf-8");

	if (transporter) {
		try {
			await transporter.sendMail({
				from: EMAIL_FROM || "no-reply@voco.ee",
				to: email,
				subject: "Kinnita oma konto",
				text: `Tere, ${name}!\n\nKinnitamiseks ava link: ${verifyUrl}\nKui sa ei loonud kontot, siis ignoeri seda kirja.`,
				html: `
					<div>
						<p>Tere, ${name}!</p>
						<p>Konto loomiseks kinnita oma emaili aadress, klikkides allolevat linki:</p>
						<p><a href="${verifyUrl}">${verifyUrl}</a></p>
						<p>Kui sa ei loonud kontot, siis ignoreeri seda kirja.</p>
					</div>
				`,
			});
		} catch (error) {
			console.error(`[EmailService] Failed to send email to ${email}:`, error);
		}
	}
}
