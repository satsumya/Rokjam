import type { FlowMapScreen, FlowNavigateContext } from '../constants/flowMap';
import { applyScenarioSetup, navigateScenarioPath } from './scenarioSetup';

export function navigateFlowScreen(screen: FlowMapScreen, ctx: FlowNavigateContext) {
  applyScenarioSetup(screen.setup, ctx);
  screen.beforeNavigate?.(ctx);
  navigateScenarioPath(screen.path);
}
