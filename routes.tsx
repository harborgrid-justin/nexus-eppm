
import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './components/LoginPage';
import RouteError from './components/RouteError';

// Lazy Loads
const PortfolioManager = lazy(() => import('./components/PortfolioManager'));
const ProgramManager = lazy(() => import('./components/ProgramManager'));
const ProjectList = lazy(() => import('./components/ProjectList'));
const ProjectWorkspace = lazy(() => import('./components/ProjectWorkspace'));
const EnterpriseResources = lazy(() => import('./components/EnterpriseResources'));
const UnifierModule = lazy(() => import('./components/UnifierModule'));
const RiskManagement = lazy(() => import('./components/risk/RiskManagement'));
const Reports = lazy(() => import('./components/Reports'));
const AdminSettings = lazy(() => import('./components/admin/AdminSettings'));
const DataExchange = lazy(() => import('./components/admin/DataExchange'));
const DataWarehouse = lazy(() => import('./components/DataWarehouse')); 
const TeamWorkspace = lazy(() => import('./components/TeamWorkspace'));
const ComponentWorkbench = lazy(() => import('./components/ComponentWorkbench'));
const TemplateGallery = lazy(() => import('./components/TemplateGallery'));
const SearchPage = lazy(() => import('./components/pages/SearchPage'));
const AiPage = lazy(() => import('./components/pages/AiPage'));
const GettingStarted = lazy(() => import('./components/getting_started/GettingStarted').then(module => ({ default: module.GettingStarted })));

// Category III Adds
const ResourceNegotiationHub = lazy(() => import('./components/resources/ResourceNegotiationHub'));
const StrategicAlignmentBoard = lazy(() => import('./components/portfolio/StrategicAlignmentBoard'));
const PivotAnalytics = lazy(() => import('./components/reports/PivotAnalytics'));

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <RouteError />,
        children: [
            { index: true, element: <Navigate to="/portfolio" replace /> },
            { path: 'getting-started', element: <GettingStarted /> },
            { path: 'portfolio', element: <PortfolioManager /> },
            { path: 'programs', element: <ProgramManager /> },
            { path: 'projectList', element: <ProjectList /> },
            { path: 'projectWorkspace/:projectId', element: <ProjectWorkspace /> },
            { path: 'resources', element: <EnterpriseResources /> },
            { path: 'unifier', element: <UnifierModule /> },
            { path: 'enterpriseRisks', element: <RiskManagement /> },
            { path: 'reports', element: <Reports /> },
            { path: 'admin', element: <AdminSettings /> },
            { path: 'dataExchange', element: <DataExchange /> },
            { path: 'warehouse', element: <DataWarehouse /> },
            { path: 'myWork', element: <TeamWorkspace /> },
            { path: 'workbench', element: <ComponentWorkbench /> },
            { path: 'templates', element: <TemplateGallery /> },
            { path: 'search', element: <SearchPage /> },
            { path: 'ai', element: <AiPage /> },
            
            // New Category III Routes
            { path: 'negotiation', element: <ResourceNegotiationHub /> },
            { path: 'strategy-board', element: <StrategicAlignmentBoard /> },
            { path: 'analytics', element: <PivotAnalytics /> },
        ]
    },
    { path: '/login', element: <LoginPage /> }
];
