export type ThemeName = 'orange-blue' | 'red-black';

export const themeConfig = {
  // Change this to switch themes, or set via NEXT_THEME env variable
  // activeTheme: (import.meta.env.NEXT_THEME || 'orange-blue') as ThemeName,
  activeTheme: 'red-black',
  themes: {
    'orange-blue': {
      name: 'Trust & Conversion',
      description: 'Blue for trust, Orange for action',
      primary: '#1A56DB',
      accent: '#F97316',
    },
    'red-black': {
      name: 'Bold & Premium',
      description: 'Red for energy, Black for premium',
      primary: '#DC2626',
      accent: '#111827',
    },
  },
};

export const getActiveTheme = () => 'red-black';

// Apply theme to document
export const applyTheme = (theme: ThemeName) => {
  if (theme === 'red-black') {
    document.documentElement.setAttribute('data-theme', 'red-black');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
};
