
import React, { lazy, Suspense } from 'react';
import { RouteObject, redirect } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './components/LoginPage';
import { MOCK_USERS } from './constants/index';
import RouteError from './components/RouteError';
import { initialState } from './context/initialState';
import { calculatePortfolioSummary, calculateProjectData } from './utils/projectSelectors';

// Lazy load components for code splitting
const Dashboard = lazy(() => import('./components/Dashboard'));
const ProgramManager = lazy(() => import('./components/ProgramManager'));
const ProjectList = lazy(() => import('./components/ProjectList'));
const ProjectWorkspace = lazy(() => import('./components/ProjectWorkspace'));
const AdminSettings = lazy(() => import('./components/admin/AdminSettings'));
const TeamWorkspace = lazy(() => import('./components/TeamWorkspace'));
const TemplateGallery = lazy(() => import('./components/TemplateGallery'));
const DataExchange = lazy(() => import('./components/admin/DataExchange'));
const IntegrationHub = lazy(() => import('./components/IntegrationHub'));
const ExtensionMarketplace = lazy(() => import('./components/ExtensionMarketplace'));
const RiskRegister = lazy(() => import('./components/RiskRegister'));
const Reports = lazy(() => import('./components/Reports'));
const Error404Tmpl = lazy(() => import('./components/templates/SystemLayouts').then(m => ({ default: m.Error404Tmpl })));


// Mock auth check for loaders
const checkAuth = () => {
    // In a real app, this would check a cookie or token
    const isAuthenticated = true; 
    if (!isAuthenticated) {
        return redirect('/login');
    }
    return null;
}

// Data loader for the main dashboard
const dashboardLoader = async () => {
    // Safety check for initialization
    if (!initialState || !initialState.projects) {
        throw new Error("System state not initialized. Please refresh.");
    }
    
    const projects = initialState.projects;
    const summary = calculatePortfolioSummary(projects);

    const healthDataForChart = [
        { name: 'Good', value: summary.healthCounts.good },
        { name: 'Warning', value: summary.healthCounts.warning },
        { name: 'Critical', value: summary.healthCounts.critical },
    ];
    const budgetDataForChart = projects.map(p => ({ name: p.code, Budget: p.budget, Spent: p.spent }));

    return { summary, healthDataForChart, budgetDataForChart, projects };
};

// Data loader for a specific project workspace
const projectWorkspaceLoader = async ({ params }: { params: any }) => {
    const { projectId } = params;
    
    // Safety check for initialization
    if (!initialState || !initialState.projects) {
        throw new Error("System state not initialized. Please refresh.");
    }

    if (!projectId) throw new Response("Project ID missing", { status: 400 });
    
    const project = initialState.projects.find(p => p.id === projectId);
    if (!project) throw new Response(`Project with ID ${projectId} not found`, { status: 404 });
    
    // Calculate all derived data for the project and its related entities
    try {
        const projectData = calculateProjectData(project, initialState);
        return projectData;
    } catch (e) {
        console.error("Failed to calculate project data", e);
        throw new Error("Failed to load project workspace data.");
    }
};

export const routes: RouteObject[] = [
    {
        path: '/login',
        element: <LoginPage />,
        action: async ({ request }) => {
            const formData = await request.formData();
            const email = formData.get('email');
            if (MOCK_USERS.some(u => u.email === email)) {
                return redirect('/');
            }
            return { error: 'Invalid credentials' };
        }
    },
    {
        id: 'root',
        path: '/',
        element: <MainLayout />,
        errorElement: <RouteError />,
        loader: () => checkAuth(),
        children: [
            {
                index: true,
                loader: dashboardLoader,
                element: <Dashboard />,
            },
            {
                path: 'portfolio',
                loader: dashboardLoader,
                element: <Dashboard />,
            },
            {
                path: 'programs',
                element: <ProgramManager />,
            },
            {
                path: 'projectList',
                element: <ProjectList />,
            },
            {
                path: 'projectWorkspace/:projectId',
                element: <ProjectWorkspace />,
                loader: projectWorkspaceLoader,
            },
            {
                path: 'myWork',
                element: <TeamWorkspace />,
            },
            {
                path: 'admin',
                element: <AdminSettings />,
            },
            {
                path: 'admin/:section',
                element: <AdminSettings />,
            },
            {
                path: 'templates',
                element: <TemplateGallery />
            },
            {
                path: 'dataExchange',
                element: <DataExchange />,
            },
            {
                path: 'integrations',
                element: <IntegrationHub />,
            },
            {
                path: 'marketplace',
                element: <ExtensionMarketplace />,
            },
            {
                path: 'enterpriseRisks',
                element: <RiskRegister />,
            },
            {
                path: 'reports',
                element: <Reports />,
            },
        ]
    },
    {
        path: '*',
        element: <Suspense fallback={<div>Loading...</div>}><Error404Tmpl /></Suspense>
    }
];
