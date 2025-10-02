import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // let formidable handle file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: true, maxFileSize: 20 * 1024 * 1024 }); // 20 MB max

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(500).json({ error: "File upload failed." });
    }

    try {
      const customerName = fields.customer_name?.toString() || "Unknown Customer";

      // Normalize files into an array
      let fileArray = [];
      if (Array.isArray(files["files[]"])) {
        fileArray = files["files[]"];
      } else if (files["files[]"]) {
        fileArray = [files["files[]"]];
      }

      // Attachments
      const attachments = fileArray.map((file) => ({
        filename: file.originalFilename,
        content: fs.createReadStream(file.filepath),
      }));

      // Nodemailer transporter (Gmail)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // easyprint191@gmail.com
          pass: process.env.EMAIL_PASS, // nkvf wlte etwn avvl
        },
      });

      await transporter.sendMail({
        from: `"EasyPrint Orders" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER, // where you receive orders
        subject: `📄 New Order from ${customerName}`,
        text: `${customerName} has submitted an order with ${attachments.length} file(s).`,
        attachments,
      });

      return res.status(200).json({ success: "✅ Order submitted successfully!" });
    } catch (e) {
      console.error("Email send error:", e);
      return res.status(500).json({ error: "Failed to send order email." });
    }
  });
}

