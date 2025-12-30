import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { CheckCircle, AlertTriangle, XCircle, Info as InfoIcon, Clock } from 'lucide-react';

/**
 * ## Badge Component
 * 
 * Status indicator component for displaying tags, labels, and status information.
 * 
 * ### Usage Guidelines
 * - Use `success` for completed or positive states
 * - Use `warning` for cautionary information
 * - Use `danger` for errors or critical issues
 * - Use `info` for informational content
 * - Use `neutral` for general labels
 * 
 * ### Accessibility
 * - Badges use semantic color coding
 * - Text is readable with sufficient contrast
 * - Icons provide visual reinforcement
 */
const meta = {
    title: 'UI/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Compact status indicator component with support for multiple variants and optional icons.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['success', 'warning', 'danger', 'info', 'neutral'],
            description: 'Visual style variant',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'neutral' },
            },
        },
        children: {
            control: 'text',
            description: 'Badge content',
        },
        icon: {
            control: false,
            description: 'Icon component to display before text',
        },
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default neutral variant
 */
export const Default: Story = {
    args: {
        children: 'Badge',
    },
};

/**
 * Success variant for positive states
 */
export const Success: Story = {
    args: {
        variant: 'success',
        children: 'Completed',
    },
};

/**
 * Warning variant for cautionary states
 */
export const Warning: Story = {
    args: {
        variant: 'warning',
        children: 'In Progress',
    },
};

/**
 * Danger variant for error states
 */
export const Danger: Story = {
    args: {
        variant: 'danger',
        children: 'Failed',
    },
};

/**
 * Info variant for informational content
 */
export const Info: Story = {
    args: {
        variant: 'info',
        children: 'New',
    },
};

/**
 * Neutral variant for general labels
 */
export const Neutral: Story = {
    args: {
        variant: 'neutral',
        children: 'Label',
    },
};

/**
 * Badge with success icon
 */
export const WithSuccessIcon: Story = {
    args: {
        variant: 'success',
        icon: CheckCircle,
        children: 'Approved',
    },
};

/**
 * Badge with warning icon
 */
export const WithWarningIcon: Story = {
    args: {
        variant: 'warning',
        icon: AlertTriangle,
        children: 'Pending',
    },
};

/**
 * Badge with danger icon
 */
export const WithDangerIcon: Story = {
    args: {
        variant: 'danger',
        icon: XCircle,
        children: 'Error',
    },
};

/**
 * Badge with info icon
 */
export const WithInfoIcon: Story = {
    args: {
        variant: 'info',
        icon: InfoIcon,
        children: 'Information',
    },
};

/**
 * Common use case: Project status
 */
export const ProjectStatus: Story = {
    args: {
        variant: 'success',
        icon: CheckCircle,
        children: 'Active',
    },
};

/**
 * Common use case: Task status
 */
export const TaskStatus: Story = {
    args: {
        variant: 'warning',
        icon: Clock,
        children: 'In Progress',
    },
};

/**
 * Example: All badge variants
 */
export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="neutral">Neutral</Badge>
        </div>
    ),
};

/**
 * Example: Badges with icons
 */
export const WithIcons: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge variant="success" icon={CheckCircle}>Completed</Badge>
            <Badge variant="warning" icon={AlertTriangle}>Pending</Badge>
            <Badge variant="danger" icon={XCircle}>Failed</Badge>
            <Badge variant="info" icon={InfoIcon}>New</Badge>
        </div>
    ),
};

/**
 * Example: Status badges in context
 */
export const StatusBadges: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <span>Project Alpha</span>
                <Badge variant="success" icon={CheckCircle}>Active</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <span>Project Beta</span>
                <Badge variant="warning" icon={Clock}>In Progress</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                <span>Project Gamma</span>
                <Badge variant="danger" icon={XCircle}>Blocked</Badge>
            </div>
        </div>
    ),
};
