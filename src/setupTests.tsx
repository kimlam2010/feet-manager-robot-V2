import '@testing-library/jest-dom';
import './utils/test-utils';
import { render as rtlRender } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import React from 'react';

const customRender = (ui: React.ReactElement, options = {}) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
