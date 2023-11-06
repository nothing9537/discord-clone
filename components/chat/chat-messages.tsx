"use client";

import { FC, Fragment } from 'react';
import { Member } from '@prisma/client';
import { Loader2, ServerCrash } from 'lucide-react';

import { useChatQuery } from '@/hooks/use-chat';

import { ChatWelcome } from './chat-welcome';
import { ChatItem } from './chat-item/chat-item';

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

export const ChatMessages: FC<ChatMessagesProps> = (props) => {
  const { name, member, chatId, apiUrl, socketQuery, socketUrl, paramKey, paramValue, type, } = props;

  const queryKey = `chat:${chatId}`

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

  if (status === 'pending') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-8 w-8 text-zinc-500 animate-spin my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <ServerCrash className='h-8 w-8 text-rose-500 my-4' />
        <p className='text-xs text-rose-500 dark:text-rose-400'>
          Something went wrong when loading messages!
        </p>
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col py-4 overflow-y-auto'>
      <div className='flex-1' />
      <ChatWelcome type={type} name={name} />
      <div className='flex flex-col-reverse mt-auto'>
        {data?.pages?.map((group, index) => (
          <Fragment key={index}>
            {group.messages.map((message) => (
              <ChatItem
                key={message.id}
                currentMember={member}
                message={message}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
