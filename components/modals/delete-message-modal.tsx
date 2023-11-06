"use client";

import qs from 'query-string';
import axios from 'axios';
import { FC, useCallback, useState, memo } from 'react';
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

export const DeleteMessageModal: FC = memo(() => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === 'deleteMessage';
  const { apiUrl, query } = data;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onModalClose = useCallback(() => {
    onClose()
  }, [onClose]);

  const onConfirm = useCallback(async () => {
    try {
      setIsLoading(true);

      const requestUrl = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      });

      console.log(requestUrl);

      await axios.delete<Channel>(requestUrl);

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, onClose, query]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Delete Message
          </DialogTitle>
          <DialogDescription className='text-center text-rose-500'>
            Are you sure want to do this? <br />
            The message will be permanently deleted.
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
});
