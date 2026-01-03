
export interface KanbanTask {
    id: string;
    title: string;
    status: 'todo' | 'progress' | 'review' | 'done';
    assignee?: string;
    priority: 'Low' | 'Medium' | 'High';
}

export interface KanbanColumn {
    id: string;
    label: string;
    color: string;
}
