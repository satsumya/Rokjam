import { Dropdown } from './Dropdown';
import { resolveTimeDropdownValue, TIME_DROPDOWN_OPTIONS } from '../../utils/sessionUtils';

export function SessionTimeDropdown({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (time: string) => void;
}) {
  const resolved = resolveTimeDropdownValue(value);

  return (
    <Dropdown
      label={label}
      value={resolved}
      options={TIME_DROPDOWN_OPTIONS}
      onChange={onChange}
    />
  );
}
