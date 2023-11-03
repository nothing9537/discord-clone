"use client";

import { FC } from 'react';
import { ChannelType, MemberRole } from '@prisma/client';
import { Plus, Settings } from 'lucide-react';

import { ServerWithMemberWithProfiles } from '@/types';
import { useModal } from '@/hooks/use-modal-store';

import { ActionTooltip } from '../action-tooltip';

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: 'channels' | 'members';
  channelType?: ChannelType;
  server?: ServerWithMemberWithProfiles;
}

export const ServerSection: FC<ServerSectionProps> = ({ label, role, sectionType, channelType, server }) => {
  const { onOpen } = useModal();

  return (
    <div className='flex items-center justify-between py-2'>
      <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>{label}</p>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip label='Create Channel' side='top' className='ml-auto'>
          <button
            onClick={() => onOpen('createChannel', { server, channelType })}
            className='text-zinc-500 hover:text-zinc-600 
          dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Plus calcMode='h-4 w-4' />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label='Manage Members' side='top'>
          <button
            onClick={() => onOpen('members', { server })}
            className='text-zinc-500 hover:text-zinc-600 
                dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Settings calcMode='h-4 w-4' />
          </button>
        </ActionTooltip>
      )}
    </div >
  )
}
