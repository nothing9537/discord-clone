import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { MessageWithMemberWithProfile } from '@/types';
import { db } from '@/lib/db';

const MESSAGES_BATCH = 15;

export interface GetMessagesResponse {
  messages: MessageWithMemberWithProfile[];
  nextCursor: string | null;
}

export async function GET(req: Request): Promise<NextResponse<GetMessagesResponse>> {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const channelId = searchParams.get('channelId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!channelId) {
      return new NextResponse('Channel ID missing', { status: 400 });
    }

    let messages: MessageWithMemberWithProfile[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    let nextCursor: string | null = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      messages,
      nextCursor,
    });
  } catch (error) {
    console.error('[MESSAGES_GET]', error);

    return new NextResponse('Internal Error', { status: 500 });
  }
}