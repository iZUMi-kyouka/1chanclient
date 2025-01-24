import Pagination from '@/interfaces/pagination';
import { forwardRef } from 'react';
import WrappedLoading from './wrappedLoading';

// Define the combined prop types
type InfiniteScrollLoadingProps = React.ComponentProps<typeof WrappedLoading> & {
  pagination: Pagination;
};

const InfiniteScrollLoading = forwardRef<HTMLDivElement, InfiniteScrollLoadingProps>(
  ({ pagination, ...wrappedLoadingProps }, ref) => {
    if (pagination.current_page === pagination.last_page) {
      return null;
    } else {
      return (
        <div ref={ref}>
          <WrappedLoading {...wrappedLoadingProps} />
        </div>
      );
    }
  }
);

InfiniteScrollLoading.displayName = 'InfiniteScrollLoading';


export default InfiniteScrollLoading;