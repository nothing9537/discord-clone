"use client";

import * as z from 'zod';
import axios from 'axios';
import qs from 'query-string';
import { FC } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '../ui/form';
import { Input } from '../ui/input';
import { Plus, SmileIcon } from 'lucide-react';
import { useSocket } from '../providers/socket-provider';

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, string>;
  name: string;
  type: 'conversation' | 'channel';
}

const formSchema = z.object({
  content: z.string().min(1),
});

type FormSchema = z.infer<typeof formSchema>;

export const ChatInput: FC<ChatInputProps> = ({ apiUrl, query, name, type }) => {
  const { socket } = useSocket();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: FormSchema) => {
    try {
      const requestUrl = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      // await socket?.emit({ message: values.content })

      await axios.post(requestUrl, values);

      console.log(values);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative p-4 pb-6'>
                  <button type='button' className='absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center'>
                    <Plus className='text-white dark:text-[#313338]' />
                  </button>
                  <Input
                    disabled={isLoading}
                    className='px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                    placeholder={`Message ${type === 'conversation' ? name : '#' + name}`}
                    {...field}
                  />
                  <div className='absolute top-7 right-8'>
                    <SmileIcon />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
