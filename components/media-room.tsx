"use client";

import axios from 'axios';
import { FC, useEffect, useState, memo } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import { GetLiveKitTokenResponse } from '@/app/api/livekit/route';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import "@livekit/components-styles";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom: FC<MediaRoomProps> = memo(({ chatId, video, audio }) => {
  const { user } = useUser();
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) {
      return;
    }

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const response = await axios.get<GetLiveKitTokenResponse>(`/api/livekit`, {
          params: {
            room: chatId,
            username: name,
          },
        });

        setToken(response.data?.token);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [chatId, user]);

  if (!token) {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-8 w-8 text-zinc-500 animate-spin my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Loading...
        </p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
});
