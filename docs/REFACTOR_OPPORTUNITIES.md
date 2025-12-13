# TypeScript Extraction & Refactoring Opportunities

To migrate `Nexus PPM` to a fully modular, enterprise-grade architecture, the following 30 extractions are recommended. These changes decouple the monolithic `types.ts` and `constants.ts` files and promote UI component reusability.

## Domain Type Definitions
*Extract from `types.ts` to `types/`*
1. **`types/project.ts`**: `Project`, `Task`, `WBSNode`, `ConstraintType`, `EffortType`.
2. **`types/resource.ts`**: `Resource`, `Assignment`, `EnterpriseRole`, `EnterpriseSkill`.
3. **`types/finance.ts`**: `CostEstimate`, `BudgetLineItem`, `Expense`, `FundingSource`, `BudgetLogItem`.
4. **`types/risk.ts`**: `Risk`, `Issue`, `RiskManagementPlan`, `RiskResponseAction`.
5. **`types/program.ts`**: `Program`, `ProgramOutcome`, `ProgramDependency`, `StrategicGoal`.
6. **`types/procurement.ts`**: `Vendor`, `Contract`, `PurchaseOrder`, `Solicitation`.
7. **`types/integration.ts`**: `Integration`, `DataJob`, `Extension`.
8. **`types/common.ts`**: Shared Enums (`Status`), Utility Types, `PaginationProps`.

## Mock Data Segregation
*Extract from `constants.ts` to `constants/mocks/`*
9. **`constants/mocks/projects.ts`**: `MOCK_PROJECTS`, `MOCK_WBS`, `MOCK_TASKS`.
10. **`constants/mocks/resources.ts`**: `MOCK_RESOURCES`, `MOCK_ENTERPRISE_ROLES`.
11. **`constants/mocks/finance.ts`**: `MOCK_BUDGET_LOG`, `MOCK_EXPENSES`, `MOCK_COST_ESTIMATES`.
12. **`constants/mocks/risks.ts`**: `MOCK_RISKS`, `MOCK_ISSUES`, `MOCK_RISK_PLAN`.
13. **`constants/mocks/procurement.ts`**: `MOCK_VENDORS`, `MOCK_CONTRACTS`.

## UI Atoms & Molecules
*Extract from various components to `components/common/`*
14. **`components/common/StatusBadge.tsx`**: Unified badge logic for Health/Status (Green/Yellow/Red).
15. **`components/common/ProgressBar.tsx`**: Standardized progress bar with thresholds.
16. **`components/common/AvatarGroup.tsx`**: Handling multiple user avatars in rows/tables.
17. **`components/common/PageHeader.tsx`**: Standardized Title, Breadcrumb, and Action Button layout.
18. **`components/common/EmptyState.tsx`**: Reusable placeholder for lists with 0 items.
19. **`components/common/FilterBar.tsx`**: Generic filter inputs and active filter chips.
20. **`components/charts/ChartContainer.tsx`**: Standard wrapper for Recharts (ResponsiveContainer + Card styling).

## Logic Hooks
*Extract from `hooks/` and `utils/`*
21. **`hooks/useEVM.ts`**: Earned Value Management calculations (SPI, CPI, EAC) logic.
22. **`hooks/useSortableData.ts`**: Generic table sorting logic.
23. **`hooks/useModal.ts`**: Boolean state and handlers for modals.
24. **`hooks/usePermissions.ts`**: Role-based feature access checks.
25. **`hooks/useThemeColors.ts`**: Expose Tailwind config colors to JS/TS logic (for Charts).

## Service Layers
26. **`services/NotificationService.ts`**: Abstracting toast/alert logic.
27. **`services/ExportService.ts`**: CSV/PDF/XML generation logic moved out of components.
28. **`utils/currency.ts`**: Advanced currency formatting and conversion logic.
29. **`utils/date-business.ts`**: Specific business-day logic (holidays, weekends) separated from generic date utils.
30. **`components/gantt/GanttMinimap.tsx`**: Navigation map for the Gantt chart.
