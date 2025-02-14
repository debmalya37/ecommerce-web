// src/lib/sendOtpEmail.ts
import nodemailer from "nodemailer";

export default async function sendOtpEmail(details: { email: string; otp: string }) {
  const { email, otp } = details;

  // Create a transporter using Gmail's SMTP server.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Gmail SMTP server
    port: 587,              // TLS port
    secure: false,          // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER, // Your email address from env
      pass: process.env.EMAIL_PASS, // Your app-specific password from env
    },
  });

  // Construct the email content.
  const emailContent = `
    <h1>OTP Verification</h1>
    <p>Please use the following OTP to reset your password:</p>
    <h2 style="text-align: center;">${otp}</h2>
    <p>This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
  `;

  // Send the email.
  await transporter.sendMail({
    from: process.env.EMAIL_USER, // Sender address
    to: email,                    // Recipient address
    subject: "Your OTP for Password Reset", // Subject line
    html: emailContent,           // HTML content
  });
}
