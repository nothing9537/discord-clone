"use client";

import { FC, ReactNode, memo, useCallback } from 'react'
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Member, MemberRole, Profile, Server } from '@prisma/client';

import { cn } from '@/lib/utils';
import { UserAvatar } from '../user-avatar';

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap: Record<NonNullable<MemberRole>, ReactNode> = {
  [MemberRole.GUEST]: null,
  [MemberRole.ADMIN]: <ShieldCheck className='h-4 w-4 ml-2 text-rose-500' />,
  [MemberRole.MODERATOR]: <ShieldAlert className='h-4 w-4 ml-2 text-indigo-500' />,
}

const ServerMember: FC<ServerMemberProps> = ({ member, server }) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  const currentMember = params?.memberId === member.id;

  const onMemberClick = useCallback(() => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }, [member.id, params?.serverId, router]);

  return (
    <button
      onClick={onMemberClick}
      className={cn(
        'group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
        currentMember && 'bg-zinc-700/20 dark:bg-zinc-700',
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className='h-8 w-8 md:h-8 md:w-8'
      />
      <p className={cn(
        "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600d dark:text-zinc-400 dark:group-hover:text-zinc-300",
        currentMember && 'text-primary dark:text-zinc-200 dark:group-hover:text-white'
      )}>
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};

export default ServerMember