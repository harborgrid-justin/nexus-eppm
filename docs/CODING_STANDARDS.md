
# Frontend Coding Standards

## 1. File Structure
*   **Colocation**: Keep related sub-components in a folder named after the parent feature (e.g., `components/risk/`).
*   **Barrels**: Use `index.ts` in folders like `hooks/` to simplify imports.

## 2. Naming Conventions
*   **Components**: PascalCase (e.g., `ProjectCard.tsx`).
*   **Hooks**: camelCase, prefixed with `use` (e.g., `useProjectData.ts`).
*   **Utilities**: camelCase (e.g., `dateUtils.ts`).
*   **Types**: PascalCase, singular (e.g., `Project`, `Risk`).

## 3. React Best Practices
*   **Functional Components**: Use `React.FC<Props>` for typing.
*   **Hooks Rules**: Never call hooks conditionally.
*   **Memoization**: Use `useMemo` for expensive calculations (derived state like EVM metrics) and `useCallback` for event handlers passed to children.
*   **Effect Dependencies**: Always exhaustively list dependencies in `useEffect`.

## 4. State Management
*   **Do not** modify `state` directly. Always dispatch an `Action`.
*   **Selectors**: Use custom hooks (`useProjectState`) to select slices of data rather than importing `useData` everywhere.

## 5. Security
*   **Sanitization**: All user input routed to an API or displayed dangerously must pass through `sanitizeInput` from `utils/security.ts`.
*   **Dependencies**: Run `npm audit` before adding new packages.

## 6. Internationalization
*   **Strings**: Do not hardcode user-facing strings. Use `t('key', 'Default Text')` from `useI18n`.
*   **Dates**: Use `formatDate` from `utils/formatters.ts` or `I18nContext`.

## 7. Logging
*   **Console**: Avoid `console.log` in production code. Use `Logger.info()`, `Logger.warn()`, or `Logger.error()`.
*   **Context**: When logging in a specific module, try to include context: `Logger.info('Saved', { projectId })`.

## 8. Git Workflow
*   **Branches**: `feature/feature-name` or `fix/issue-description`.
*   **Commits**: Use semantic commits (e.g., `feat: add risk matrix`, `fix: correct date parsing`).
