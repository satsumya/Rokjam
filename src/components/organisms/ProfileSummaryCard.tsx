import { useRef, useState } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Avatar } from '../atoms/Avatar';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Icon } from '../atoms/Icon';
import { Text } from '../atoms/Text';
import { TextField } from '../atoms/TextField';
import { AddLocationSheet } from './AddLocationSheet';
import { colors, ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';
import { space } from '../../theme/spacing';

function IdentityRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function IdentityCopy({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function UsernameEditRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function TagRow({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function TagPill({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function TagSection({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function DisplayTag({ label }: { label: string }) {
  return (
    <TagPill style={styles.tag}>
      <Text variant="body" weight="bold">
        {label}
      </Text>
    </TagPill>
  );
}

export function ProfileSummaryCard({
  avatar,
  username,
  locationNickname,
  locationName,
  strengthTags,
  improvementTags,
  addingUsername,
  usernameDraft,
  usernameError,
  usernameSuccess,
  canConfirmUsername,
  onUsernameChange,
  onUsernameConfirm,
  onUsernameCancel,
  onStartAddUsername,
}: {
  avatar: string;
  username: string;
  locationNickname?: string;
  locationName?: string;
  strengthTags: string[];
  improvementTags: string[];
  addingUsername?: boolean;
  usernameDraft?: string;
  usernameError?: string;
  usernameSuccess?: string;
  canConfirmUsername?: boolean;
  onUsernameChange?: (value: string) => void;
  onUsernameConfirm?: () => void;
  onUsernameCancel?: () => void;
  onStartAddUsername?: () => void;
}) {
  const [showAddLocation, setShowAddLocation] = useState(false);
  const blurCancelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nickname = locationNickname?.trim() || locationName?.trim();
  const hasLocation = Boolean(nickname);

  const clearBlurCancel = () => {
    if (blurCancelTimer.current) {
      clearTimeout(blurCancelTimer.current);
      blurCancelTimer.current = null;
    }
  };

  const scheduleBlurCancel = () => {
    clearBlurCancel();
    // Defer so the confirm check button can receive the press before we tear down the field.
    blurCancelTimer.current = setTimeout(() => {
      blurCancelTimer.current = null;
      onUsernameCancel?.();
    }, 150);
  };

  const confirmUsername = () => {
    clearBlurCancel();
    onUsernameConfirm?.();
  };

  return (
    <Card style={styles.card}>
      <IdentityRow style={styles.identity}>
        <Avatar emoji={avatar} size="xl" />
        <IdentityCopy style={styles.identityCopy}>
          {username.trim() ? (
            <Text variant="bodyLarge" weight="bold">
              {username}
            </Text>
          ) : addingUsername ? (
            <UsernameEditRow style={styles.usernameEdit}>
              <View style={styles.usernameField}>
                <TextField
                  value={usernameDraft ?? ''}
                  onChangeText={onUsernameChange ?? (() => {})}
                  placeholder="Username"
                  accessibilityLabel="Username"
                  error={usernameError}
                  success={usernameSuccess}
                  onSubmitEditing={confirmUsername}
                  onBlur={scheduleBlurCancel}
                  returnKeyType="done"
                  maxLength={20}
                  autoFocus
                />
              </View>
              {canConfirmUsername ? (
                <Button
                  icon="checkFat"
                  colorStyle="style1"
                  size="medium"
                  accessibilityLabel="Confirm username"
                  onPress={confirmUsername}
                />
              ) : null}
            </UsernameEditRow>
          ) : (
            <Pressable
              onPress={onStartAddUsername}
              accessibilityRole="button"
              accessibilityLabel="Add username"
              style={(state) => [{ alignSelf: 'flex-start', borderRadius: 4 }, interactionStyle(state)]}
            >
              <Text variant="bodyLarge" weight="bold" style={styles.addUsername}>
                Add username
              </Text>
            </Pressable>
          )}
          {hasLocation ? (
            <View style={styles.locationRow}>
              <Icon name="mapPin" size="xs" color={ui.textMuted} />
              <Text variant="bodySmall" color={ui.textMuted} style={styles.locationText}>
                {nickname}
              </Text>
            </View>
          ) : (
            <Button
              label="Add location"
              variant="secondary"
              size="small"
              onPress={() => setShowAddLocation(true)}
            />
          )}
        </IdentityCopy>
      </IdentityRow>

      {strengthTags.length ? (
        <TagSection style={styles.section}>
          <Text variant="body" weight="bold">
            Strengths:
          </Text>
          <TagRow style={styles.tags}>
            {strengthTags.map((tag) => (
              <DisplayTag key={tag} label={tag} />
            ))}
          </TagRow>
        </TagSection>
      ) : null}

      {strengthTags.length && improvementTags.length ? <View style={styles.divider} /> : null}

      {improvementTags.length ? (
        <TagSection style={styles.section}>
          <Text variant="body" weight="bold">
            Areas to improve:
          </Text>
          <TagRow style={styles.tags}>
            {improvementTags.map((tag) => (
              <DisplayTag key={tag} label={tag} />
            ))}
          </TagRow>
        </TagSection>
      ) : null}

      <AddLocationSheet
        visible={showAddLocation}
        onClose={() => setShowAddLocation(false)}
        onSaved={() => setShowAddLocation(false)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: ui.surface,
    borderColor: ui.borderSubtle,
    borderRadius: 16,
    padding: space[16],
    gap: space[12],
    // Soft green “shelf” matching the mock — solid offset, no blur.
    borderBottomWidth: 3,
    borderBottomColor: colors.brand.green.main,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  identityCopy: {
    flex: 1,
    minWidth: 0,
    gap: space[4],
  },
  usernameEdit: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: space[8],
  },
  usernameField: {
    flexGrow: 1,
    flexBasis: 140,
    minWidth: 0,
  },
  addUsername: {
    textDecorationLine: 'underline',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[4],
    flexWrap: 'wrap',
  },
  locationText: {
    flexShrink: 1,
    minWidth: 0,
  },
  section: {
    gap: space[8],
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[8],
  },
  tag: {
    borderWidth: 1,
    borderColor: ui.borderStrong,
    borderRadius: 16,
    paddingHorizontal: space[12],
    paddingVertical: space[6],
    backgroundColor: ui.surface,
    maxWidth: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: colors.brand.blue.light,
  },
});
