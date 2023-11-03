"use client";

import { FC, useCallback, useState } from 'react';
import { Check, Copy, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { Server } from '@prisma/client';

import { useModal } from '@/hooks/use-modal-store';
import { useOrigin } from '@/hooks/use-origin';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export const InviteModal: FC = () => {
  const { isOpen, onClose, onOpen, type, data } = useModal();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === 'invite';
  const { server } = data;

  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [inviteUrl]);

  const onNewLink = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch<Server>(`/api/servers/${server?.id}/invite-code`);

      onOpen('invite', { server: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [onOpen, server?.id]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className='p-6'>
          <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
            Server invite link
          </Label>
          <div className='flex items-center mt-2 gap-x-2'>
            <Input
              disabled={isLoading}
              className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
              value={inviteUrl}
            />
            <Button disabled={isLoading} size="icon" onClick={onCopy}>
              {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
            </Button>
          </div>
          <Button disabled={isLoading} variant="link" size="sm" className='text-sm text-zinc-500 mt-4' onClick={onNewLink}>
            Generate a new link
            <RefreshCw className='w-4 h-4 ml-2' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
