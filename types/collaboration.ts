
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

export interface ActivityItem {
    id: string | number;
    userId: string;
    userName: string;
    userAvatar?: string;
    action: string;
    target: string;
    type: 'approval' | 'alert' | 'upload' | 'post';
    content?: string;
    timestamp: string;
    likes: number;
    comments: number;
}

export interface TeamEvent {
    id: string | number;
    date: string; // YYYY-MM-DD
    title: string;
    type: 'Meeting' | 'Milestone' | 'Leave';
    duration: number;
    ownerId?: string;
}
