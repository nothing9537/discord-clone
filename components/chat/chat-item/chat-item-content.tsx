"use client";

import { Dispatch, FC, SetStateAction, useEffect, memo } from 'react';
import { FileIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import Image from 'next/image';

import { DirectMessageWithMemberWithProfile, MessageWithMemberWithProfile } from '@/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormFieldWrapper } from '@/components/form-field-wrapper';

import { FormSchema } from './chat-item';

interface ChatContentProps {
  isEditing: boolean;
  isSubmitting: boolean;
  message: MessageWithMemberWithProfile | DirectMessageWithMemberWithProfile;
  form: UseFormReturn<FormSchema>;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  onSubmit: (values: FormSchema) => Promise<void>;
}

export const ChatItemContent: FC<ChatContentProps> = memo((props) => {
  const { message, isEditing, form, onSubmit, setIsEditing, isSubmitting } = props;
  const { content, fileUrl, deleted, createdAt, updatedAt } = message;

  const fileType = fileUrl?.split('.').pop();
  const isPDF = fileType === 'pdf' && fileUrl;
  const isImage = !isPDF && fileUrl;
  const isUpdated = createdAt !== updatedAt;

  useEffect(() => {
    form.reset({ content });
  }, [form, content]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setIsEditing(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [setIsEditing]);

  return (
    <>
      {isImage && (
        <a
          href={fileUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'
        >
          <Image src={fileUrl} alt={content} fill className='object-cover' />
        </a>
      )}
      {isPDF && (
        <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
          <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
          <a
            href={fileUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline w-full h-full'
          >
            PDF File
          </a>
        </div>
      )}
      {!fileUrl && !isEditing && (
        <p
          className={cn(
            'text-sm text-zinc-600 dark:text-zinc-300',
            deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
          )}
        >
          {content}
          {isUpdated && !deleted && (
            <span className='text=[10px] mx-2 text-zinc-500 dark:text-zinc-400 italic'>
              (edited)
            </span>
          )}
        </p>
      )}
      {!fileUrl && isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex items-center w-full gap-x-2 pt-2'>
            <FormFieldWrapper form={form} name='content'>
              {({ field }) => (
                <div className='relative w-full'>
                  <Input
                    className='p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                    placeholder='Edited message'
                    disabled={isSubmitting}
                    {...field}
                  />
                </div>
              )}
            </FormFieldWrapper>
            <Button size="sm" variant='primary' disabled={isSubmitting}>
              Save
            </Button>
          </form>
          <span className='text-[10px] mt-1 text-zinc-400'>
            Press escape to cancel, enter to save
          </span>
        </Form>
      )}
    </>
  );
});
