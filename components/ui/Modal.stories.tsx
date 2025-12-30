import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * ## Modal Component
 * 
 * Overlay dialog component for displaying content that requires user interaction.
 * 
 * ### Usage Guidelines
 * - Use modals for focused tasks that require user attention
 * - Keep content concise and focused
 * - Provide clear actions in the footer
 * - Always allow users to close the modal (Escape key or close button)
 * 
 * ### Accessibility
 * - Traps focus within the modal when open
 * - Closes on Escape key press
 * - Uses proper ARIA attributes (role="dialog", aria-modal="true")
 * - Prevents body scroll when open
 */
const meta = {
    title: 'UI/Modal',
    component: Modal,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Accessible modal dialog component with multiple sizes, keyboard navigation, and focus management.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        isOpen: {
            control: 'boolean',
            description: 'Controls modal visibility',
            table: {
                type: { summary: 'boolean' },
            },
        },
        onClose: {
            action: 'closed',
            description: 'Callback when modal is closed',
        },
        title: {
            control: 'text',
            description: 'Modal title',
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
            description: 'Modal size',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'lg' },
            },
        },
        children: {
            control: false,
            description: 'Modal body content',
        },
        footer: {
            control: false,
            description: 'Modal footer content (typically buttons)',
        },
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic modal with default size (large)
 */
export const Default: Story = {
    args: {
        isOpen: true,
        title: 'Modal Title',
        children: (
            <div>
                <p>This is a modal dialog with some content.</p>
            </div>
        ),
    },
};

/**
 * Small modal for brief messages
 */
export const Small: Story = {
    args: {
        isOpen: true,
        size: 'sm',
        title: 'Confirm Action',
        children: <p>Are you sure you want to continue?</p>,
        footer: (
            <>
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Confirm</Button>
            </>
        ),
    },
};

/**
 * Medium modal
 */
export const Medium: Story = {
    args: {
        isOpen: true,
        size: 'md',
        title: 'Medium Modal',
        children: <p>This is a medium-sized modal.</p>,
    },
};

/**
 * Large modal (default)
 */
export const Large: Story = {
    args: {
        isOpen: true,
        size: 'lg',
        title: 'Large Modal',
        children: <p>This is a large modal.</p>,
    },
};

/**
 * Extra large modal
 */
export const ExtraLarge: Story = {
    args: {
        isOpen: true,
        size: 'xl',
        title: 'Extra Large Modal',
        children: <p>This is an extra large modal.</p>,
    },
};

/**
 * Modal with footer actions
 */
export const WithFooter: Story = {
    args: {
        isOpen: true,
        title: 'Modal with Footer',
        children: <p>This modal has action buttons in the footer.</p>,
        footer: (
            <>
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Save Changes</Button>
            </>
        ),
    },
};

/**
 * Example: Confirmation dialog
 */
export const ConfirmationDialog: Story = {
    args: {
        isOpen: true,
        size: 'sm',
        title: 'Delete Project',
        children: (
            <div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <AlertTriangle size={24} color="#dc2626" />
                    </div>
                    <div>
                        <h4 style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 600 }}>
                            Are you sure?
                        </h4>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                            This action cannot be undone. This will permanently delete the project
                            and all associated data.
                        </p>
                    </div>
                </div>
            </div>
        ),
        footer: (
            <>
                <Button variant="ghost">Cancel</Button>
                <Button variant="danger">Delete Project</Button>
            </>
        ),
    },
};

/**
 * Example: Form modal
 */
export const FormModal: Story = {
    args: {
        isOpen: true,
        size: 'md',
        title: 'Create New Project',
        children: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input label="Project Name" placeholder="Enter project name" />
                <Input label="Project Code" placeholder="PRJ-001" />
                <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                        Description
                    </label>
                    <textarea
                        style={{
                            width: '100%',
                            padding: '0.5rem 0.75rem',
                            border: '1px solid #cbd5e1',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            minHeight: '100px',
                            fontFamily: 'inherit'
                        }}
                        placeholder="Enter project description..."
                    />
                </div>
            </div>
        ),
        footer: (
            <>
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Create Project</Button>
            </>
        ),
    },
};

/**
 * Example: Content modal with scrollable content
 */
export const ScrollableContent: Story = {
    args: {
        isOpen: true,
        size: 'lg',
        title: 'Project Details',
        children: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <h4 style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 600 }}>Overview</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>
                <div>
                    <h4 style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 600 }}>Description</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                </div>
                <div>
                    <h4 style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 600 }}>Team</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                </div>
                <div>
                    <h4 style={{ margin: 0, marginBottom: '0.5rem', fontWeight: 600 }}>Timeline</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                </div>
            </div>
        ),
        footer: (
            <>
                <Button variant="ghost">Close</Button>
                <Button variant="primary">Edit Project</Button>
            </>
        ),
    },
};

/**
 * Interactive example with state management
 */
export const Interactive: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div style={{ padding: '2rem' }}>
                <Button onClick={() => setIsOpen(true)}>Open Modal</Button>

                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="Interactive Modal"
                    footer={
                        <>
                            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={() => setIsOpen(false)}>Save</Button>
                        </>
                    }
                >
                    <p>Click the buttons or press Escape to close this modal.</p>
                </Modal>
            </div>
        );
    },
};
