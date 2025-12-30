import type { Meta, StoryObj } from '@storybook/react';
import StatCard from './StatCard';
import { Briefcase, CheckSquare, Users, TrendingUp, DollarSign, Clock } from 'lucide-react';

/**
 * ## StatCard Component
 * 
 * Display key metrics and statistics with icons and optional trend indicators.
 * 
 * ### Usage Guidelines
 * - Use for dashboard KPIs and metrics
 * - Choose appropriate icons that represent the metric
 * - Use trend indicators to show positive/negative changes
 * - Keep titles short and descriptive
 * 
 * ### Accessibility
 * - Uses semantic HTML structure
 * - Hover states provide visual feedback
 * - Trend indicators use both color and symbols
 */
const meta = {
    title: 'Shared/StatCard',
    component: StatCard,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Metric display card with icon, value, and optional trend indicator for dashboard KPIs.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
            description: 'Metric title',
            table: {
                type: { summary: 'string' },
            },
        },
        value: {
            control: 'text',
            description: 'Metric value',
            table: {
                type: { summary: 'string | number' },
            },
        },
        subtext: {
            control: 'text',
            description: 'Additional context or information',
            table: {
                type: { summary: 'string' },
            },
        },
        icon: {
            control: false,
            description: 'Icon component representing the metric',
            table: {
                type: { summary: 'React.ElementType' },
            },
        },
        trend: {
            control: 'select',
            options: [undefined, 'up', 'down'],
            description: 'Trend direction indicator',
            table: {
                type: { summary: 'up | down' },
            },
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: '300px' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default stat card without trend
 */
export const Default: Story = {
    args: {
        title: 'Total Projects',
        value: '24',
        icon: Briefcase,
    },
};

/**
 * Stat card with upward trend
 */
export const UpwardTrend: Story = {
    args: {
        title: 'Active Tasks',
        value: '156',
        subtext: '+12% from last month',
        icon: CheckSquare,
        trend: 'up',
    },
};

/**
 * Stat card with downward trend
 */
export const DownwardTrend: Story = {
    args: {
        title: 'Open Issues',
        value: '8',
        subtext: '-25% from last month',
        icon: Clock,
        trend: 'down',
    },
};

/**
 * Stat card with subtext but no trend
 */
export const WithSubtext: Story = {
    args: {
        title: 'Team Members',
        value: '12',
        subtext: '3 new this month',
        icon: Users,
    },
};

/**
 * Common use case: Project metrics
 */
export const TotalProjects: Story = {
    args: {
        title: 'Total Projects',
        value: '48',
        subtext: '+8% from last quarter',
        icon: Briefcase,
        trend: 'up',
    },
};

/**
 * Common use case: Task completion
 */
export const CompletedTasks: Story = {
    args: {
        title: 'Completed Tasks',
        value: '342',
        subtext: '+15% completion rate',
        icon: CheckSquare,
        trend: 'up',
    },
};

/**
 * Common use case: Revenue metric
 */
export const Revenue: Story = {
    args: {
        title: 'Total Revenue',
        value: '$1.2M',
        subtext: '+23% from last month',
        icon: DollarSign,
        trend: 'up',
    },
};

/**
 * Common use case: Performance metric
 */
export const Performance: Story = {
    args: {
        title: 'Performance Score',
        value: '92%',
        subtext: '-3% from last week',
        icon: TrendingUp,
        trend: 'down',
    },
};

/**
 * Large numeric value
 */
export const LargeNumber: Story = {
    args: {
        title: 'Total Users',
        value: '12,458',
        subtext: '+1,234 this month',
        icon: Users,
        trend: 'up',
    },
};

/**
 * Percentage value
 */
export const Percentage: Story = {
    args: {
        title: 'Success Rate',
        value: '98.5%',
        subtext: 'Last 30 days',
        icon: TrendingUp,
    },
};

/**
 * Example: Dashboard stat cards
 */
export const DashboardExample: Story = {
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '640px' }}>
            <StatCard
                title="Total Projects"
                value="48"
                subtext="+8% from last quarter"
                icon={Briefcase}
                trend="up"
            />
            <StatCard
                title="Active Tasks"
                value="156"
                subtext="+12% from last month"
                icon={CheckSquare}
                trend="up"
            />
            <StatCard
                title="Team Members"
                value="12"
                subtext="3 new this month"
                icon={Users}
            />
            <StatCard
                title="Revenue"
                value="$1.2M"
                subtext="+23% from last month"
                icon={DollarSign}
                trend="up"
            />
        </div>
    ),
};

/**
 * Example: Mixed trends
 */
export const MixedTrends: Story = {
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '640px' }}>
            <StatCard
                title="Completed"
                value="342"
                subtext="+15% completion rate"
                icon={CheckSquare}
                trend="up"
            />
            <StatCard
                title="Overdue"
                value="8"
                subtext="-25% from last week"
                icon={Clock}
                trend="down"
            />
            <StatCard
                title="Performance"
                value="92%"
                subtext="-3% from target"
                icon={TrendingUp}
                trend="down"
            />
            <StatCard
                title="Active Users"
                value="1,234"
                subtext="+456 this month"
                icon={Users}
                trend="up"
            />
        </div>
    ),
};

/**
 * Example: Responsive grid layout
 */
export const ResponsiveGrid: Story = {
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', maxWidth: '1200px' }}>
            <StatCard
                title="Total Projects"
                value="48"
                subtext="+8% growth"
                icon={Briefcase}
                trend="up"
            />
            <StatCard
                title="Active Tasks"
                value="156"
                icon={CheckSquare}
            />
            <StatCard
                title="Team Size"
                value="12"
                icon={Users}
            />
            <StatCard
                title="Revenue"
                value="$1.2M"
                subtext="+23% increase"
                icon={DollarSign}
                trend="up"
            />
        </div>
    ),
};
