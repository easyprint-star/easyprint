import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "⚠️ All fields are required." });
  }

  try {
    // ✅ Use Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // Gmail
        pass: process.env.EMAIL_PASS, // App Password (not normal Gmail password!)
      },
    });

    // Verify connection first
    await transporter.verify();

    await transporter.sendMail({
      from: `"EasyPrint Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
      subject: "📩 New Contact Form Message",
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    return res.status(200).json({ success: "✅ Message sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error.message, error);

    return res.status(500).json({
      error: `❌ Failed to send message. Details: ${error.message}`,
    });
  }
}
