import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, View, type ViewProps } from 'react-native';
import type { ComponentProps } from 'react';

import { ADDRESS_SUGGESTIONS } from '../../constants/mockData';
import {
  addressMatchesQuery,
  findAddressHighlightRange,
} from '../../utils/addressSearch';
import { Text } from '../atoms/Text';
import { TextField } from '../atoms/TextField';
import { ui } from '../../theme/colors';
import { interactionStyle } from '../../theme/interaction';
import { space } from '../../theme/spacing';

function AddressSearchRoot({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function AddressSuggestionPanel({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

function AddressSuggestionList(props: ComponentProps<typeof ScrollView>) {
  return <ScrollView {...props} />;
}

function AddressEmptyState({ style, ...rest }: ViewProps) {
  return <View style={style} {...rest} />;
}

/** Query match bolded inside an address suggestion label. */
function AddressHighlight({ children }: { children: string }) {
  return (
    <Text variant="body" weight="bold">
      {children}
    </Text>
  );
}

function HighlightedAddress({ text, query }: { text: string; query: string }) {
  const range = findAddressHighlightRange(text, query);
  if (!range) return <Text variant="body">{text}</Text>;

  return (
    <Text variant="body">
      {text.slice(0, range.start)}
      <AddressHighlight>{text.slice(range.start, range.end)}</AddressHighlight>
      {text.slice(range.end)}
    </Text>
  );
}

export function AddressSearch({
  onSelect,
  error,
  required = true,
  /** Omit or pass `false` when a parent Section/Modal title already names this field. */
  label = 'Location',
  /** Prefill when editing an existing location. */
  initialValue,
  /** Clear the field after selecting (default). Keep false when editing in place. */
  clearOnSelect = true,
}: {
  onSelect: (address: string) => void;
  error?: string;
  required?: boolean;
  label?: string | false;
  initialValue?: string;
  clearOnSelect?: boolean;
}) {
  const [query, setQuery] = useState(initialValue ?? '');
  const [isSearching, setIsSearching] = useState(false);
  const skipBlurCommit = useRef(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef({ query, isSearching, initialValue, clearOnSelect });
  stateRef.current = { query, isSearching, initialValue, clearOnSelect };

  useEffect(() => {
    if (initialValue === undefined) return;
    setQuery(initialValue);
    setIsSearching(false);
  }, [initialValue]);

  useEffect(
    () => () => {
      if (blurTimer.current) clearTimeout(blurTimer.current);
    },
    [],
  );

  const trimmed = query.trim();
  const showSuggestions = isSearching && trimmed.length >= 2;

  const suggestions = useMemo(() => {
    if (!showSuggestions) return [];
    return ADDRESS_SUGGESTIONS.filter((item) => addressMatchesQuery(item, trimmed));
  }, [showSuggestions, trimmed]);

  const handleChange = (value: string) => {
    setQuery(value);
    setIsSearching(true);
  };

  const selectSuggestion = (item: string) => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
    skipBlurCommit.current = true;
    onSelect(item);
    setQuery(clearOnSelect ? '' : item);
    setIsSearching(false);
  };

  const enterManually = () => {
    const value = stateRef.current.query.trim();
    if (!value) return;
    selectSuggestion(value);
  };

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => {
      blurTimer.current = null;
      if (skipBlurCommit.current) {
        skipBlurCommit.current = false;
        return;
      }
      const { query: currentQuery, isSearching: searching, initialValue: initial } = stateRef.current;
      if (!searching) return;
      const value = currentQuery.trim();
      if (value) {
        selectSuggestion(value);
        return;
      }
      setIsSearching(false);
      if (initial !== undefined) setQuery(initial);
    }, 150);
  };

  const markPointerDown = () => {
    skipBlurCommit.current = true;
  };

  return (
    <AddressSearchRoot style={{ gap: space[8], zIndex: 2 }}>
      <TextField
        label={label === false ? undefined : label}
        required={label === false ? false : required}
        value={query}
        onChangeText={handleChange}
        placeholder="Search address or gym name"
        error={error}
        accessibilityLabel={label === false ? 'Location' : undefined}
        returnKeyType="done"
        onSubmitEditing={enterManually}
        onBlur={handleBlur}
      />

      {showSuggestions ? (
        <AddressSuggestionPanel
          style={{
            maxHeight: 220,
            borderWidth: 1,
            borderColor: ui.border,
            borderRadius: 8,
            backgroundColor: ui.surface,
            overflow: 'hidden',
            ...(Platform.OS === 'web'
              ? { boxShadow: `0 4px 12px ${ui.shadowSoft}` }
              : {
                  shadowColor: ui.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 4,
                }),
          }}
        >
          <AddressSuggestionList keyboardShouldPersistTaps="handled" nestedScrollEnabled>
            {suggestions.map((item, index) => (
              <Pressable
                key={item}
                onPressIn={markPointerDown}
                onPress={() => selectSuggestion(item)}
                style={(state) => [
                  {
                    paddingHorizontal: space[12],
                    paddingVertical: space[12],
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderTopColor: ui.borderSubtle,
                    backgroundColor: ui.surface,
                  },
                  interactionStyle(state),
                ]}
              >
                <HighlightedAddress text={item} query={trimmed} />
              </Pressable>
            ))}

            {suggestions.length === 0 ? (
              <AddressEmptyState style={{ paddingHorizontal: space[12], paddingVertical: space[12] }}>
                <Text variant="bodySmall" color={ui.textMuted}>
                  No matches found.
                </Text>
              </AddressEmptyState>
            ) : null}

            <Pressable
              onPressIn={markPointerDown}
              onPress={enterManually}
              style={(state) => [
                {
                  paddingHorizontal: space[12],
                  paddingVertical: space[12],
                  borderTopWidth: 1,
                  borderTopColor: ui.border,
                  backgroundColor: ui.surface,
                },
                interactionStyle(state),
              ]}
            >
              <Text variant="body">Can&apos;t find the address? Add it anyway</Text>
            </Pressable>
          </AddressSuggestionList>
        </AddressSuggestionPanel>
      ) : null}
    </AddressSearchRoot>
  );
}
