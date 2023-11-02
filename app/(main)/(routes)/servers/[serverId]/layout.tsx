import { FC, ReactNode } from 'react'
import { redirect } from 'next/navigation';
import { redirectToSignIn } from '@clerk/nextjs';

import { currentProfile } from '@/lib/current-profile';
import { ServerSidebar } from '@/components/server/server-sidebar';
import { db } from '@/lib/db';

interface ServerIdLayoutProps {
  children: ReactNode;
  params: { serverId: string };
}

const ServerIdLayout: FC<ServerIdLayoutProps> = async ({ children, params }) => {
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
  });

  if (!server) {
    return redirect('/');
  }

  return (
    <div className='h-full'>
      <div className='hidden md:flex h-full w-60 z-20 flex-col inset-y-0 fixed'>
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className='h-full md:pl-60'>
        {children}
      </main>
    </div>
  );
};

export default ServerIdLayout