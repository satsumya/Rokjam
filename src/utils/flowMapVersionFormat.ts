const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Display timestamp for flow map version status (date + time). */
export function formatFlowMapUpdatedAt(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');

  return `${DAY_NAMES[d.getDay()]} ${dd} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
}

export function formatFlowMapVersionStatus(version: string, updatedAt: string) {
  return `v${version} · ${formatFlowMapUpdatedAt(updatedAt)}`;
}
