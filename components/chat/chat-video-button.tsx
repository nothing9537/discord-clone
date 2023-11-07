"use client";

import qs from 'query-string';
import { FC } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Video, VideoOff } from 'lucide-react';

import { ActionTooltip } from '../action-tooltip';

export const ChatVideoButton: FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isVideo = searchParams?.get('video');
  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? 'End video call' : 'Start video call';

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname || '',
      query: {
        video: isVideo ? undefined : true,
      }
    }, { skipNull: true });

    router.push(url);
  };

  return (
    <ActionTooltip side='bottom' label={tooltipLabel}>
      <button className='hover:opacity-75 mr-4' onClick={onClick}>
        <Icon className='w-6 h-6 text-zinc-500 dark:text-zinc-400' />
      </button>
    </ActionTooltip>
  );
};
