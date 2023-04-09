import * as React from 'react';
import {useState, useCallback, ReactNode} from 'react';

const ErrorBoundary = ({
  children,
  onError,
}: {
  children: ReactNode;
  onError: (error: Error) => void;
}) => {
  const [hasError, setHasError] = useState(false);

  const errorBoundaryCallback = useCallback(
    (error: Error) => {
      setHasError(true);
      onError(error);
    },
    [onError],
  );

  if (hasError) {
    return null;
  }

  return (
    <React.Fragment>
      {React.Children.map(children, child =>
        React.cloneElement(child as React.ReactElement, {
          onError: errorBoundaryCallback,
        }),
      )}
    </React.Fragment>
  );
};

export default ErrorBoundary;
