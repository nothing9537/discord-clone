"use client";

import * as z from 'zod';
import qs from 'query-string';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useCallback, useState } from 'react'
import { Member, MemberRole } from '@prisma/client';
import { Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';

import { useModal } from '@/hooks/use-modal-store';
import { MessageWithMemberWithProfile } from '@/types';

import { UserAvatar } from '../../user-avatar';
import { ActionTooltip } from '../../action-tooltip';
import { ChatItemContent } from './chat-item-content';
import { IconMap } from '../../icon-map';

interface ChatItemProps {
  message: MessageWithMemberWithProfile;
  currentMember: Member;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

const formSchema = z.object({
  content: z.string().min(1),
});

export type FormSchema = z.infer<typeof formSchema>;

export const ChatItem: FC<ChatItemProps> = (props) => {
  const { onOpen } = useModal();
  const { message, currentMember, socketQuery, socketUrl } = props;
  const params = useParams();
  const router = useRouter();

  const { member, fileUrl, deleted, createdAt, id } = message;

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const timestamp = format(new Date(createdAt), DATE_FORMAT);

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const isSubmitting = form.formState.isSubmitting;

  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;

  const onEdit = useCallback(() => {
    setIsEditing((prev) => !prev)
  }, []);

  const onMemberClick = useCallback(() => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }, [currentMember.id, member.id, params?.serverId, router]);

  const onSubmit = useCallback(async (values: FormSchema) => {
    console.log(values);

    try {
      const requestUrl = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(requestUrl, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  }, [form, id, socketQuery, socketUrl]);

  const onDeleteMessage = useCallback(() => {
    onOpen('deleteMessage', { message, apiUrl: `${socketUrl}/${id}`, query: socketQuery })
  }, [onOpen, message, socketUrl, id, socketQuery]);

  return (
    <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>
      <div className='group flex gap-x-2 items-start w-full'>
        <div className='cursor-pointer hover:drop-shadow-md transition' onClick={onMemberClick}>
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex items-center gap-x-2'>
            <div className='flex items-center gap-x-2'>
              <p className='font-semibold text-sm hover:underline cursor-pointer' onClick={onMemberClick}>
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role} side='top'>
                <span>
                  <IconMap type='role' role={member.role} />
                </span>
              </ActionTooltip>
            </div>
            <span className='text-xs text-zinc-500 dark:text-zinc-400 ml-auto'>
              {timestamp}
            </span>
          </div>
          <ChatItemContent
            setIsEditing={setIsEditing}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
            onSubmit={onSubmit}
            message={message}
            form={form}
          />
        </div>
      </div>
      {canDeleteMessage && (
        <div className='hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm'>
          {canEditMessage && (
            <ActionTooltip label='Edit'>
              <span>
                <Edit
                  onClick={onEdit}
                  className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
                />
              </span>
            </ActionTooltip>
          )}
          <ActionTooltip label='Delete'>
            <span>
              <Trash
                onClick={onDeleteMessage}
                className='cursor-pointer ml-auto w-4 h-4 text-rose-500 hover:text-rose-600 dark:hover:text-rose-300 transition'
              />
            </span>
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
