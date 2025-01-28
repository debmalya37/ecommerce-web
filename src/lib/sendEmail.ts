import nodemailer from "nodemailer";

async function sendPaymentEmail(userDetails: any, transactionId: string, productDetails: any) {
  try {
    // Create a transporter object using the Gmail SMTP transport
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
      from: "your-email@gmail.com",  // Sender address
      to: "debmalyasen37@gmail.com", // Recipient address
      subject: "Payment Success Notification", // Subject line
      text: `Payment Success for User: ${userDetails.name}\nTransaction ID: ${transactionId}\nProduct Details: ${JSON.stringify(productDetails)}\n\nUser Details:\nName: ${userDetails.name}\nPhone: ${userDetails.phone}\nEmail: ${userDetails.email}`, // Plain text body
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Payment success email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default sendPaymentEmail;
