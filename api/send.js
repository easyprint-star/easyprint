/**
 * /api/send.js
 * Vercel Serverless Function to send email via Resend.
 * Requires RESEND_API_KEY and TO_EMAIL as environment variables.
 */
 
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  try {
    const body = req.body && Object.keys(req.body).length ? req.body : await getJson(req);
    const { name, email, message, phone, ...rest } = body;

    if (!process.env.RESEND_API_KEY) {
      res.status(500).send('RESEND_API_KEY not configured.');
      return;
    }
    if (!process.env.TO_EMAIL) {
      res.status(500).send('TO_EMAIL not configured.');
      return;
    }

    const html = `
      <h2>New message from EasyPrintServices website</h2>
      <p><strong>Name:</strong> ${escapeHtml(name || '—')}</p>
      <p><strong>Email:</strong> ${escapeHtml(email || '—')}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || '—')}</p>
      <p><strong>Message:</strong><br/>${escapeHtml(message || '—')}</p>
      <pre>${escapeHtml(JSON.stringify(rest, null, 2))}</pre>
    `;

    const payload = {
      from: 'easyprint191@gmail.com', // must be verified domain in Resend
      to: process.env.TO_EMAIL.split(','), // allows multiple recipients separated by commas
      subject: 'Website contact: ' + (name || 'New message'),
      html: html
    };

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const txt = await r.text();
      res.status(502).send('Resend API error: ' + txt);
      return;
    }
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error: ' + err.message);
  }
};

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

async function getJson(req){
  return new Promise((resolve, reject) => {
    let data='';
    req.on('data', chunk => data += chunk);
    req.on('end', ()=> {
      try{ resolve(JSON.parse(data || '{}')) } catch(e){ resolve({}) }
    });
    req.on('error', reject);
  });
}