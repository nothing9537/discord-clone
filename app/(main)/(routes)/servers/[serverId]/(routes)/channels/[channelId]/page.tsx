import { FC } from 'react'
import { redirect } from 'next/navigation';
import { redirectToSignIn } from '@clerk/nextjs';

import ChatHeader from '@/components/chat/chat-header';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  }
}

const ChannelIdPage: FC<ChannelIdPageProps> = async ({ params }) => {
  const { serverId, channelId } = params;

  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect('/');
  }

  return (
    <div className='flex flex-col h-full'>
      <ChatHeader
        name={channel.name}
        serverId={serverId}
        type='channel'
      />
    </div>
  )
}

export default ChannelIdPage