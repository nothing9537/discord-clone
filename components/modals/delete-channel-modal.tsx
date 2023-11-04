"use client";

import qs from 'query-string';
import axios from 'axios';
import { FC, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Channel } from '@prisma/client';

import { useModal } from '@/hooks/use-modal-store';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

export const DeleteChannelModal: FC = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'deleteChannel';
  const { server, channel } = data;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onModalClose = useCallback(() => {
    onClose()
  }, [onClose]);

  const onConfirm = useCallback(async () => {
    try {
      setIsLoading(true);

      const requestUrl = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });

      console.log(requestUrl);

      await axios.delete<Channel>(requestUrl);

      onClose();

      router.refresh()
      router.push(`/servers/${server?.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [channel?.id, onClose, server?.id, router]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Delete Channel
          </DialogTitle>
          <DialogDescription className='text-center text-rose-500'>
            Are you sure want to do this? <br />
            <span className='text-indigo-500 font-semibold'>#{channel?.name}</span> will permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <div className='flex items-center justify-between w-full'>
            <Button disabled={isLoading} variant='ghost' onClick={onModalClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} variant='primary' onClick={onConfirm}>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
