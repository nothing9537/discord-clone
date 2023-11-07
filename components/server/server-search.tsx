"use client";

import { FC, ReactNode, useCallback, useEffect, useState, memo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

export interface ServerSearchDataItem {
  label: string;
  type: 'channel' | 'member';
  data?: {
    icon: ReactNode;
    name: string;
    id: string;
  }[];
}

export interface ServerSearchProps {
  data: ServerSearchDataItem[];
}

export const ServerSearch: FC<ServerSearchProps> = memo(({ data }) => {
  const [open, setOpen] = useState<boolean>(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const onKeysDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true)
      }
    }

    document.addEventListener('keydown', onKeysDown);

    return () => {
      document.removeEventListener('keydown', onKeysDown);
    }
  }, []);

  const onOpenClick = useCallback(() => setOpen(true), []);

  const onItemClick = useCallback(({ id, type }: { id: string, type: 'channel' | 'member' }) => () => {
    setOpen(false);

    switch (type) {
      case 'member':
        return router.push(`/servers/${params?.serverId}/conversations/${id}`)
      case 'channel':
        return router.push(`/servers/${[params?.serverId]}/channels/${id}`)
      default:
        break;
    }
  }, [params?.serverId, router]);

  return (
    <>
      <button
        onClick={onOpenClick}
        className='group px-2 py-2 rounded-md flex 
        items-center gap-x-2 w-full hover:bg-zinc-700/10 
        dark:hover:bg-zinc-700/50 transition'
      >
        <Search className='w-4 h-4 text-zinc-500 dark:text-zinc-400' />
        <p
          className='font-semibold text-sm text-zinc-500 
          dark:text-zinc-400 group-hover:text-zinc-600 
          dark:group-hover:text-zinc-300 transition'
        >
          Search
        </p>
        <kbd
          className='pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto'
        >
          <span className='text-xs '>CTRL</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search all channels and members' />
        <CommandList>
          <CommandEmpty>
            No result found
          </CommandEmpty>
          {data.map(({ data, label, type }) => {
            if (!data?.length) {
              return null;
            }

            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ id, icon, name }) => (
                  <CommandItem key={id} onSelect={onItemClick({ id, type })}>
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
});
