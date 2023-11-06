import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { DirectMessageWithMemberWithProfile } from '@/types';

const MESSAGES_BATCH = 10;

export interface GetDirectMessagesResponse {
  messages: DirectMessageWithMemberWithProfile[];
  nextCursor: string | null;
}

export async function GET(req: Request): Promise<NextResponse<GetDirectMessagesResponse>> {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const conversationId = searchParams.get('conversationId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse('Conversation ID missing', { status: 400 });
    }

    let messages: DirectMessageWithMemberWithProfile[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
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
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
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