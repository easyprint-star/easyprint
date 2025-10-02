import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // disable default parser for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "File upload error" });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const attachments = [];
      if (files.files) {
        const uploadedFiles = Array.isArray(files.files)
          ? files.files
          : [files.files];

        uploadedFiles.forEach((file) => {
          attachments.push({
            filename: file.originalFilename,
            path: file.filepath,
          });
        });
      }

      await transporter.sendMail({
        from: `"EasyPrint Orders" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
        subject: "📦 New Order Submission",
        text: `Order from ${fields.customer_name}`,
        attachments,
      });

      res.status(200).json({ success: "✅ Order sent successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Email sending failed: " + error.message });
    }
  });
}
