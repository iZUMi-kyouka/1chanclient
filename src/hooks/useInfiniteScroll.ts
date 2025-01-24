import { useEffect } from 'react';

/**
 * Runs the trigger function to useSWRInfinite to request for the next page whenever
 * the end-of-page reference object is inside the user's viewport
 * @param size current page size object returned by useSWRInfinite
 * @param setSize the function set page size returned by useSWRInfinite
 * @param inView the state returned by useInView of whether the object used
 * as reference to request for the next page is currently in view
 */
export default function useInfiniteScroll(
  size: number,
  setSize: (
    size: number | ((_size: number) => number)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any[] | undefined>,
  inView: boolean
) {
  useEffect(() => {
    setSize(size + 1);
  }, [inView]);
}
