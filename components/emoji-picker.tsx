"use client";

import { FC, memo } from 'react'
import { Smile } from 'lucide-react';
import { useTheme } from 'next-themes';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

import { Emoji } from '@/types';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPicker: FC<EmojiPickerProps> = memo(({ onChange }) => {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <Smile className='text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition' />
        <PopoverContent
          side='right'
          sideOffset={60}
          className='bg-transparent border-none shadow-none drop-shadow-none mb-20'
        >
          <Picker
            theme={resolvedTheme}
            data={data}
            onEmojiSelect={(emoji: Emoji) => onChange(emoji.native)}
          />
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  );
});
