import { router } from 'expo-router';
import { type ReactNode, useState } from 'react';

import { useAiReceiptConsent, useGiveAiReceiptConsent } from '@/core/queries/accountQueries';
import { ErrorState, LoadingState } from '@/shared/components/QueryState';

import { ConsentStep } from './ConsentStep';

/**
 * Shows the consent step until the server confirms this account allowed AI receipt reading,
 * and only then mounts `children` (the capture step, and with it the camera and its prompt).
 */
export function ConsentGate({ children }: { children: ReactNode }) {
  const consent = useAiReceiptConsent();
  const give = useGiveAiReceiptConsent();
  // Only a server answer from after the sheet opened counts, never a cached one.
  const confirmed = consent.isFetchedAfterMount && !consent.isError && consent.data?.given === true;
  // Once confirmed, stay open for the sheet's life: a later background refetch must not unmount a scan.
  const [allowed, setAllowed] = useState(false);

  if (confirmed && !allowed) setAllowed(true);

  if (allowed || confirmed) return children;

  if (consent.isFetching || !consent.isFetchedAfterMount) return <LoadingState />;

  if (consent.isError) {
    return (
      <ErrorState
        message="Couldn't check your scan settings. Check your connection and try again."
        onRetry={() => void consent.refetch()}
      />
    );
  }

  return (
    <ConsentStep
      allowing={give.isPending}
      saveFailed={give.isError}
      onAllow={() => give.mutate()}
      // A decline is never stored: close the scan sheet and open Add expense in its place.
      onDecline={() => router.replace('/add-expense')}
    />
  );
}
