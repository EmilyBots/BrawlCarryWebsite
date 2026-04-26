import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/resend';
import crypto from 'crypto';

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/verify-email — verify the 6-digit code
export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'Email already verified.' }, { status: 400 });
    }

    const token = await prisma.verificationToken.findFirst({
      where: { userId: user.id, code },
    });

    if (!token) {
      return NextResponse.json({ error: 'Invalid verification code.' }, { status: 400 });
    }

    if (token.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { id: token.id } });
      return NextResponse.json({ error: 'Code has expired. Please request a new one.' }, { status: 400 });
    }

    // Mark user as verified and clean up tokens
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
    await prisma.verificationToken.deleteMany({ where: { userId: user.id } });

    // Create a session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    await prisma.session.create({
      data: {
        token: sessionToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error('[VERIFY EMAIL ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

// PATCH /api/auth/verify-email — resend the code
export async function PATCH(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    if (user.emailVerified) return NextResponse.json({ error: 'Email already verified.' }, { status: 400 });

    await prisma.verificationToken.deleteMany({ where: { userId: user.id } });

    const code = generateCode();
    await prisma.verificationToken.create({
      data: {
        code,
        userId: user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendVerificationEmail(email, user.username, code);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[RESEND CODE ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
