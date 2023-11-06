"use client";

import { FC, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation';
import { MemberRole, Server } from '@prisma/client';

import { cn } from '@/lib/utils';
import { MemberWithProfile } from '@/types';

import { UserAvatar } from '../user-avatar';
import { IconMap, RoleIconMapClassNames } from '../icon-map';

interface ServerMemberProps {
  member: MemberWithProfile;
  server: Server;
}

const ServerMember: FC<ServerMemberProps> = ({ member, server }) => {
  const params = useParams();
  const router = useRouter();

  const currentMember = params?.memberId === member.id;

  const onMemberClick = useCallback(() => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }, [member.id, params?.serverId, router]);

  const roleIconMapClasses: RoleIconMapClassNames = {
    [MemberRole.GUEST]: '',
    [MemberRole.ADMIN]: 'h-4 w-4 ml-auto text-rose-500',
    [MemberRole.MODERATOR]: 'h-4 w-4 ml-auto text-indigo-500',
  };

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
      <IconMap
        type='role'
        role={member.role}
        className={roleIconMapClasses}
      />
    </button>
  );
};

export default ServerMember