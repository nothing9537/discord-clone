"use client";

import { FC } from 'react'
import { MemberRole } from '@prisma/client';
import { ChevronDown, LogOut, PlusCircle, SettingsIcon, Trash, UserPlus, Users } from 'lucide-react';

import { ServerWithMemberWithProfiles } from '@/types';
import { useModal } from '@/hooks/use-modal-store';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface ServerHeaderProps {
  server: ServerWithMemberWithProfiles;
  role?: MemberRole;
}

export const ServerHeader: FC<ServerHeaderProps> = ({ server, role }) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
          {server.name}
          <ChevronDown className='h-5 w-5 ml-auto' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'
        onClick={() => onOpen('invite', { server })}
      >
        {isModerator && (
          <DropdownMenuItem className='text-indigo-600 dark:text-indigo-400 text-sm px-3 py-2 cursor-pointer'>
            Invite People
            <UserPlus className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className='text-sm px-3 py-2 cursor-pointer'>
            Server Settings
            <SettingsIcon className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className='text-sm px-3 py-2 cursor-pointer'>
            Manage Members
            <Users className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className='text-sm px-3 py-2 cursor-pointer'>
            Create Channel
            <PlusCircle className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuSeparator />
        )}
        {isAdmin && (
          <DropdownMenuItem className='text-rose-500 text-sm px-3 py-2 cursor-pointer'>
            Delete Server
            <Trash className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className='text-rose-500 text-sm px-3 py-2 cursor-pointer'>
            Leave Server
            <LogOut className='h-4 w-4 ml-auto' />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
