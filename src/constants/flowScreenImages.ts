/** Static PNG captures — regenerate with `node scripts/capture-flow-screens.mjs` */
export const FLOW_SCREEN_IMAGES: Record<string, number> = {
  welcome: require('../../assets/flow-screens/welcome.png'),
  signup: require('../../assets/flow-screens/signup.png'),
  'verify-email': require('../../assets/flow-screens/verify-email.png'),
  'welcome-signup': require('../../assets/flow-screens/welcome-signup.png'),
  login: require('../../assets/flow-screens/login.png'),
  'forgot-password': require('../../assets/flow-screens/forgot-password.png'),
  'reset-password': require('../../assets/flow-screens/reset-password.png'),
  'profile-setup': require('../../assets/flow-screens/profile-setup.png'),
  'dashboard-new': require('../../assets/flow-screens/dashboard-new.png'),
  'dashboard-returning': require('../../assets/flow-screens/dashboard-returning.png'),
  'dashboard-trends': require('../../assets/flow-screens/dashboard-trends.png'),
  'active-session': require('../../assets/flow-screens/active-session.png'),
  'sessions-list': require('../../assets/flow-screens/sessions-list.png'),
  'session-detail': require('../../assets/flow-screens/session-detail.png'),
  'session-edit': require('../../assets/flow-screens/session-edit.png'),
  community: require('../../assets/flow-screens/community.png'),
};
