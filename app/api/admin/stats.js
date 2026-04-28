import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function checkAdmin(req: NextRequest) {
  const sessionToken = req.cookies.get('session')?.value;
  if (!sessionToken) return null;
  const session = await prisma.session.findUnique({ where: { token: sessionToken }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) return null;
  const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
  if (!adminEmails.includes(session.user.email)) return null;
  return session.user;
}

export async function GET(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [totalUsers, verifiedUsers, totalSessions, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { emailVerified: true } }),
    prisma.session.count({ where: { expiresAt: { gt: new Date() } } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, username: true, email: true, emailVerified: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({ totalUsers, verifiedUsers, totalSessions, recentUsers });
}
