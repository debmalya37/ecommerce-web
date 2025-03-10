import nodemailer from "nodemailer";

export default async function sendPaymentEmail(details: any) {
  const { userDetails, transactionId, products, totalAmount } = details;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Gmail SMTP server
    port: 587, // TLS port
    secure: false, // Use STARTTLS
    auth: {
      user: "hiuriofficial@gmail.com", // Replace with your email address hiuriofficial@gmail.com

      // pass: "mtog xezl xlsb xyaz", // Replace with your app-specific password
      pass: "tuli pgni jvnb coca", // Replace with your app-specific password
    },
});

  const productDetails = products
    .map(
      (product: any) =>
        `${product.name} - ₹${product.price} x ${product.quantity} = ₹${product.price * product.quantity}`
    )
    .join("\n");

  const emailContent = `
    <h1>Payment Confirmation</h1>
    <p>Thank you for your purchase! Here are the details:</p>
    <h3>User Details:</h3>
    <p><strong>Name:</strong> ${userDetails.fullName}</p>
    <p><strong>Email:</strong> ${userDetails.email}</p>
    <p><strong>Phone:</strong> ${userDetails.phone}</p>
    <h3>Transaction ID:</h3>
    <p>${transactionId}</p>
    <h3>Purchased Items:</h3>
    <pre>${productDetails}</pre>
    <h3>Total Amount:</h3>
    <p>₹${totalAmount}</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "debmalyasen37@gmail.com",
    subject: "Payment Confirmation",
    html: emailContent,
  });
}
