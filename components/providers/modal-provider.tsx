"use client";

import { FC, useEffect, useState } from 'react';

import { CreateServerModal } from '../modals/create-server-modal';

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
    </>
  );
};
