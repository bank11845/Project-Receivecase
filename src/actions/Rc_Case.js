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

    const { data, isLoading, error, isValidating, mutate  } = useSWR(url, fetcher, swrOptions);
    console.log(data)
    const memoizedValue = useMemo(
      () => ({
        Receivecase: data || [],
        ReceivecaseLoading: isLoading,
        ReceivecaseError: error,
        ReceivecaseValidating: isValidating,
        refetchReceivecase: mutate
      }),
      [data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
  }


  




