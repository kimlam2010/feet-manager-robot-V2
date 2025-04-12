import 'styled-components';

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
