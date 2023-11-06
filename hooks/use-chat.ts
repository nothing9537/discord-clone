import qs from 'query-string';
import { useInfiniteQuery } from '@tanstack/react-query';

import { useSocket } from '@/components/providers/socket-provider';
import { GetMessagesResponse } from '@/app/api/messages/route';

interface UseChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
}

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: UseChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }: { pageParam?: string }): Promise<GetMessagesResponse> => {
    const requestUrl = qs.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam,
        [paramKey]: paramValue,
      },
    }, { skipNull: true });

    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json()
  };

  const infiniteQuery = useInfiniteQuery<GetMessagesResponse, Error>({
    queryKey: [queryKey],
    queryFn: ({ pageParam }) => fetchMessages({ pageParam: pageParam as (string | undefined) }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
    initialPageParam: undefined
  });

  return { ...infiniteQuery };
}