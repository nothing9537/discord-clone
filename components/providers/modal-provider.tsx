"use client";

import { FC, useEffect, useState } from 'react';

import { CreateServerModal } from '../modals/create-server-modal';
import { InviteModal } from '../modals/invite-modal';
import { EditServerModal } from '../modals/edit-server-modal';

export const ModalProvider: FC = () => {
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
    </>
  );
};
