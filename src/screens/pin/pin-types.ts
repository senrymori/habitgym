export const NumpadKeyType = {
  Backspace: 'Backspace',
  Biometric: 'Biometric',
  Numeric: 'Numeric',
} as const;
export type NumpadKeyType = (typeof NumpadKeyType)[keyof typeof NumpadKeyType];
