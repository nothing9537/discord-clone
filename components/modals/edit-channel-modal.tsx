"use client";

import axios from 'axios';
import qs from 'query-string';
import { FC, useCallback, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import { ChannelType } from '@prisma/client';
import * as z from 'zod';

import { useModal } from '@/hooks/use-modal-store';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Form, FormControl } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FormFieldWrapper } from '../form-field-wrapper';

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Channel name is required."
  }).refine((name) => name.toLowerCase() !== 'general', { message: "Channel name cannot be 'general'" }),
  type: z.nativeEnum(ChannelType),
})

export const EditChannelModal: FC = memo(() => {
  const { isOpen, onClose, type, data } = useModal();
  const { channel } = data;
  const router = useRouter();

  const isModalOpen = isOpen && type === 'editChannel';

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      type: channel?.type || ChannelType.TEXT,
    }
  });

  useEffect(() => {
    if (channel) {
      form.setValue('name', channel.name);
      form.setValue('type', channel.type);
    }
  }, [form, channel]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      const requestUrl = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: data.server?.id,
        }
      });

      await axios.patch(requestUrl, values);
      router.refresh();
      form.reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Edit channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-8 px-6'>
              <FormFieldWrapper form={form} name='name' label={{ value: 'Channel name' }}>
                {({ field }) => (
                  <Input
                    disabled={isLoading}
                    placeholder='Enter channel name'
                    className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                    {...field}
                  />
                )}
              </FormFieldWrapper>
              <FormFieldWrapper form={form} name='type' label={{ value: 'Channel type' }}>
                {({ field }) => (
                  <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                        <SelectValue placeholder="Select a channel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ChannelType).map((type) => (
                        <SelectItem key={type} value={type} className='capitalize'>
                          {type.toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormFieldWrapper>
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button disabled={isLoading} variant="primary">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
