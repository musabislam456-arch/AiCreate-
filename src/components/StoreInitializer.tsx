import { useEffect } from 'react';
import { useAppStore } from '../lib/store';

export function StoreInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAppStore(state => state.initialize);
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
