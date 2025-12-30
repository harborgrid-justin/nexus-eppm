import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

/**
 * ## Card Component
 * 
 * Container component that provides consistent styling and elevation for content.
 * 
 * ### Usage Guidelines
 * - Use cards to group related content
 * - Add `onClick` for interactive cards
 * - Use consistent padding inside cards
 * - Stack cards with appropriate spacing
 * 
 * ### Accessibility
 * - Interactive cards show hover state
 * - Cursor changes to pointer when clickable
 */
const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Flexible container component for grouping and displaying content with consistent styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Card content',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler - makes card interactive',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic card with text content
 */
export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 600 }}>
          Card Title
        </h3>
        <p style={{ margin: 0, color: '#64748b' }}>
          This is a basic card component with some content inside.
        </p>
      </div>
    ),
  },
};

/**
 * Interactive card with click handler
 */
export const Interactive: Story = {
  args: {
    onClick: () => alert('Card clicked!'),
    children: (
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 600 }}>
          Clickable Card
        </h3>
        <p style={{ margin: 0, color: '#64748b' }}>
          Click this card to see the interaction.
        </p>
      </div>
    ),
  },
};

/**
 * Card with custom styling
 */
export const CustomStyle: Story = {
  args: {
    className: 'hover:border-nexus-500',
    children: (
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 600 }}>
          Custom Styled Card
        </h3>
        <p style={{ margin: 0, color: '#64748b' }}>
          This card has custom styling applied.
        </p>
      </div>
    ),
  },
};

/**
 * Example: Project card with stats
 */
export const ProjectCard: Story = {
  render: () => (
    <Card>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, marginBottom: '0.25rem', fontSize: '1.125rem', fontWeight: 600 }}>
              Website Redesign
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
              PRJ-2024-001
            </p>
          </div>
          <span style={{ 
            padding: '0.25rem 0.75rem', 
            borderRadius: '9999px', 
            fontSize: '0.75rem', 
            fontWeight: 600,
            backgroundColor: '#dcfce7',
            color: '#166534'
          }}>
            Active
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Tasks</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>24</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Progress</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>68%</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Budget</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>$45K</div>
          </div>
        </div>
      </div>
    </Card>
  ),
};

/**
 * Example: User profile card
 */
export const UserCard: Story = {
  render: () => (
    <Card>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            backgroundColor: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 600
          }}>
            JD
          </div>
          <div>
            <h3 style={{ margin: 0, marginBottom: '0.25rem', fontSize: '1.125rem', fontWeight: 600 }}>
              John Doe
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
              Project Manager
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>12</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Projects</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>48</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Tasks</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>95%</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Complete</div>
          </div>
        </div>
      </div>
    </Card>
  ),
};

/**
 * Example: Multiple cards in a grid
 */
export const CardGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '600px' }}>
      <Card>
        <div style={{ padding: '1.5rem' }}>
          <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>Total Projects</h4>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>24</div>
        </div>
      </Card>
      <Card>
        <div style={{ padding: '1.5rem' }}>
          <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>Active Tasks</h4>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>156</div>
        </div>
      </Card>
      <Card>
        <div style={{ padding: '1.5rem' }}>
          <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>Team Members</h4>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>8</div>
        </div>
      </Card>
      <Card>
        <div style={{ padding: '1.5rem' }}>
          <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>Completion Rate</h4>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>87%</div>
        </div>
      </Card>
    </div>
  ),
};
