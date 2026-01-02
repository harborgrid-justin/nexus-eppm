
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
const TeamWorkspace = lazy(() => import('./components/TeamWorkspace'));
const ComponentWorkbench = lazy(() => import('./components/ComponentWorkbench'));
const TemplateGallery = lazy(() => import('./components/TemplateGallery'));

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <RouteError />,
        children: [
            { index: true, element: <Navigate to="/portfolio" replace /> },
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
            { path: 'myWork', element: <TeamWorkspace /> },
            { path: 'workbench', element: <ComponentWorkbench /> },
            { path: 'templates', element: <TemplateGallery /> },
        ]
    },
    { path: '/login', element: <LoginPage /> }
];
