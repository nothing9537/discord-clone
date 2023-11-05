"use client";

import axios from 'axios';
import qs from 'query-string';
import * as z from 'zod';
import { FC, memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';

import { useModal } from '@/hooks/use-modal-store';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '../ui/form';
import { Button } from '../ui/button';
import { FileUpload } from '../file-upload';

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required."
  })
});

type FormSchema = z.infer<typeof formSchema>;

export const MessageFileModal: FC = memo(() => {
  const { isOpen, onClose, type, data } = useModal();
  const { server, apiUrl, query } = data;
  const router = useRouter();

  const isModalOpen = isOpen && type === 'messageFile';

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      fileUrl: "",
    }
  });

  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose])

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormSchema) => {
    console.log(data);

    const requestUrl = qs.stringifyUrl({
      url: apiUrl || '',
      query,
    });

    await axios.post(requestUrl, {
      content: data.fileUrl,
      ...data,
    });

    form.reset();
    router.refresh();
    handleClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Add an attachment
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Send a file as message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button disabled={isLoading} variant="primary">
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
