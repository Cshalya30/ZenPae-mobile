import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFinanceStore } from '../store/financeStore';

export default function StoreHydration({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useFinanceStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // In case hydration already happened
    if (useFinanceStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return unsub;
  }, []);

  if (!hydrated) {
    return <View />;
  }

  return <>{children}</>;
}
