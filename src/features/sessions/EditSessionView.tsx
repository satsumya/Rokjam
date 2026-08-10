import { View } from 'react-native';

import {
  BottomSheet,
  Button,
  Card,
  ClimbEditor,
  Link,
  RadioRow,
  Screen,
  Section,
  SessionClimbsList,
  SessionTimeDropdown,
  Text,
  TextField,
} from '../../components';
import type { Location } from '../../domain/types/profile';
import type { ClimbingSession, SessionClimb } from '../../types/climbingSession';
import { ui } from '../../theme/colors';
import { formatSessionDate } from '../../utils/sessionUtils';
import { space } from '../../theme/spacing';

export type EditSessionViewProps = {
  session: ClimbingSession | null;
  location: Location | undefined;
  canEdit: boolean;
  editingClimbId: string | null;
  draftClimb: SessionClimb | null;
  isPublic: boolean;
  publicError: string;
  removeTarget: SessionClimb | null;
  onSaveSession: () => void;
  onCancel: () => void;
  onDateChange: (date: string) => void;
  onStartTimeChange: (startTime: string) => void;
  onEndTimeChange: (endTime: string) => void;
  onSetPrivate: () => void;
  onSetPublic: () => void;
  onAddClimb: () => void;
  onEditClimb: (climb: SessionClimb) => void;
  onRemoveClimb: (climb: SessionClimb) => void;
  onDifficultyChange: (climb: SessionClimb, level: Location['levels'][number]) => void;
  onDraftChange: (patch: Partial<SessionClimb>) => void;
  onSaveClimb: () => void;
  onCancelClimbEdit: () => void;
  onConfirmRemoveClimb: () => void;
  onCancelRemoveClimb: () => void;
  onBack: () => void;
};

export function EditSessionView({
  session,
  location,
  canEdit,
  editingClimbId,
  draftClimb,
  isPublic,
  publicError,
  removeTarget,
  onSaveSession,
  onCancel,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onSetPrivate,
  onSetPublic,
  onAddClimb,
  onEditClimb,
  onRemoveClimb,
  onDifficultyChange,
  onDraftChange,
  onSaveClimb,
  onCancelClimbEdit,
  onConfirmRemoveClimb,
  onCancelRemoveClimb,
  onBack,
}: EditSessionViewProps) {
  if (!canEdit || !session) {
    return (
      <Screen title="Cannot edit" footer={<Link label="Back" onPress={onBack} />}>
        <Card>
          <Text variant="body">Only completed sessions can be edited here.</Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen
      title="Edit session"
      footer={
        <>
          <Button label="Save changes" onPress={onSaveSession} />
          <Link label="Cancel" onPress={onCancel} />
        </>
      }
      overlay={
        <BottomSheet
          visible={Boolean(removeTarget)}
          title="Remove climb?"
          onClose={onCancelRemoveClimb}
        >
          <Text variant="body">
            {removeTarget?.name?.trim()
              ? `"${removeTarget.name}" has details that will be lost.`
              : 'This climb has details that will be lost.'}
          </Text>
          <Button label="Remove climb" onPress={onConfirmRemoveClimb} />
          <Button label="Cancel" variant="ghost" onPress={onCancelRemoveClimb} />
        </BottomSheet>
      }
    >
      <Section title="Session">
        <Text variant="body" weight="bold">
          {formatSessionDate(session.date)}
        </Text>
        <TextField label="Date" value={session.date} onChangeText={onDateChange} />
        <SessionTimeDropdown label="Start time" value={session.startTime} onChange={onStartTimeChange} />
        <SessionTimeDropdown
          label="End time"
          value={session.endTime ?? ''}
          onChange={onEndTimeChange}
        />
        <View style={{ gap: space[4] }}>
          <RadioRow label="Private" selected={!isPublic} onPress={onSetPrivate} />
          <RadioRow label="Public" selected={isPublic} onPress={onSetPublic} />
        </View>
        {publicError ? (
          <Text variant="body" color={ui.danger}>
            {publicError}
          </Text>
        ) : null}
      </Section>

      {!draftClimb ? (
        <>
          <Button label="Add climb" variant="secondary" onPress={onAddClimb} />
          <SessionClimbsList
            climbs={session.climbs}
            location={location}
            onEditClimb={onEditClimb}
            onRemoveClimb={onRemoveClimb}
            onDifficultyChange={onDifficultyChange}
          />
        </>
      ) : (
        <View style={{ gap: space[12] }}>
          <ClimbEditor
            climb={draftClimb}
            location={location}
            onChange={(patch) => onDraftChange(patch)}
          />
          <Button label="Save climb" onPress={onSaveClimb} />
          <Button label="Cancel" variant="ghost" onPress={onCancelClimbEdit} />
        </View>
      )}
    </Screen>
  );
}
