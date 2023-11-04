"use client";

import { Plus } from 'lucide-react';
import { FC, useCallback, memo } from 'react';

import { useModal } from '@/hooks/use-modal-store';

import { ActionTooltip } from '../action-tooltip';

export const NavigationAction: FC = memo(() => {
  const { onOpen } = useModal();

  const openHandler = useCallback(() => {
    onOpen('createServer');
  }, [onOpen]);

  return (
    <div>
      <ActionTooltip side='right' align='center' label='Add a server'>
        <button className='group flex items-center' onClick={openHandler}>
          <div className='flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500'>
            <Plus className='group-hover:text-white transition text-emerald-500' size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
});
