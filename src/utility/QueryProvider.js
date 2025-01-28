"use client";

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

/**
 * Creates a new QueryClient instance with default options.
 * @returns {QueryClient} A new QueryClient instance.
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid re-fetching immediately on the client
        staleTime: 1000 * 60 * 10, // 10 minutes
        cacheTime: 1000 * 60 * 60, // 60 minutes
        retry: 1, // Retry failed queries 1 time
        retryDelay: (attemptIndex) =>
          Math.min(1000 * 2 ** (attemptIndex + 1), 60000), // Exponential backoff
        refetchOnWindowFocus: false, // Disable refetch on window focus
        refetchOnMount: false, // Disable refetch on mount
        refetchOnReconnect: false, // Disable refetch on reconnect
        refetchInterval: 1000 * 60 * 5, // 5 minutes
      },
    },
  });
}

let browserQueryClient = null;

/**
 * Gets the QueryClient instance based on the environment.
 * @returns {QueryClient} The QueryClient instance.
 */
function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one,
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) {
      browserQueryClient = createQueryClient();
    }
    return browserQueryClient;
  }
}

/**
 * ReactQueryProvider component that provides the QueryClient to the application.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {JSX.Element} The QueryClientProvider component.
 */
export default function ReactQueryProvider({ children }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
