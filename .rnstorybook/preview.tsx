import type { Preview } from '@storybook/react-native';
import { useFonts } from 'expo-font';

import { fontMap } from '../src/theme/fonts';

const preview: Preview = {
  decorators: [
    (Story) => {
      const [fontsLoaded, fontError] = useFonts(fontMap);
      if (!fontsLoaded && !fontError) {
        return null;
      }
      return <Story />;
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
