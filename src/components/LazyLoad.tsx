import React, { ReactNode, Suspense } from "react";

const LazyLoad: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <Suspense fallback={null}>{children}</Suspense>;
};

export default LazyLoad;
