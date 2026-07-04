export type ClimbOutcome = 'send' | 'flash' | 'working' | 'project';
export type ClimbStyle = 'boulder' | 'top-rope' | 'lead';

export type ClimbingLog = {
  id: string;
  locationId: string;
  locationName: string;
  levelId: string;
  levelName: string;
  levelColor: string;
  date: string;
  style: ClimbStyle;
  routeName?: string;
  outcome: ClimbOutcome;
  attempts?: number;
  notes?: string;
};

export const CLIMB_OUTCOMES: { value: ClimbOutcome; label: string }[] = [
  { value: 'send', label: 'Send' },
  { value: 'flash', label: 'Flash' },
  { value: 'working', label: 'Working' },
  { value: 'project', label: 'Project' },
];

export const CLIMB_STYLES: { value: ClimbStyle; label: string }[] = [
  { value: 'boulder', label: 'Boulder' },
  { value: 'top-rope', label: 'Top rope' },
  { value: 'lead', label: 'Lead' },
];
