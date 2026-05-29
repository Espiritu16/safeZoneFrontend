/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-fixed': '#dde1ff',
        'secondary-fixed': '#7ffc97',
        'tertiary-fixed': '#ffdbce',
        primary: '#00288e',
        'secondary-fixed-dim': '#62df7d',
        background: '#fbf8ff',
        'inverse-primary': '#b8c4ff',
        tertiary: '#611e00',
        'surface-tint': '#3755c3',
        'on-secondary-container': '#007230',
        'surface-container-low': '#f4f2fc',
        'surface-dim': '#dad9e3',
        'on-primary-container': '#a8b8ff',
        'on-primary-fixed-variant': '#173bab',
        'surface-container': '#eeedf7',
        surface: '#fbf8ff',
        'on-tertiary-fixed-variant': '#802a00',
        'surface-container-highest': '#e3e1eb',
        'tertiary-container': '#872d00',
        'on-error': '#ffffff',
        'surface-container-high': '#e8e7f1',
        'on-secondary-fixed-variant': '#005320',
        'on-error-container': '#93000a',
        'on-background': '#1a1b22',
        error: '#ba1a1a',
        'tertiary-fixed-dim': '#ffb59a',
        'surface-bright': '#fbf8ff',
        'error-container': '#ffdad6',
        secondary: '#16A34A',
        'inverse-on-surface': '#f1f0fa',
        'on-tertiary': '#ffffff',
        'surface-variant': '#e3e1eb',
        'outline-variant': '#cbd5e1',
        'primary-container': '#1e40af',
        'on-tertiary-container': '#ffa583',
        'on-secondary-fixed': '#002109',
        'on-secondary': '#ffffff',
        'on-primary-fixed': '#001453',
        'on-tertiary-fixed': '#380d00',
        'primary-fixed-dim': '#b8c4ff',
        'on-surface': '#1a1b22',
        outline: '#757684',
        'on-surface-variant': '#444653',
        'surface-container-lowest': '#ffffff',
        'secondary-container': '#ecfdf5',
        'inverse-surface': '#2f3037',
        'on-primary': '#ffffff'
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      },
      spacing: {
        md: '1.5rem',
        'margin-mobile': '16px',
        lg: '2rem',
        base: '4px',
        gutter: '24px',
        xl: '3rem',
        'max-width': '1280px',
        xs: '0.5rem',
        'margin-desktop': '48px',
        sm: '1rem'
      },
      maxWidth: {
        'max-width': '1280px'
      },
      fontFamily: {
        'headline-md': ['Manrope', 'sans-serif'],
        'headline-lg-mobile': ['Manrope', 'sans-serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'body-sm': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'headline-sm': ['Manrope', 'sans-serif'],
        'label-md': ['JetBrains Mono', 'monospace'],
        'label-sm': ['JetBrains Mono', 'monospace'],
        'headline-lg': ['Manrope', 'sans-serif']
      },
      fontSize: {
        'headline-md': ['30px', { lineHeight: '38px', fontWeight: '600' }],
        'headline-lg-mobile': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'headline-sm': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '500' }],
        'headline-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }]
      }
    }
  }
};
