
export const getNextStep = (currentStep: string, workflow: any) => {
    if (!workflow || !workflow.steps) return null;
    const idx = workflow.steps.findIndex((s: any) => s.name === currentStep);
    if (idx >= 0 && idx < workflow.steps.length - 1) {
        return workflow.steps[idx + 1];
    }
    return null;
};

export const canUserApprove = (step: any, userRole: string) => {
    return step.role === userRole || userRole === 'Global Admin';
};
