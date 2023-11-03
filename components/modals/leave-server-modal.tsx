"use client";

import axios from 'axios';
import { FC, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Server } from '@prisma/client';

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

export const LeaveServerModal: FC = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'leaveServer';
  const { server } = data;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onModalClose = useCallback(() => {
    onClose()
  }, [onClose]);

  const onConfirm = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.post<Server>(`/api/servers/${server?.id}/leave`);

      onClose();

      router.refresh()
      router.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [onClose, router, server?.id]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Leave Server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Are you sure want to leave <span className='font-semibold text-indigo-500'>{server?.name}</span>?
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
