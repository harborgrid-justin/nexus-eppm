import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Mail, Lock, User, Calendar } from 'lucide-react';

/**
 * ## Input Component
 * 
 * Enterprise-grade text input component with label, icon support, and search functionality.
 * 
 * ### Usage Guidelines
 * - Always provide labels for accessibility
 * - Use icons to provide visual context
 * - Use `isSearch` for search inputs
 * - Provide meaningful placeholder text
 * 
 * ### Accessibility
 * - Labels are associated with inputs
 * - Disabled state prevents interaction
 * - Icons are decorative (aria-hidden)
 */
const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Flexible input component with support for labels, icons, and search functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Input label text',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'HTML input type',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    isSearch: {
      control: 'boolean',
      description: 'Adds search icon',
    },
    icon: {
      control: false,
      description: 'Custom icon component',
    },
    onChange: {
      action: 'changed',
    },
    onFocus: {
      action: 'focused',
    },
    onBlur: {
      action: 'blurred',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic input with label
 */
export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
  },
};

/**
 * Input with email icon
 */
export const WithEmailIcon: Story = {
  args: {
    label: 'Email',
    type: 'email',
    icon: Mail,
    placeholder: 'you@example.com',
  },
};

/**
 * Password input with lock icon
 */
export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    icon: Lock,
    placeholder: '••••••••',
  },
};

/**
 * Search input with magnifying glass icon
 */
export const Search: Story = {
  args: {
    isSearch: true,
    placeholder: 'Search...',
  },
};

/**
 * Search input with label
 */
export const SearchWithLabel: Story = {
  args: {
    label: 'Search Projects',
    isSearch: true,
    placeholder: 'Search by name or ID...',
  },
};

/**
 * Input with user icon
 */
export const WithUserIcon: Story = {
  args: {
    label: 'Full Name',
    icon: User,
    placeholder: 'John Doe',
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    label: 'Email',
    disabled: true,
    value: 'user@example.com',
  },
};

/**
 * Input without label
 */
export const WithoutLabel: Story = {
  args: {
    placeholder: 'No label',
  },
};

/**
 * Number input
 */
export const NumberInput: Story = {
  args: {
    label: 'Age',
    type: 'number',
    placeholder: '0',
  },
};

/**
 * Input with custom width (full width by default)
 */
export const CustomWidth: Story = {
  args: {
    label: 'Short Input',
    placeholder: 'Placeholder',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '200px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Example: Login form inputs
 */
export const LoginForm: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <Input 
        label="Email" 
        type="email" 
        icon={Mail}
        placeholder="you@example.com"
      />
      <Input 
        label="Password" 
        type="password" 
        icon={Lock}
        placeholder="••••••••"
      />
    </div>
  ),
};

/**
 * Example: Contact form
 */
export const ContactForm: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <Input 
        label="Full Name" 
        icon={User}
        placeholder="John Doe"
      />
      <Input 
        label="Email" 
        type="email" 
        icon={Mail}
        placeholder="you@example.com"
      />
      <Input 
        label="Phone" 
        type="tel" 
        placeholder="+1 (555) 000-0000"
      />
    </div>
  ),
};
