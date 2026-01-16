
import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './components/LoginPage';
import RouteError from './components/RouteError';

// Lazy Loads
const PortfolioManager = lazy(() => import('./components/PortfolioManager'));
const ProgramManager = lazy(() => import('./components/ProgramManager'));
const ProgramCreatePage = lazy(() => import('./components/program/ProgramCreatePage'));
const ProjectList = lazy(() => import('./components/ProjectList'));
const ProjectWorkspace = lazy(() => import('./components/ProjectWorkspace'));
const ProjectSchedulePage = lazy(() => import('./components/projects/ProjectSchedulePage'));
const EnterpriseResources = lazy(() => import('./components/EnterpriseResources'));
const UnifierModule = lazy(() => import('./components/UnifierModule'));
const RiskManagement = lazy(() => import('./components/risk/RiskManagement'));
const Reports = lazy(() => import('./components/Reports'));
const AdminSettings = lazy(() => import('./components/admin/AdminSettings'));
const DataExchange = lazy(() => import('./components/admin/DataExchange'));
const DataWarehouse = lazy(() => import('./components/DataWarehouse')); 
const TeamWorkspace = lazy(() => import('./components/TeamWorkspace'));
const DesignSystem = lazy(() => import('./components/DesignSystem'));
const SearchPage = lazy(() => import('./components/pages/SearchPage'));
const AiPage = lazy(() => import('./components/pages/AiPage'));
const GettingStarted = lazy(() => import('./components/getting_started/GettingStarted').then(module => ({ default: module.GettingStarted })));

// Category III Adds
const ResourceNegotiationHub = lazy(() => import('./components/resources/ResourceNegotiationHub'));
const StrategicAlignmentBoard = lazy(() => import('./components/portfolio/StrategicAlignmentBoard'));
const PivotAnalytics = lazy(() => import('./components/reports/PivotAnalytics'));

// Phase 9 & Extensions
const KnowledgeBaseExplorer = lazy(() => import('./components/knowledge/KnowledgeBaseExplorer').then(module => ({ default: module.KnowledgeBaseExplorer })));
const ExtensionMarketplace = lazy(() => import('./components/ExtensionMarketplace'));
const ExtensionEngine = lazy(() => import('./components/ExtensionEngine'));
const TemplateGallery = lazy(() => import('./components/TemplateGallery'));
const IntegrationHub = lazy(() => import('./components/IntegrationHub'));

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
            { path: 'programs/create', element: <ProgramCreatePage /> },
            { path: 'projectList', element: <ProjectList /> },
            { path: 'projectWorkspace/:projectId', element: <ProjectWorkspace /> },
            { path: 'schedule', element: <ProjectSchedulePage /> },
            { path: 'schedule/:projectId', element: <ProjectSchedulePage /> },
            { path: 'resources', element: <EnterpriseResources /> },
            { path: 'unifier', element: <UnifierModule /> },
            { path: 'enterpriseRisks', element: <RiskManagement /> },
            { path: 'reports', element: <Reports /> },
            { path: 'admin', element: <AdminSettings /> },
            { path: 'dataExchange', element: <DataExchange /> },
            { path: 'warehouse', element: <DataWarehouse /> },
            { path: 'myWork', element: <TeamWorkspace /> },
            { path: 'design-system', element: <DesignSystem /> },
            { path: 'search', element: <SearchPage /> },
            { path: 'ai', element: <AiPage /> },
            
            // New Category III Routes
            { path: 'negotiation', element: <ResourceNegotiationHub /> },
            { path: 'strategy-board', element: <StrategicAlignmentBoard /> },
            { path: 'analytics', element: <PivotAnalytics /> },
            
            // New Phase 9 Route
            { path: 'knowledge', element: <KnowledgeBaseExplorer /> },

            // Phase 3 & 4 Routes
            { path: 'extensions', element: <ExtensionMarketplace /> },
            { path: 'extensions/:id', element: <ExtensionEngine /> }, // Dynamic route handled by wrapper
            { path: 'templates', element: <TemplateGallery /> },
            { path: 'integrations', element: <IntegrationHub /> },
        ]
    },
    { path: '/login', element: <LoginPage /> }
];
