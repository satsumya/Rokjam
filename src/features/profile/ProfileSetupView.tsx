import { Pressable, View } from 'react-native';

import {
  AddressSearch,
  Avatar,
  BottomSheet,
  Button,
  Icon,
  LevelRow,
  Link,
  Modal,
  Screen,
  Section,
  TagInput,
  Text,
  TextField,
} from '../../components';
import { PET_ROCK_AVATARS } from '../../constants/difficultyLevels';
import {
  IMPROVEMENT_TAG_SUGGESTIONS,
  STRENGTH_TAG_SUGGESTIONS,
} from '../../constants/mockData';
import type { Location } from '../../domain/types/profile';
import { ui } from '../../theme/colors';
import { space } from '../../theme/spacing';

export type ProfileSetupViewProps = {
  avatar: string;
  usernameDraft: string;
  usernameError?: string;
  usernameSuccess?: string;
  canConfirmUsername: boolean;
  isEditingCompleteProfile: boolean;
  locations: Location[];
  openLocationId: string | null;
  levelsNudgeLocationId: string | null;
  deleteTarget: Location | undefined;
  levelImpactPending: boolean;
  strengthTags: string[];
  improvementTags: string[];
  onAvatarSelect: (avatar: string) => void;
  onUsernameDraftChange: (value: string) => void;
  onConfirmUsername: () => void;
  onExit: () => void;
  onGoToDashboard: () => void;
  onToggleLocation: (locationId: string, isOpen: boolean) => void;
  onAddLocation: (address: string) => void;
  onUpdateLocation: (id: string, patch: Partial<Location>) => void;
  onSetHomeLocation: (id: string) => void;
  onDeleteLocationRequest: (id: string) => void;
  onConfirmDeleteLocation: () => void;
  onCancelDeleteLocation: () => void;
  onToggleLevelSort: (locationId: string) => void;
  onRunLevelEdit: (locationId: string, action: () => void) => void;
  onUpdateLevel: (locationId: string, levelId: string, patch: Partial<Location['levels'][number]>) => void;
  onMoveLevel: (locationId: string, levelId: string, direction: 'up' | 'down') => void;
  onRemoveLevel: (locationId: string, levelId: string) => void;
  onReorderLevels: (locationId: string, fromIndex: number, toIndex: number) => void;
  onAddLevel: (locationId: string) => void;
  onClearLevelsNudge: () => void;
  onAddStrengthTag: (tag: string) => void;
  onRemoveStrengthTag: (tag: string) => void;
  onAddImprovementTag: (tag: string) => void;
  onRemoveImprovementTag: (tag: string) => void;
  onConfirmLevelImpact: () => void;
  onCancelLevelImpact: () => void;
};

