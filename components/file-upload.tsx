"use client";

import { FC } from 'react';

import { UploadDropzone } from '@/lib/uploadthing';
import { OurFileRouter } from '@/app/api/uploadthing/core';

import "@uploadthing/react/styles.css";

interface FileUploadProps {
  endpoint: keyof OurFileRouter;
  onChange: (url?: string) => void;
  value: string;
}

export const FileUpload: FC<FileUploadProps> = ({ endpoint, onChange, value }) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url);
      }}
      onUploadError={(error) => {
        console.error(error);
      }}
    />
  );
};
