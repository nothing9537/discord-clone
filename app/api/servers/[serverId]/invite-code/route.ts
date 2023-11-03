import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse('Server id missing', { status: 400 }); 
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal error', { status: 500 });
  }
}