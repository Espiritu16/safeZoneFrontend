import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.safezone.app',
  appName: 'SafeZone',
  webDir: 'dist/safezone-frontend/browser',
  server: {
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;
