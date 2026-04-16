import { useEffect } from 'react';
import { useSessionStore } from '../store/session';

export default function SessionBootstrap() {
  const hydrate = useSessionStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return null;
}
