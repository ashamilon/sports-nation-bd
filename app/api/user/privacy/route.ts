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

    const { profileVisibility, showEmail, showPhone } = await request.json();

    // Update user privacy settings
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        privacySettings: {
          profileVisibility: profileVisibility ?? 'private',
          showEmail: showEmail ?? false,
          showPhone: showPhone ?? false,
        }
      }
    });

    return NextResponse.json({ message: 'Privacy settings updated successfully' });
  } catch (error) {
    console.error('Privacy settings update error:', error);
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
      select: { privacySettings: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      privacy: user.privacySettings || {
        profileVisibility: 'private',
        showEmail: false,
        showPhone: false,
      }
    });
  } catch (error) {
    console.error('Get privacy settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
