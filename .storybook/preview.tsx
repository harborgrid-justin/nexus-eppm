import type { Preview } from '@storybook/react-vite';
import '../index.css'; // Import global styles (Tailwind)

const preview: Preview = {
  parameters: {
    // Enterprise-grade controls configuration
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true, // Expand controls by default
      sort: 'requiredFirst',
    },

    // Accessibility testing configuration
    a11y: {
      config: {
        rules: [
          {
            // Add custom a11y rules for enterprise compliance
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      test: 'todo',
    },

    // Actions configuration for event logging
    actions: { argTypesRegex: '^on[A-Z].*' },

    // Backgrounds for component testing
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1e293b',
        },
        {
          name: 'slate',
          value: '#f1f5f9',
        },
      ],
    },

    // Viewport presets for responsive testing
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
        wide: {
          name: 'Wide Desktop',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },

    // Documentation options
    docs: {
      toc: true, // Show table of contents
    },

    // Layout configuration
    layout: 'centered',
  },

  // Global decorators for consistent component rendering
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],

  // Tags for categorization
  tags: ['autodocs'],
};

export default preview;