import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const details = await req.json();
    const { userDetails, transactionId, products, totalAmount } = details;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "debmalyasen37@gmail.com", // Replace with your email
        pass: "mtog xezl xlsb xyaz", // Replace with your app password
      },
    });

    const productDetails = products
      .map(
        (product: any) =>
          `${product.name} - ₹${product.price} x ${product.quantity} = ₹${
            product.price * product.quantity
          }`
      )
      .join("\n");

    const emailContent = `
      <h1>Payment Confirmation</h1>
      <p>Thank you for your purchase! Here are the details:</p>
      <h3>User Details:</h3>
      <p><strong>Name:</strong> ${userDetails.fullName}</p>
      <p><strong>Email:</strong> ${userDetails.email}</p>
      <p><strong>Phone:</strong> ${userDetails.phone}</p>
      <p><strong>Address:</strong> ${userDetails.address}</p>
      <p><strong>Pincode:</strong> ${userDetails.pincode}</p>
      <h3>Transaction ID:</h3>
      <p>${transactionId}</p>
      <h3>Purchased Items:</h3>
      <pre>${productDetails}</pre>
      <h3>Total Amount:</h3>
      <p>₹${totalAmount}</p>
    `;

    await transporter.sendMail({
      from: "debmalyasen37@gmail.com", // Replace with your email
      to: userDetails.email, // Send email to the user
      subject: "Payment Confirmation",
      html: emailContent,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email", error },
      { status: 500 }
    );
  }
}
