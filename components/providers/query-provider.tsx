"use client";

import { FC, ReactNode, useState, memo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const QueryProvider: FC<{ children: ReactNode }> = memo(({ children }) => {
  const [queryClient] = useState<QueryClient>(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
});
