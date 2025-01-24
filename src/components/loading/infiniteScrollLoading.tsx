import Pagination from '@/interfaces/pagination';
import { forwardRef } from 'react';
import WrappedLoading from './wrappedLoading';

type InfiniteScrollLoadingProps = React.ComponentProps<
  typeof WrappedLoading
> & {
  pagination: Pagination;
};

/**
 * Shows a loading spinner at the end of a thread / comment list.
 * @params ref Accepts a ref to be used with useInView to trigger loading the next pages
 */
const InfiniteScrollLoading = forwardRef<
  HTMLDivElement,
  InfiniteScrollLoadingProps
>(({ pagination, ...wrappedLoadingProps }, ref) => {
  if (pagination.current_page === pagination.last_page) {
    return null;
  } else {
    return (
      <div ref={ref}>
        <WrappedLoading {...wrappedLoadingProps} />
      </div>
    );
  }
});

InfiniteScrollLoading.displayName = 'InfiniteScrollLoading';

export default InfiniteScrollLoading;
