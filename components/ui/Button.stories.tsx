import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Save, Download, Trash2, Plus } from 'lucide-react';

/**
 * ## Button Component
 * 
 * Primary UI component for user actions. Supports multiple variants, sizes, 
 * loading states, and icons.
 * 
 * ### Usage Guidelines
 * - Use `primary` variant for main actions
 * - Use `secondary` for supporting actions
 * - Use `outline` for alternative actions
 * - Use `ghost` for tertiary actions
 * - Use `danger` for destructive actions
 * 
 * ### Accessibility
 * - Always provide descriptive button text
 * - Use `aria-label` for icon-only buttons
 * - Disabled state prevents interaction
 */
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Versatile button component with enterprise-grade features including loading states, icons, and comprehensive variant support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      description: 'Visual style variant',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables interaction',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    icon: {
      control: false,
      description: 'Icon component to display before text',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler function',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary variant is used for main actions and calls-to-action
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

/**
 * Secondary variant for supporting actions
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

/**
 * Outline variant for alternative actions
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

/**
 * Ghost variant for tertiary actions with minimal visual weight
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

/**
 * Danger variant for destructive actions (delete, remove, etc.)
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete',
  },
};

/**
 * Small size button for compact spaces
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

/**
 * Medium size button (default)
 */
export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

/**
 * Large size button for prominent actions
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

/**
 * Button with loading state - useful for async operations
 */
export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Saving...',
  },
};

/**
 * Disabled state prevents interaction
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

/**
 * Button with icon - icon appears before text
 */
export const WithIcon: Story = {
  args: {
    icon: Save,
    children: 'Save Changes',
  },
};

/**
 * Common use case: Save action with loading state
 */
export const SaveAction: Story = {
  args: {
    variant: 'primary',
    icon: Save,
    children: 'Save',
  },
};

/**
 * Common use case: Download action
 */
export const DownloadAction: Story = {
  args: {
    variant: 'secondary',
    icon: Download,
    children: 'Download',
  },
};

/**
 * Common use case: Delete action
 */
export const DeleteAction: Story = {
  args: {
    variant: 'danger',
    icon: Trash2,
    children: 'Delete',
  },
};

/**
 * Common use case: Add new item
 */
export const AddAction: Story = {
  args: {
    variant: 'primary',
    icon: Plus,
    children: 'Add New',
  },
};

/**
 * Example: Button group showing all variants
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

/**
 * Example: Button sizes comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
