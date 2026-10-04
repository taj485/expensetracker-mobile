// Dev builds get their own bundle ID and name so they can be installed next to the
// TestFlight/App Store app. Set by the "development" profile in eas.json.
const IS_DEV = process.env.APP_VARIANT === 'development';

module.exports = ({ config }) => {
  if (!IS_DEV) return config;
  return {
    ...config,
    name: 'ReceiptCave Dev',
    scheme: 'receiptcave-dev',
    ios: { ...config.ios, bundleIdentifier: 'com.receiptcave.app.dev' },
    android: { ...config.android, package: 'com.receiptcave.app.dev' },
  };
};
