import type { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  primaryColor: 'teal',
  defaultRadius: 'md',
  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen',
  headings: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen',
    fontWeight: '600',
  },
  colors: {
    brand: ['#e6f7ff','#c2ecff','#99e1ff','#66d4ff','#33c8ff','#00bcff','#00a5e0','#008bbd','#00729a','#005a78'],
  },
  primaryShade: { dark: 5, light: 6 },
};
