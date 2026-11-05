import React, { createContext, useContext } from 'react';

export interface ThemeColors {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
}

const defaultTheme: ThemeColors = {
  primaryColor: '#5322FF',
  accentColor: '#00E5FF',
  backgroundColor: '#09090B',
};

const ThemeColorContext = createContext<ThemeColors>(defaultTheme);

export interface ThemeColorProviderProps extends Partial<ThemeColors> {
  children: React.ReactNode;
}

export const ThemeColorProvider: React.FC<ThemeColorProviderProps> = ({
  primaryColor = defaultTheme.primaryColor,
  accentColor = defaultTheme.accentColor,
  backgroundColor = defaultTheme.backgroundColor,
  children,
}) => {
  const value = { primaryColor, accentColor, backgroundColor };
  return (
    <ThemeColorContext.Provider value={value}>
      <div
        data-theme-provider="craft-video-engine"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor,
          color: '#FFFFFF',
          ['--theme-primary' as string]: primaryColor,
          ['--theme-accent' as string]: accentColor,
          ['--theme-bg' as string]: backgroundColor,
        }}
      >
        {children}
      </div>
    </ThemeColorContext.Provider>
  );
};

export const useThemeColors = (): ThemeColors => useContext(ThemeColorContext);
