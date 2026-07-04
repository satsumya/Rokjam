import { Pressable, Text, View } from 'react-native';

import {
  WireframeBox,
  WireframeField,
  WireframeSection,
} from './Wireframe';
import { CLIMB_OUTCOMES, CLIMB_STYLES, type ClimbOutcome, type ClimbStyle } from '../types/climbingLog';
import type { Location } from '../context/PrototypeContext';
import {
  getLogAttemptsError,
  getLogDateError,
  getLogLevelError,
  getLogLocationError,
} from '../utils/logValidation';

type LogFormValues = {
  locationId: string;
  levelId: string;
  date: string;
  style: ClimbStyle;
  routeName: string;
  outcome: ClimbOutcome;
  attempts: string;
  notes: string;
};

type LogFormProps = {
  locations: Location[];
  values: LogFormValues;
  touched: Record<string, boolean>;
  onChange: (patch: Partial<LogFormValues>) => void;
  onTouch: (field: keyof LogFormValues) => void;
};

export function LogForm({ locations, values, touched, onChange, onTouch }: LogFormProps) {
  const selectedLocation = locations.find((loc) => loc.id === values.locationId);
  const levels = selectedLocation?.levels ?? [];

  const locationError = touched.locationId ? getLogLocationError(values.locationId) : undefined;
  const levelError = touched.levelId ? getLogLevelError(values.levelId) : undefined;
  const dateError = touched.date ? getLogDateError(values.date) : undefined;
  const attemptsError =
    touched.attempts ? getLogAttemptsError(values.outcome, values.attempts) : undefined;

  if (locations.length === 0) {
    return (
      <WireframeBox>
        <Text style={{ fontWeight: '700' }}>Add a location first</Text>
        <Text>Set up your member profile with at least one climbing location before logging climbs.</Text>
      </WireframeBox>
    );
  }

  return (
    <>
      <WireframeSection title="Location">
        <View style={{ gap: 8 }}>
          {locations.map((location) => (
            <Pressable
              key={location.id}
              onPress={() => {
                onChange({ locationId: location.id, levelId: '' });
                onTouch('locationId');
              }}
              style={{
                borderWidth: 1,
                borderColor: values.locationId === location.id ? '#111' : '#CCC',
                borderRadius: 8,
                padding: 12,
                backgroundColor: '#FFF',
              }}
            >
              <Text style={{ fontWeight: '600' }}>
                {location.isHome ? '🏠 ' : ''}
                {location.name}
              </Text>
            </Pressable>
          ))}
          {locationError ? <Text style={{ color: '#C0392B' }}>{locationError}</Text> : null}
        </View>
      </WireframeSection>

      {selectedLocation ? (
        <WireframeSection title="Difficulty level">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {levels.map((level) => (
              <Pressable
                key={level.id}
                onPress={() => {
                  onChange({ levelId: level.id });
                  onTouch('levelId');
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  borderWidth: 1,
                  borderColor: values.levelId === level.id ? '#111' : '#CCC',
                  borderRadius: 16,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    backgroundColor: level.color,
                  }}
                />
                <Text>{level.name}</Text>
              </Pressable>
            ))}
          </View>
          {levelError ? <Text style={{ color: '#C0392B' }}>{levelError}</Text> : null}
        </WireframeSection>
      ) : null}

      <WireframeField
        label="Date"
        required
        value={values.date}
        onChangeText={(date) => {
          onChange({ date });
          onTouch('date');
        }}
        placeholder="YYYY-MM-DD"
        error={dateError}
      />

      <WireframeSection title="Style">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {CLIMB_STYLES.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => onChange({ style: item.value })}
              style={{
                borderWidth: 1,
                borderColor: values.style === item.value ? '#111' : '#CCC',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <Text>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </WireframeSection>

      <WireframeField
        label="Route name"
        value={values.routeName}
        onChangeText={(routeName) => onChange({ routeName })}
        placeholder="Optional"
      />

      <WireframeSection title="Outcome">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {CLIMB_OUTCOMES.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => onChange({ outcome: item.value })}
              style={{
                borderWidth: 1,
                borderColor: values.outcome === item.value ? '#111' : '#CCC',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <Text>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </WireframeSection>

      {values.outcome === 'working' || values.outcome === 'project' ? (
        <WireframeField
          label="Attempts"
          required
          value={values.attempts}
          onChangeText={(attempts) => {
            onChange({ attempts });
            onTouch('attempts');
          }}
          keyboardType="number-pad"
          error={attemptsError}
        />
      ) : null}

      <WireframeField
        label="Notes"
        value={values.notes}
        onChangeText={(notes) => onChange({ notes })}
        placeholder="Optional session notes"
      />
    </>
  );
}

export type { LogFormValues };
