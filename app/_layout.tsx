import React from 'react';
import { Slot } from 'expo-router';
import { TamaguiProvider } from 'tamagui';
import { config } from '../tamagui.config';
import { DemoProvider } from '../src/demo/DemoProvider';
import '../src/theme/global.css';

export default function RootLayout() {
  return <TamaguiProvider config={config} defaultTheme="light"><DemoProvider><Slot /></DemoProvider></TamaguiProvider>;
}