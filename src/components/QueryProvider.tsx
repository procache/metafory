import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

interface QueryProviderProps {
  children: ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
  // Create QueryClient instance inside component to avoid SSR issues
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered stale immediately - will refetch in background
            staleTime: 0,
            // Cache data for 5 minutes
            gcTime: 5 * 60 * 1000,
            // Refetch on window focus for fresh data
            refetchOnWindowFocus: true,
            // Don't retry on error (vote counts aren't critical)
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
