"use client";

import { FC, useEffect, useState, memo } from 'react';

import { CreateServerModal } from '../modals/create-server-modal';
import { EditServerModal } from '../modals/edit-server-modal';
import { MembersModal } from '../modals/members-modal';
import { InviteModal } from '../modals/invite-modal';
import { CreateChannelModal } from '../modals/create-channel-modal;';
import { LeaveServerModal } from '../modals/leave-server-modal';
import { DeleteServerModal } from '../modals/delete-server-modal';
import { DeleteChannelModal } from '../modals/delete-channel-modal';
import { EditChannelModal } from '../modals/edit-channel-modal';

export const ModalProvider: FC = memo(() => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
    </>
  );
});
