import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ success: true });

    await prisma.verificationToken.deleteMany({ where: { userId: user.id } });

    const code = generateCode();
    await prisma.verificationToken.create({
      data: {
        code,
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await resend.emails.send({
      from: 'BrawlCarry <noreply@brawlcarry.store>',
      to: email,
      subject: 'Reset your BrawlCarry password',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#050810;font-family:'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#050810;padding:40px 0;">
            <tr><td align="center">
              <table width="520" cellpadding="0" cellspacing="0" style="background:#0a0f1e;border:1px solid rgba(0,212,255,0.2);border-radius:16px;overflow:hidden;">
                <tr><td height="3" style="background:linear-gradient(90deg,#00d4ff,#b44fff);"></td></tr>
                <tr><td align="center" style="padding:36px 40px 24px;">
                  <div style="font-size:22px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#00d4ff;">BRAWLCARRY</div>
                  <div style="font-size:11px;color:#7a8ab0;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Password Reset</div>
                </td></tr>
                <tr><td style="padding:0 40px 36px;">
                  <p style="color:#e8f0ff;font-size:16px;margin:0 0 8px;">Hey <strong>${user.username}</strong>,</p>
                  <p style="color:#7a8ab0;font-size:14px;line-height:1.7;margin:0 0 28px;">Use the code below to reset your password. It expires in 15 minutes.</p>
                  <div style="background:#0f1628;border:1px solid rgba(0,212,255,0.3);border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
                    <div style="font-size:11px;color:#7a8ab0;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px;">Reset code</div>
                    <div style="font-size:42px;font-weight:700;letter-spacing:10px;color:#00d4ff;font-family:'Courier New',monospace;">${code}</div>
                    <div style="font-size:12px;color:#7a8ab0;margin-top:12px;">Expires in <strong style="color:#e8f0ff;">15 minutes</strong></div>
                  </div>
                  <p style="color:#7a8ab0;font-size:13px;line-height:1.6;margin:0;">If you did not request a password reset, you can safely ignore this email.</p>
                </td></tr>
                <tr><td style="padding:20px 40px;border-top:1px solid rgba(0,212,255,0.1);text-align:center;">
                  <p style="color:#7a8ab0;font-size:12px;margin:0;">© 2026 BrawlCarry. All rights reserved.</p>
                </td></tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[FORGOT PASSWORD ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
