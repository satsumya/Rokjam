import { View } from 'react-native';

import {
  BottomSheet,
  Button,
  Card,
  ClimbEditor,
  Dropdown,
  Link,
  RadioRow,
  Screen,
  Section,
  SessionBottomNav,
  SessionClimbsList,
  SessionLocationPanel,
  SessionTimeDropdown,
  Text,
  TextField,
} from '../../components';
import type { AddLocationWithLevelsHandler, Location } from '../../domain/types/profile';
import type { ClimbingSession, SessionClimb } from '../../types/climbingSession';
import { ui } from '../../theme/colors';
import type { DropdownOption } from '../../components/molecules/Dropdown';
import { space } from '../../theme/spacing';

export type ActiveSessionViewProps = {
  session: ClimbingSession | null;
  location: Location | undefined;
  needsProfile: boolean;
  editingClimbId: string | null;
  draftClimb: SessionClimb | null;
  showEndSheet: boolean;
  isPublic: boolean;
  endTime: string;
  durationMinutes: number | undefined;
  customDuration: string;
  durationOptions: DropdownOption[];
  usernameInput: string;
  username: string;
  usernameError?: string;
  usernameSuccess?: string;
  climbPrompt: string;
  removeTarget: SessionClimb | null;
  dateDisplay: string;
  locations: Location[];
  onPrimaryNav: () => void;
  onEndSessionRequest: () => void;
  onDateChange: (display: string) => void;
  onLocationLinked: (locationId: string, locationName: string) => void;
  onAddLocationWithLevels: AddLocationWithLevelsHandler;
  onStartTimeChange: (startTime: string) => void;
  onDraftChange: (patch: Partial<SessionClimb>) => void;
  onCancelClimbEdit: () => void;
  onEditClimb: (climb: SessionClimb) => void;
  onRemoveClimb: (climb: SessionClimb) => void;
  onDifficultyChange: (climb: SessionClimb, level: Location['levels'][number]) => void;
  onSetPrivate: () => void;
  onSetPublic: () => void;
  onUsernameInputChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onDurationPresetChange: (value: string) => void;
  onCustomDurationChange: (value: string) => void;
  onConfirmEndSession: () => void;
  onCancelEndSheet: () => void;
  onConfirmRemoveClimb: () => void;
  onCancelRemoveClimb: () => void;
  onBackToDashboard: () => void;
};

export function ActiveSessionView({
  session,
  location,
  needsProfile,
  editingClimbId,
  draftClimb,
  showEndSheet,
  isPublic,
  endTime,
  durationMinutes,
  customDuration,
  durationOptions,
  usernameInput,
  username,
  usernameError,
  usernameSuccess,
  climbPrompt,
  removeTarget,
  dateDisplay,
  locations,
  onPrimaryNav,
  onEndSessionRequest,
  onDateChange,
  onLocationLinked,
  onAddLocationWithLevels,
  onStartTimeChange,
  onDraftChange,
  onCancelClimbEdit,
  onEditClimb,
  onRemoveClimb,
  onDifficultyChange,
  onSetPrivate,
  onSetPublic,
  onUsernameInputChange,
  onEndTimeChange,
  onDurationPresetChange,
  onCustomDurationChange,
  onConfirmEndSession,
  onCancelEndSheet,
  onConfirmRemoveClimb,
  onCancelRemoveClimb,
  onBackToDashboard,
}: ActiveSessionViewProps) {
  if (!session) {
    return (
      <Screen
        title="Session not found"
        footer={<Link label="Back to dashboard" onPress={onBackToDashboard} />}
      >
        <Card>
          <Text variant="body">This session could not be found.</Text>
        </Card>
      </Screen>
    );
  }

  const isEditingClimb = Boolean(draftClimb && editingClimbId);

  return (
    <Screen
      title="Climbing session"
      bottomNav={
        <SessionBottomNav
          primaryMode={isEditingClimb ? 'save' : 'add'}
          onPrimary={onPrimaryNav}
          onEndSession={onEndSessionRequest}
        />
      }
      overlay={
        <>
          <BottomSheet visible={showEndSheet} title="Save / end session" onClose={onCancelEndSheet}>
            <View style={{ gap: space[4] }}>
              <RadioRow label="Private" selected={!isPublic} onPress={onSetPrivate} />
              <RadioRow label="Public" selected={isPublic} onPress={onSetPublic} />
            </View>

            {isPublic && !username.trim() ? (
              <TextField
                label="Username"
                required
                value={usernameInput}
                onChangeText={onUsernameInputChange}
                error={usernameError}
                success={usernameSuccess}
                placeholder="Required for public sessions"
              />
            ) : isPublic && username.trim() ? (
              <Text variant="body">Sharing as {username}</Text>
            ) : null}

            <SessionTimeDropdown label="End time" value={endTime} onChange={onEndTimeChange} />

            <Dropdown
              label="Duration"
              value={durationMinutes != null ? String(durationMinutes) : ''}
              options={durationOptions}
              onChange={onDurationPresetChange}
              customValue={customDuration}
              onCustomChange={onCustomDurationChange}
              customPlaceholder="Minutes"
            />

            <Button label="Confirm and save session" onPress={onConfirmEndSession} />
            <Button label="Cancel" variant="ghost" onPress={onCancelEndSheet} />
          </BottomSheet>

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
        </>
      }
    >
      {needsProfile ? (
        <Card>
          <Text variant="body" weight="bold">
            Profile not complete
          </Text>
          <Text variant="body">
            You can keep logging this session. Tap Add location to search for your gym and set up
            difficulty levels.
          </Text>
        </Card>
      ) : null}

      {climbPrompt ? (
        <Text variant="body" color={ui.danger}>
          {climbPrompt}
        </Text>
      ) : null}

      <Section title="Session details">
        <TextField
          label="Date"
          value={dateDisplay}
          onChangeText={onDateChange}
          placeholder="Friday 03 Jul 2026"
        />
        <SessionLocationPanel
          locations={locations}
          sessionLocationId={session.locationId}
          onLocationLinked={onLocationLinked}
          onAddLocationWithLevels={onAddLocationWithLevels}
        />
        <SessionTimeDropdown label="Start time" value={session.startTime} onChange={onStartTimeChange} />
      </Section>

      {draftClimb && editingClimbId ? (
        <>
          <ClimbEditor climb={draftClimb} location={location} onChange={onDraftChange} />
          <Link label="Cancel" onPress={onCancelClimbEdit} />
        </>
      ) : (
        <SessionClimbsList
          climbs={session.climbs}
          location={location}
          onEditClimb={onEditClimb}
          onRemoveClimb={onRemoveClimb}
          onDifficultyChange={onDifficultyChange}
        />
      )}
    </Screen>
  );
}
