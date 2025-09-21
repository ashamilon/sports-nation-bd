import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, sms, push } = await request.json();

    // Update user notification preferences
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        notificationPreferences: {
          email: email ?? true,
          sms: sms ?? true,
          push: push ?? true,
        }
      }
    });

    return NextResponse.json({ message: 'Notification preferences updated successfully' });
  } catch (error) {
    console.error('Notification preferences update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { notificationPreferences: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      notifications: user.notificationPreferences || {
        email: true,
        sms: true,
        push: true,
      }
    });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
