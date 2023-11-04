"use client";

import { FC, memo } from 'react';

import { cn } from '@/lib/utils';

import { Avatar, AvatarImage } from './ui/avatar';


interface UserAvatar {
  src?: string;
  className?: string;
}

export const UserAvatar: FC<UserAvatar> = memo(({ src, className }) => {
  return (
    <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
});
