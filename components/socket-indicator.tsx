"use client";

import { FC } from 'react'

import { Badge } from './ui/badge';
import { useSocket } from './providers/socket-provider';

export const SocketIndicator: FC = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant='outline' className='bg-yellow-600 text-white border-none'>
        Fallback: Polling in every 1s!
      </Badge>
    )
  }

  return (
    <Badge variant='outline' className='bg-emerald-600 text-white border-none'>
      Live: Real-time connection!
    </Badge>
  );
};
