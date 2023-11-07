import { FC } from 'react'
import { redirect } from 'next/navigation';
import { redirectToSignIn } from '@clerk/nextjs';

import { ChatHeader } from '@/components/chat/chat-header';
import { currentProfile } from '@/lib/current-profile';
import { getOrCreateConversation } from '@/lib/conversation';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { db } from '@/lib/db';
import { MediaRoom } from '@/components/media-room';

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage: FC<MemberIdPageProps> = async ({ params, searchParams }) => {
  const { memberId, serverId } = params;
  const { video } = searchParams;

  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect('/')
  }

  const conversation = await getOrCreateConversation(
    currentMember.id, // ! Me
    memberId, // ! Somebody else
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  // * I don't know, who starts the conversation, so i've always pick opposite one
  const otherMember = memberOne.profile.id === profile.id ? memberTwo : memberOne;

  return (
    <div className='flex flex-col h-full'>
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type='conversation'
      />
      {!video ? (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type='conversation'
            apiUrl='/api/direct-messages'
            socketUrl='/api/socket/direct-messages'
            paramKey='conversationId'
            paramValue={conversation.id}
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type='conversation'
            apiUrl='/api/socket/direct-messages'
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      ) : (
        <MediaRoom
          chatId={conversation.id}
          video={true}
          audio={true}
        />
      )}
    </div>
  )
}

export default MemberIdPage