export function ProfileSetupView({
  avatar,
  usernameDraft,
  usernameError,
  usernameSuccess,
  canConfirmUsername,
  isEditingCompleteProfile,
  locations,
  openLocationId,
  levelsNudgeLocationId,
  deleteTarget,
  levelImpactPending,
  strengthTags,
  improvementTags,
  onAvatarSelect,
  onUsernameDraftChange,
  onConfirmUsername,
  onExit,
  onGoToDashboard,
  onToggleLocation,
  onAddLocation,
  onUpdateLocation,
  onSetHomeLocation,
  onDeleteLocationRequest,
  onConfirmDeleteLocation,
  onCancelDeleteLocation,
  onToggleLevelSort,
  onRunLevelEdit,
  onUpdateLevel,
  onMoveLevel,
  onRemoveLevel,
  onReorderLevels,
  onAddLevel,
  onClearLevelsNudge,
  onAddStrengthTag,
  onRemoveStrengthTag,
  onAddImprovementTag,
  onRemoveImprovementTag,
  onConfirmLevelImpact,
  onCancelLevelImpact,
}: ProfileSetupViewProps) {
  return (
    <Screen
      title="Member profile"
      headerRight={
        <Button
          icon="close"
          variant="ghost"
          size="small"
          accessibilityLabel="Exit"
          onPress={onExit}
        />
      }
      footer={
        isEditingCompleteProfile ? undefined : (
          <>
            <Button label="Go to dashboard" colorStyle="style1" onPress={onGoToDashboard} />
            <Link label="Skip for now" onPress={onExit} />
          </>
        )
      }
      overlay={
        <>
          <BottomSheet
            visible={Boolean(deleteTarget)}
            title="Delete location"
            onClose={onCancelDeleteLocation}
          >
            <Text variant="body">
              {deleteTarget
                ? `Remove “${deleteTarget.name}” and its difficulty levels?`
                : 'Remove this location?'}
            </Text>
            <Button label="Delete location" onPress={onConfirmDeleteLocation} />
            <Button label="Cancel" variant="ghost" onPress={onCancelDeleteLocation} />
          </BottomSheet>
          <Modal
            visible={levelImpactPending}
            title="Update past sessions?"
            onClose={onCancelLevelImpact}
            footer={
              <>
                <Button label="Continue" colorStyle="style1" onPress={onConfirmLevelImpact} />
                <Button label="Cancel" variant="ghost" onPress={onCancelLevelImpact} />
              </>
            }
          >
            <Text variant="body">
              Changing difficulty levels updates past climbing sessions at this location. If you
              don’t want to change past sessions, cancel and add a new location instead.
            </Text>
          </Modal>
        </>
      }
    >
      <Section title="Profile pic">
        <View style={{ flexDirection: 'row', gap: space[12], flexWrap: 'wrap' }}>
          {PET_ROCK_AVATARS.map((rock) => (
            <Pressable
              key={rock}
              onPress={() => onAvatarSelect(rock)}
              style={{
                borderWidth: 1,
                borderColor: avatar === rock ? ui.borderStrong : ui.border,
                borderRadius: 8,
                padding: space[12],
                minWidth: 56,
                alignItems: 'center',
              }}
            >
              <Avatar emoji={rock} size="lg" />
            </Pressable>
          ))}
        </View>
      </Section>

      <Section title="Username">
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            gap: space[8],
          }}
        >
          <View style={{ flexGrow: 1, flexBasis: 160, minWidth: 0 }}>
            <TextField
              value={usernameDraft}
              onChangeText={onUsernameDraftChange}
              placeholder="Choose a username"
              error={usernameError}
              success={usernameSuccess}
              onSubmitEditing={onConfirmUsername}
              returnKeyType="done"
              maxLength={20}
            />
          </View>
          {canConfirmUsername ? (
            <Button
              icon="checkFat"
              colorStyle="style1"
              size="medium"
              accessibilityLabel="Confirm username"
              onPress={onConfirmUsername}
            />
          ) : null}
        </View>
      </Section>

      <Section title="Locations">
        {locations.map((location) => {
          const isOpen = openLocationId === location.id;
          return (
            <View
              key={location.id}
              style={{
                borderWidth: 1,
                borderColor: ui.border,
                borderRadius: 8,
                overflow: isOpen ? 'visible' : 'hidden',
                zIndex: isOpen ? 3 : 1,
              }}
            >
              <Pressable
                onPress={() => onToggleLocation(location.id, isOpen)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: space[12],
                  backgroundColor: ui.surfaceMuted,
                  gap: space[8],
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  borderBottomLeftRadius: isOpen ? 0 : 8,
                  borderBottomRightRadius: isOpen ? 0 : 8,
                }}
              >
                {location.isHome ? <Icon name="house" size="xs" color={ui.text} /> : null}
                <Text variant="body" weight="bold" style={{ flex: 1, minWidth: 0 }}>
                  {location.nickname?.trim() ? location.nickname.trim() : location.name}
                </Text>
                <Icon name={isOpen ? 'caretUp' : 'caretDown'} size="xs" color={ui.text} />
              </Pressable>

              {isOpen ? (
                <View style={{ padding: space[12], gap: space[12], backgroundColor: ui.surface }}>
                  <AddressSearch
                    initialValue={location.name}
                    clearOnSelect={false}
                    onSelect={(address) => onUpdateLocation(location.id, { name: address })}
                  />
                  <TextField
                    label="Nickname"
                    value={location.nickname ?? ''}
                    onChangeText={(nickname) =>
                      onUpdateLocation(location.id, {
                        nickname: nickname.length === 0 ? undefined : nickname,
                      })
                    }
                    placeholder="e.g. Home wall"
                  />
                  <View style={{ flexDirection: 'row', gap: space[8], flexWrap: 'wrap' }}>
                    {!location.isHome ? (
                      <Button
                        label="Set as home"
                        variant="secondary"
                        onPress={() => onSetHomeLocation(location.id)}
                      />
                    ) : null}
                    <Button
                      label="Delete location"
                      variant="ghost"
                      onPress={() => onDeleteLocationRequest(location.id)}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: space[8],
                    }}
                  >
                    <Text variant="body" weight="bold" style={{ flexShrink: 1, minWidth: 0 }}>
                      Difficulty levels
                    </Text>
                    <Button
                      label={location.levelSort === 'easy-hard' ? 'Easy → Hard' : 'Hard → Easy'}
                      variant="ghost"
                      onPress={() =>
                        onRunLevelEdit(location.id, () => onToggleLevelSort(location.id))
                      }
                    />
                  </View>

                  {levelsNudgeLocationId === location.id ? (
                    <Text variant="bodySmall" color={ui.textMuted}>
                      Add colour grades for this location so you can log climbs against them.
                    </Text>
                  ) : null}

                  {location.levels.map((level, index) => (
                    <LevelRow
                      key={level.id}
                      level={level}
                      index={index}
                      total={location.levels.length}
                      takenColors={location.levels
                        .filter((item) => item.id !== level.id)
                        .map((item) => item.color)}
                      onUpdate={(patch) =>
                        onRunLevelEdit(location.id, () => onUpdateLevel(location.id, level.id, patch))
                      }
                      onMoveUp={() =>
                        onRunLevelEdit(location.id, () => onMoveLevel(location.id, level.id, 'up'))
                      }
                      onMoveDown={() =>
                        onRunLevelEdit(location.id, () => onMoveLevel(location.id, level.id, 'down'))
                      }
                      onRemove={() =>
                        onRunLevelEdit(location.id, () => onRemoveLevel(location.id, level.id))
                      }
                      onReorder={(fromIndex, toIndex) => {
                        onRunLevelEdit(location.id, () =>
                          onReorderLevels(location.id, fromIndex, toIndex),
                        );
                      }}
                    />
                  ))}

                  <Button
                    label="Add level"
                    variant="secondary"
                    onPress={() => {
                      onRunLevelEdit(location.id, () => {
                        onAddLevel(location.id);
                        onClearLevelsNudge();
                      });
                    }}
                  />
                </View>
              ) : null}
            </View>
          );
        })}

        <AddressSearch label={false} onSelect={onAddLocation} />
      </Section>

      <TagInput
        label="Strengths"
        tags={strengthTags}
        suggestions={STRENGTH_TAG_SUGGESTIONS}
        onAdd={onAddStrengthTag}
        onRemove={onRemoveStrengthTag}
      />

      <TagInput
        label="Areas to improve"
        tags={improvementTags}
        suggestions={IMPROVEMENT_TAG_SUGGESTIONS}
        onAdd={onAddImprovementTag}
        onRemove={onRemoveImprovementTag}
      />
    </Screen>
  );
}
