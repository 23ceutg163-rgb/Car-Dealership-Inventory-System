import { QueryClient } from '@tanstack/react-query'

/**
 * Global TanStack Query client with production-sensible defaults.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes — avoids unnecessary refetches
      staleTime: 1000 * 60 * 5,
      // Cache data for 10 minutes after component unmount
      gcTime: 1000 * 60 * 10,
      // Only retry failed requests once
      retry: 1,
      // Retry after 2 seconds
      retryDelay: 2000,
      // Don't refetch on window focus in development (noisy)
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Don't retry failed mutations by default (avoid duplicate side effects)
      retry: 0,
    },
  },
})

export default queryClient
