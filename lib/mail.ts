import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;
const onboardingEmail = process.env.ONBOARDING_EMAIL;

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/confirm-email?token=${token}`;

  console.log(`Click <a href="${confirmLink}">here</a> to confirm email.`);

  // await resend.emails.send({
  //   from: onboardingEmail,
  //   to: email,
  //   subject: "Confirm your email",
  //   html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  // });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/reset-password?token=${token}`;

  console.log(`Click <a href="${resetLink}">here</a> to reset password.`);

  // await resend.emails.send({
  //   from: onboardingEmail,
  //   to: email,
  //   subject: "Reset your password",
  //   html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  // });
};
