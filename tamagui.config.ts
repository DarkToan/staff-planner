import { defaultConfig } from '@tamagui/config/v6';
import { createTamagui } from 'tamagui';

export const config = createTamagui({
  ...defaultConfig,
  settings: { ...defaultConfig.settings, onlyAllowShorthands: false },
});
export default config;
type AppConfig = typeof config;
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}