// Learn more https://docs.expo.io/guides/customizing-metro
const {
  withStorybook,
} = require('@storybook/react-native/withStorybook');

const { getDefaultConfig } = require('expo/metro-config');

const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// phosphor-react-native ships an `exports` map that omits its internal
// `./icons/*`, `./lib/*`, and `./defs/*` files. With Metro's strict
// package-exports resolver (default in Expo SDK 54+), those internal imports
// can't be resolved, so the icon barrel fails and the whole web bundle blanks.
// Bypass package exports for this package and any imports originating inside it.
const phosphorDir = `node_modules${path.sep}phosphor-react-native${path.sep}`;
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isPhosphor =
    moduleName === 'phosphor-react-native' ||
    moduleName.startsWith('phosphor-react-native/');
  const fromPhosphor =
    typeof context.originModulePath === 'string' &&
    context.originModulePath.includes(phosphorDir);

  const resolve = defaultResolveRequest ?? context.resolveRequest;

  if (isPhosphor || fromPhosphor) {
    return resolve(
      { ...context, unstable_enablePackageExports: false },
      moduleName,
      platform,
    );
  }

  return resolve(context, moduleName, platform);
};

module.exports = withStorybook(config);
