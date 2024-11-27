import { Resend } from "resend";
import verificationEmail from "../../emails/verificationEmail";
import { apiResponse } from "@/types/apiResponse";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<apiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "NoCap Message Verification Code",
      react: verificationEmail({ username, otp }),
    });
    return {
      success: false,
      message: "Verification email sent successfully",
      statusCode: 500,
    };
  } catch (error) {
    console.log("Error sending verification email", error);
    return {
      success: false,
      message: "Failed to send verification email",
      statusCode: 500,
    };
  }
}
