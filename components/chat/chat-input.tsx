"use client";

import * as z from 'zod';
import axios from 'axios';
import qs from 'query-string';
import { FC, useCallback, memo } from 'react'
import { Plus } from 'lucide-react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { useModal } from '@/hooks/use-modal-store';

import { Form, FormControl } from '../ui/form';
import { Input } from '../ui/input';
import { EmojiPicker } from '../emoji-picker';
import { FormFieldWrapper } from '../form-field-wrapper';

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, string>;
  name: string;
  type: 'conversation' | 'channel';
}

const formSchema = z.object({
  content: z.string().min(1, { message: 'Please provide at least one symbol' }),
});

type FormSchema = z.infer<typeof formSchema>;

export const ChatInput: FC<ChatInputProps> = memo(({ apiUrl, query, name, type }) => {
  const { onOpen } = useModal();
  const router = useRouter();

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

      await axios.post(requestUrl, values);

      form.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const onOpenMessageFile = useCallback(() => {
    onOpen('messageFile', { apiUrl, query })
  }, [apiUrl, query, onOpen]);

  const onEmojiSelect = useCallback((field: ControllerRenderProps<FormSchema>) => (emoji: string) => {
    field.onChange(`${field.value} ${emoji}`);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormFieldWrapper form={form} name='content' customControl>
          {({ field }) => (
            <FormControl>
              <div className='relative p-4 pb-6'>
                <button
                  type='button'
                  className='absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center'
                  onClick={onOpenMessageFile}
                >
                  <Plus className='text-white dark:text-[#313338]' />
                </button>
                <Input
                  disabled={isLoading}
                  className='px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                  placeholder={`Message ${type === 'conversation' ? `to ${name}` : '#' + name}`}
                  {...field}
                />
                <div className='absolute top-7 right-8'>
                  <EmojiPicker
                    onChange={onEmojiSelect(field)}
                  />
                </div>
              </div>
            </FormControl>
          )}
        </FormFieldWrapper>
      </form>
    </Form>
  );
});
