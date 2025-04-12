import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
      disabled: '#999999',
    },
    white: '#ffffff',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    h4: '2rem',
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    full: '9999px',
  },
};

export default theme;

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: {
        main: string;
        light: string;
        dark: string;
      };
      secondary: {
        main: string;
        light: string;
        dark: string;
      };
      background: {
        default: string;
        paper: string;
      };
      text: {
        primary: string;
        secondary: string;
        disabled: string;
      };
      white: string;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        small: string;
        medium: string;
        large: string;
      };
      fontWeight: {
        regular: number;
        medium: number;
        bold: number;
      };
      h4: string;
    };
    spacing: {
      small: string;
      medium: string;
      large: string;
    };
    borderRadius: {
      small: string;
      medium: string;
      large: string;
      full: string;
    };
  }
}
