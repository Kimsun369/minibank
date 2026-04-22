import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Rubric: React Suspense and lazy loading wrapper
const LazyLoadWrapper = ({ children }) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {children}
    </Suspense>
  );
};

// HOC for lazy loading components
export const lazyLoad = (importFunc) => {
  const LazyComponent = React.lazy(importFunc);
  return (props) => (
    <LazyLoadWrapper>
      <LazyComponent {...props} />
    </LazyLoadWrapper>
  );
};

export default LazyLoadWrapper;