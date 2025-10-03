import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";

// Disable Next.js default body parser (Formidable will handle it)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Initialize formidable
  const form = formidable({
    multiples: true,
    maxFileSize: 20 * 1024 * 1024, // 20 MB max
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Formidable error:", err);
      return res.status(500).json({ error: "File upload failed." });
    }

    try {
      const customerName = fields.customer_name?.toString().trim() || "Unknown Customer";

      // Normalize files into an array
      let fileArray = [];
      if (Array.isArray(files["files[]"])) {
        fileArray = files["files[]"];
      } else if (files["files[]"]) {
        fileArray = [files["files[]"]];
      }

      // Build attachments
      const attachments = fileArray.map((file) => ({
        filename: file.originalFilename,
        content: fs.createReadStream(file.filepath),
      }));

      // Nodemailer transporter (using Gmail + app password)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,  // Gmail address
          pass: process.env.EMAIL_PASS,  // Gmail App Password (not regular password!)
        },
      });

      // Send the email
      await transporter.sendMail({
        from: `"EasyPrint Orders" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
        subject: `📄 New Order from ${customerName}`,
        html: `
          <h3>New Order Received</h3>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Files:</strong> ${attachments.length} attached</p>
        `,
        attachments,
      });

      return res.status(200).json({ success: "✅ Order submitted successfully!" });
    } catch (e) {
      console.error("❌ Email send error:", e);
      return res.status(500).json({ error: "Failed to send order email." });
    }
  });
}
