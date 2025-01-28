import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Gmail SMTP server
      port: 587, // TLS port
      secure: false, // Use STARTTLS
      auth: {
        user: "debmalyasen37@gmail.com", // Replace with your email address
        pass: "mtog xezl xlsb xyaz", // Replace with your app-specific password
      },
    });

    // Email content
    const mailOptions = {
      from: `"${name}" <${email}>`, // Sender details
      to: "debmalyasen37@gmail.com", // Replace with your recipient email address
      subject: subject,
      text: message,
      html: `
        <h3>Contact Us Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
