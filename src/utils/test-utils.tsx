import { render as rtlRender } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import theme from '../styles/theme';
import React from 'react';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </BrowserRouter>
);

const customRender = (ui: React.ReactElement, options = {}) => {
  return rtlRender(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
