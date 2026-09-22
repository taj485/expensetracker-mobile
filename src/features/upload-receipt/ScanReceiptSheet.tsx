import { ScrollView, StyleSheet } from 'react-native';

import { useSelectedSpace } from '@/core/spaces/SelectedSpaceProvider';
import { SelectSpacesStep } from '@/features/spaces/components/SelectSpacesStep';
import { EmptyState } from '@/shared/components/QueryState';
import { SheetHandle } from '@/shared/components/SheetHandle';
import { spacing, type Theme, useThemedStyles } from '@/theme';

import { CaptureStep } from './components/CaptureStep';
import { ReadingStep } from './components/ReadingStep';
import { ReviewStep } from './components/ReviewStep';
import { useConfirmDiscardDrafts } from './hooks/useConfirmDiscardDrafts';
import { useReceiptScan } from './hooks/useReceiptScan';

/** Scan sheet: photo → AI extraction → review → choose spaces → save. */
export function ScanReceiptSheet() {
  const styles = useThemedStyles(createStyles);
  const { selectedSpace } = useSelectedSpace();

  if (!selectedSpace) {
    return <EmptyState title="No space selected" message="Create a space before scanning receipts." />;
  }

  return (
    <ScrollView
      style={styles.sheet}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      // Keeps focused price/date fields above the keyboard inside the sheet.
      automaticallyAdjustKeyboardInsets>
      <SheetHandle />
      <ScanFlow spaceId={selectedSpace.id} />
    </ScrollView>
  );
}

function ScanFlow({ spaceId }: { spaceId: number }) {
  const { spaces } = useSelectedSpace();
  const scan = useReceiptScan(spaceId);
  const { close } = useConfirmDiscardDrafts(scan.drafts.length > 0);

  switch (scan.step) {
    case 'capture':
      return <CaptureStep error={scan.error} onPick={scan.start} />;
    case 'reading':
      return <ReadingStep photo={scan.photo} onCancel={scan.reset} />;
    case 'review':
      return (
        <ReviewStep
          photo={scan.photo}
          drafts={scan.drafts}
          draftErrors={scan.draftErrors}
          error={scan.error}
          photoUploadFailed={scan.photoUploadFailed}
          onChange={scan.updateDraft}
          onRemove={scan.removeDraft}
          onContinue={scan.continueToSpaces}
          onRetake={scan.reset}
        />
      );
    case 'spaces':
      return (
        <SelectSpacesStep
          spaces={spaces}
          initialSpaceId={spaceId}
          itemCount={scan.drafts.length}
          saving={scan.saving}
          error={scan.error}
          onBack={() => scan.setStep('review')}
          onSave={async spaceIds => {
            if (await scan.save(spaceIds)) close();
          }}
        />
      );
  }
}

const createStyles = ({ colors }: Theme) =>
  StyleSheet.create({
    sheet: { flex: 1, backgroundColor: colors.bgElevated },
    content: { padding: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing['3xl'], gap: spacing.base },
  });
