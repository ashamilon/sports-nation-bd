import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get yesterday for comparison
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Calculate today's sales
    const todayOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ['confirmed', 'processing', 'shipped', 'delivered']
        }
      },
      select: {
        total: true,
        status: true
      }
    });

    const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);

    // Count new orders (today)
    const newOrdersCount = todayOrders.length;

    // Count active users (users who have been updated within the last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeUsersCount = await prisma.user.count({
      where: {
        updatedAt: {
          gte: sevenDaysAgo
        }
      }
    });

    // Get yesterday's sales for comparison
    const yesterdayOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today,
        },
        status: {
          in: ['confirmed', 'processing', 'shipped', 'delivered']
        }
      },
      select: {
        total: true
      }
    });

    const yesterdaySales = yesterdayOrders.reduce((sum, order) => sum + order.total, 0);

    // Calculate growth percentage
    const salesGrowth = yesterdaySales > 0 
      ? Math.round(((todaySales - yesterdaySales) / yesterdaySales) * 100)
      : 0;

    return NextResponse.json({
      todaySales,
      newOrders: newOrdersCount,
      activeUsers: activeUsersCount,
      salesGrowth,
      yesterdaySales
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
