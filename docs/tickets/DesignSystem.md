## Colour system

Visual reference: `/color-system` (also linked from Scenario tester). Tokens live in `src/theme/colors.ts`.

- [ ] Generate a color palette with an approach based on https://mui.com/material-ui/customization/color/ and https://atlassian.design/foundations/color#saturated-colors with the following requirements:

Brand colours to use for geneeral use and for climbing difficulty colour communication
- [ ] brand yellow
- [ ] brand blue
- [ ] brand purple
- [ ] brand green
- [ ] brand orange
- [ ] brand red
- [ ] brand black
- [ ] brand white
- [ ] brand pink

Neutral
- [ ] neutral (light and sandy/beigy)

Semantic
- [ ] negative colour (red)
- [ ] attention colour (yellow/orange)
- [ ] positive colour (green)
- [ ] info colour (blue)
- [ ] discovery colour (purple)

- [ ] Each brand and semantic colour must have a main, light, dark and accent shade (optional to have 10 shades from 50(lightest) to 900 (darkest) as long as main/light/dark/accent reference those)
- [ ] Main, light, dark and accent shades can be used as alpha variables (so they blend better with the background)
- [ ] Each brand colour shade must have two contrast variables; one that is from a different colour and another that is tonal or neutral
- [ ] All contrast combinations must pass WCAG AA contrast for accessibility
- [ ] neutral should have 10 shades from 50 (lightest) to 900 (darkest)
- [ ] 50-100 work as backgrounds
- [ ] 800-900 work for text

- [ ] Output format: --colourName-shadenumber: [value]

- [ ] all prototype colours must be linked to variables in a global style file
- [ ] variables can reference other variables
