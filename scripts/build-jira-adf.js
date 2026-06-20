const fs = require('fs');

function listItem(text) {
  return {
    type: 'listItem',
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text }],
      },
    ],
  };
}

function buildDecisionTree(items) {
  return {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Decision tree' }],
      },
      {
        type: 'bulletList',
        content: items.map(listItem),
      },
    ],
  };
}

function buildOutcomeSummary(delivered, scenarios) {
  return {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: 'What was delivered' }],
      },
      {
        type: 'bulletList',
        content: delivered.map(listItem),
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: 'Test scenarios' }],
      },
      {
        type: 'table',
        attrs: { isNumberColumnEnabled: false, layout: 'default' },
        content: [
          {
            type: 'tableRow',
            content: ['Scenario', 'Local web link', 'Expected result'].map((text) => ({
              type: 'tableHeader',
              attrs: { colspan: 1, rowspan: 1 },
              content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
            })),
          },
          ...scenarios.map((row) => ({
            type: 'tableRow',
            content: row.map((text) => ({
              type: 'tableCell',
              attrs: { colspan: 1, rowspan: 1 },
              content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
            })),
          })),
        ],
      },
    ],
  };
}

const rokj3 = {
  customfield_10042: buildDecisionTree([
    'Prototype format: local Expo clickable app (not Figma-only)',
    'Email verification: mock screen with Continue',
    'Post sign-up routing: verify, welcome, then profile setup',
    'Post login routing: dashboard for returning users',
    'Error handling: inline validation on empty submit',
  ]),
  customfield_10045: buildOutcomeSummary(
    [
      'Clickable sign up / login wireframes in local Expo app',
      'Mock email verification screen',
      'Post-signup welcome screen before profile setup',
      'Returning-user login to dashboard placeholder',
      'Scenario tester page at /scenarios',
    ],
    [
      ['Scenario tester', 'http://localhost:8081/scenarios', 'All ROKJ-3 paths with Run scenario buttons'],
      ['Sign up happy path', 'http://localhost:8081/auth/signup?demo=prefill', 'Prefilled, then verify, welcome, profile'],
      ['Sign up error path', 'http://localhost:8081/auth/signup?demo=error-empty', 'Inline email/password errors shown'],
      ['Login happy path', 'http://localhost:8081/auth/login?demo=prefill', 'Prefilled, then dashboard'],
      ['Login error path', 'http://localhost:8081/auth/login?demo=error-empty', 'Inline email/password errors shown'],
    ],
  ),
};

const rokj15 = {
  customfield_10042: buildDecisionTree([
    'Profile setup layout: single scrollable screen (not wizard)',
    'Required location: block completion until one gym/location added',
    'Difficulty defaults: Yellow to Pink sequence with edit and reorder',
    'Profile pic: emoji pet-rock placeholders (white-label)',
    'Persistence: in-memory session state only for Stage 1',
  ]),
  customfield_10045: buildOutcomeSummary(
    [
      'Member profile setup with required location and difficulty levels',
      'Optional username, strengths, and areas to improve',
      'Pet rock avatar placeholders',
      'Completion routes to dashboard placeholder',
      'Scenario tester with happy, alternate, and error profile paths',
    ],
    [
      ['Scenario tester', 'http://localhost:8081/scenarios', 'All ROKJ-15 paths with Run scenario buttons'],
      ['Happy path', 'http://localhost:8081/profile/setup?demo=prefill', 'Optional fields prefilled; add location; complete'],
      ['Alternate path', 'http://localhost:8081/profile/setup', 'Required location only; skip optional fields'],
      ['Error path', 'http://localhost:8081/profile/setup?demo=error-no-location', 'Location required error on complete'],
      ['Full new-user journey', 'http://localhost:8081/auth/signup?demo=prefill', 'Sign up through profile to dashboard'],
    ],
  ),
};

fs.writeFileSync(__dirname + '/jira-adf-rokj3.generated.json', JSON.stringify(rokj3, null, 2));
fs.writeFileSync(__dirname + '/jira-adf-rokj15.generated.json', JSON.stringify(rokj15, null, 2));
console.log('Generated ADF payloads');
