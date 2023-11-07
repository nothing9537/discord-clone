import * as z from 'zod';
import { FC, useCallback } from 'react'
import { useUser, withClerk } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useModal } from '@/hooks/use-modal-store';
import { FormFieldWrapper } from '@/components/form-field-wrapper';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Form } from '../../ui/form';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'Please provide first name' }),
  lastName: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export const UserSettingsModal: FC = withClerk(() => {
  const { isOpen, onClose, type } = useModal();
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'userSettings';

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = useCallback(async (values: FormSchema) => {
    console.log(values);

    if (isSignedIn && user) {
      console.log('request');

      try {
        await user.update({ firstName: values.firstName, lastName: values.lastName });

        router.refresh()
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
  }, [isSignedIn, router, user]);

  const onModalClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const inputClassName = 'bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0';

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Edit profile
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Here you can edit your user profile
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-4 px-6'>
              <FormFieldWrapper form={form} name='firstName' label={{ value: 'First name' }}>
                {({ field }) => (
                  <Input
                    disabled={isSubmitting}
                    placeholder='Enter your first name'
                    className={inputClassName}
                    {...field}
                  />
                )}
              </FormFieldWrapper>
              <FormFieldWrapper form={form} name='lastName' label={{ value: 'Last name' }}>
                {({ field }) => (
                  <Input
                    disabled={isSubmitting}
                    placeholder='Enter your last name'
                    className={inputClassName}
                    {...field}
                  />
                )}
              </FormFieldWrapper>
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <div className='flex items-center justify-between w-full'>
                <Button variant="ghost" type='submit' disabled={isSubmitting} onClick={onModalClose}>
                  Cancel
                </Button>
                <Button variant="primary" type='submit' disabled={isSubmitting}>
                  Save
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
