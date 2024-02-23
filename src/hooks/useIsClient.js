import React from 'react';

// TODO: Extract to a 'hooks' folder
export function useIsClient() {
  const [isClient, setClient] = React.useState(false);

  React.useEffect(() => {
    setClient(true);
  }, []);

  return isClient;
}
