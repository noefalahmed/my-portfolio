import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await resend.emails.send({
      from: 'Note from Website <onboarding@resend.dev>',
      to: 'noefalahmed@gmail.com',
      subject: `New note from ${email}`,
      replyTo: email,
      text: message,
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
