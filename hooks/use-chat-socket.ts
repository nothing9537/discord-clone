import { useEffect } from 'react';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';

import { useSocket } from '@/components/providers/socket-provider';
import { MessageWithMemberWithProfile } from '@/types';
import { GetMessagesResponse } from '@/app/api/messages/route';

interface ChatSocketOptions {
  addKey: string;
  updateKey: string;
  queryKey: string;
}

type QueryData = InfiniteData<GetMessagesResponse>;
type ReturnSetQuery = QueryData;
type QueryFunctionHandler = (oldData: QueryData) => QueryData;
type QueryKey = string[];

export const useChatSocket = ({ addKey, updateKey, queryKey, }: ChatSocketOptions) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<QueryFunctionHandler, QueryKey, ReturnSetQuery>([queryKey], (oldData) => {
        if (!oldData || !oldData.pages || !oldData.pages.length) {
          return oldData;
        }

        const newData = oldData.pages.map((page) => {
          return {
            ...page,
            messages: page.messages.map((pageMessage) => {
              if (pageMessage.id === message.id) {
                return message;
              }

              return pageMessage;
            }),
          };
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData<QueryFunctionHandler, QueryKey, ReturnSetQuery>([queryKey], (oldData) => {
        if (!oldData || !oldData.pages || !oldData.pages.length) {
          return oldData;
        }

        const newData = [...oldData.pages];

        newData[0] = {
          ...newData[0],
          messages: [message, ...newData[0].messages],
        };

        return {
          ...oldData,
          pages: newData,
        };
      });
    });

    return () => {
      socket.off(addKey)
      socket.off(updateKey);
    }
  }, [addKey, queryClient, queryKey, socket, updateKey]);
};