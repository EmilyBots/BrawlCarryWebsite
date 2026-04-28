import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';

async function checkAdmin(req: NextRequest) {
  const sessionToken = req.cookies.get('session')?.value;
  if (!sessionToken) return null;
  const session = await prisma.session.findUnique({ where: { token: sessionToken }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) return null;
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
  if (!adminEmails.includes(session.user.email)) return null;
  return session.user;
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { to, subject, body, sendToAll } = await req.json();

  if (!subject || !body) {
    return NextResponse.json({ error: 'Subject and body are required.' }, { status: 400 });
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#050810;font-family:'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#050810;padding:40px 0;">
        <tr><td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#0a0f1e;border:1px solid rgba(0,212,255,0.2);border-radius:16px;overflow:hidden;">
            <tr><td height="3" style="background:linear-gradient(90deg,#00d4ff,#b44fff);"></td></tr>
            <tr><td align="center" style="padding:28px 40px 20px;">
              <div style="font-size:20px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#00d4ff;">BRAWLCARRY</div>
              <div style="font-size:11px;color:#7a8ab0;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Elite Boosting Service</div>
            </td></tr>
            <tr><td style="padding:0 40px 36px;">
              <div style="color:#e8f0ff;font-size:15px;line-height:1.8;white-space:pre-wrap;">${body.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </td></tr>
            <tr><td style="padding:20px 40px;border-top:1px solid rgba(0,212,255,0.1);text-align:center;">
              <p style="color:#7a8ab0;font-size:12px;margin:0;">© 2026 BrawlCarry · <a href="https://brawlcarry.store" style="color:#00d4ff;text-decoration:none;">brawlcarry.store</a></p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  try {
    if (sendToAll) {
      // Send to all verified users in batches
      const users = await prisma.user.findMany({
        where: { emailVerified: true },
        select: { email: true },
      });

      const emails = users.map(u => u.email);
      const batchSize = 50;
      let sent = 0;

      for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        await resend.emails.send({
          from: 'BrawlCarry <noreply@brawlcarry.store>',
          bcc: batch,
          to: 'noreply@brawlcarry.store',
          subject,
          html,
        });
        sent += batch.length;
      }

      return NextResponse.json({ success: true, sent });
    } else {
      if (!to) return NextResponse.json({ error: 'Recipient email required.' }, { status: 400 });
      await resend.emails.send({
        from: 'BrawlCarry <noreply@brawlcarry.store>',
        to,
        subject,
        html,
      });
      return NextResponse.json({ success: true, sent: 1 });
    }
  } catch (err) {
    console.error('[ADMIN EMAIL ERROR]', err);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
