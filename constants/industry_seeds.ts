
import { EnterpriseRole, ActivityCode, IssueCode } from '../types/index';

export const INDUSTRY_SEEDS = {
    Construction: {
        roles: [
            { id: 'R-CON-01', title: 'Site Superintendent', description: 'Oversees daily site operations.', requiredSkills: ['Safety', 'Logistics'] },
            { id: 'R-CON-02', title: 'Project Engineer', description: 'Manages technical documentation (RFIs, Submittals).', requiredSkills: ['AutoCAD', 'Specs'] },
            { id: 'R-CON-03', title: 'Safety Officer', description: 'Ensures HSE compliance.', requiredSkills: ['OSHA-30'] }
        ] as EnterpriseRole[],
        activityCodes: [
            { id: 'AC-CON-01', name: 'CSI Division', scope: 'Global', values: [
                { id: '03', value: 'Concrete', description: 'Cast-in-place' },
                { id: '05', value: 'Metals', description: 'Structural Steel' },
                { id: '26', value: 'Electrical', description: 'Power & Lighting' }
            ]}
        ] as ActivityCode[],
        issueCodes: [
            { id: 'IC-CON-01', name: 'Root Cause', scope: 'Global', values: [
                { id: 'WEATHER', value: 'Weather Delay', description: 'Rain/Snow/Wind' },
                { id: 'MAT', value: 'Material Shortage', description: 'Supply Chain' },
                { id: 'SUB', value: 'Subcontractor Non-Performance', description: 'Labor Issue' }
            ]}
        ] as IssueCode[]
    },
    Software: {
        roles: [
            { id: 'R-SW-01', title: 'Scrum Master', description: 'Facilitates agile ceremonies.', requiredSkills: ['Agile', 'Jira'] },
            { id: 'R-SW-02', title: 'DevOps Engineer', description: 'CI/CD pipeline management.', requiredSkills: ['Docker', 'AWS'] },
            { id: 'R-SW-03', title: 'Product Owner', description: 'Backlog prioritization.', requiredSkills: ['Strategy', 'UX'] }
        ] as EnterpriseRole[],
        activityCodes: [
            { id: 'AC-SW-01', name: 'Sprint Phase', scope: 'Global', values: [
                { id: 'BACKLOG', value: 'Backlog', description: 'Not started' },
                { id: 'DEV', value: 'Development', description: 'Coding in progress' },
                { id: 'QA', value: 'QA / Testing', description: 'Validation' }
            ]}
        ] as ActivityCode[],
        issueCodes: [
            { id: 'IC-SW-01', name: 'Bug Severity', scope: 'Global', values: [
                { id: 'BLOCKER', value: 'Blocker', description: 'System down' },
                { id: 'CRITICAL', value: 'Critical', description: 'Core functionality broken' },
                { id: 'MINOR', value: 'Minor', description: 'Cosmetic or UI' }
            ]}
        ] as IssueCode[]
    }
};
