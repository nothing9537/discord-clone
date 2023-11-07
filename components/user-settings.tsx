"use client"
import { FC, useCallback } from 'react';
import { useModal } from '@/hooks/use-modal-store';

import { Settings } from 'lucide-react';
import { Button } from './ui/button';

export const UserSettings: FC = () => {
  const { onOpen } = useModal();

  const onOpenSettings = useCallback(() => {
    onOpen('userSettings');
  }, [onOpen]);

  return (
    <Button variant="outline" size="icon" className='bg-transparent border-0' onClick={onOpenSettings}>
      <Settings
        className='w-[1.2rem] h-[1.2rem]'
      />
    </Button>
  );
};
