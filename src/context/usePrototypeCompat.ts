import { useAppData } from '../data/AppDataProvider';

/** Compatibility shim for prototype tooling (scenarios, flow map, Storybook). */
export function usePrototype() {
  return useAppData();
}
