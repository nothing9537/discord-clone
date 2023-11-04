import { FC } from 'react';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

interface ServerIdProps {
  params: {
    serverId: string;
  }
}

const ServerPage: FC<ServerIdProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  const initialServer = server?.channels?.[0];

  if (initialServer?.name !== 'general') {
    return null;
  }

  return redirect(`/servers/${params?.serverId}/channels/${initialServer?.id}`);
}

export default ServerPage;
