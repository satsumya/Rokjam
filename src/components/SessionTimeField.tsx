import { useEffect, useState } from 'react';

import { WireframeField } from './Wireframe';
import { TIME_INPUT_PLACEHOLDER } from '../utils/sessionUtils';
import {
  getTimeLabelError,
  normalizeTimeLabel,
  sanitizeTimeInput,
} from '../utils/validation';

export function SessionTimeField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (time: string) => void;
  required?: boolean;
}) {
  const [draft, setDraft] = useState(value);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const error = touched ? getTimeLabelError(draft) : undefined;

  return (
    <WireframeField
      label={label}
      required={required}
      value={draft}
      onChangeText={(text) => {
        const next = sanitizeTimeInput(text);
        setDraft(next);
        setTouched(true);
        const nextError = getTimeLabelError(next);
        if (!nextError) {
          onChange(normalizeTimeLabel(next));
        }
      }}
      placeholder={TIME_INPUT_PLACEHOLDER}
      error={error}
      maxLength={8}
    />
  );
}
