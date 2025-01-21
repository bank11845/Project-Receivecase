  // eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
  import useSWR from 'swr';
  import { useMemo } from 'react';

  import { fetcher, endpoints } from 'src/utils/axios';

  // ----------------------------------------------------------------------

  const swrOptions = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  };

  // ----------------------------------------------------------------------

  export function useGetReceivecase() {
    const url = endpoints.dashboard.receivecaseJoin;

    const { data, isLoading, error, isValidating } = useSWR(url, fetcher, swrOptions);
    console.log(data)
    const memoizedValue = useMemo(
      () => ({
        Receivecase: data || [],
        ReceivecaseLoading: isLoading,
        ReceivecaseError: error,
        ReceivecaseValidating: isValidating,
        
      }),
      [data, error, isLoading, isValidating]
    );

    return memoizedValue;
  }






