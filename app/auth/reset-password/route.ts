import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();
    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });

    const token = await prisma.verificationToken.findFirst({ where: { userId: user.id, code } });
    if (!token) return NextResponse.json({ error: 'Invalid reset code.' }, { status: 400 });
    if (token.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { id: token.id } });
      return NextResponse.json({ error: 'Code has expired. Please request a new one.' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    await prisma.verificationToken.deleteMany({ where: { userId: user.id } });
    // Invalidate all sessions
    await prisma.session.deleteMany({ where: { userId: user.id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[RESET PASSWORD ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
