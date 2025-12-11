
# Nexus PPM Architecture

## 1. System Overview
Nexus PPM is an Enterprise Project Portfolio Management application designed to compete with Oracle P6. It uses a modern React frontend with strict separation of concerns between presentation, business logic (hooks), and state management.

## 2. Core Patterns

### State Management
*   **Pattern**: Context API + useReducer
*   **Justification**: Redux was deemed overkill for the initial bundle size requirements. Context allows sufficient isolation for Modules (Project, Risk, Cost) without prop drilling.
*   **File**: `context/DataContext.tsx`

### Module Architecture
*   The application is divided into functional domains (Cost, Risk, Schedule).
*   Each domain has:
    *   `components/[domain]/`: UI components specific to the domain.
    *   `hooks/use[Domain]Data.ts`: Data access layer that filters the global state for that specific domain.
    *   This ensures the UI layer stays thin and doesn't access the global `state` object directly.

### Feature Flags
*   **Strategy**: Boolean flags provided via `FeatureFlagContext`.
*   **Implementation**: Flags are checked at the `App.tsx` level to prevent loading code for disabled features (e.g., AI Assistant).

### Internationalization (i18n)
*   **Strategy**: Client-side dictionary lookup via `I18nContext`.
*   **Locale**: State-managed locale string triggering React re-renders upon change.

## 3. Architecture Decision Records (ADRs)

### ADR-001: No Client-Side Routing Library
*   **Status**: Accepted
*   **Context**: The application acts as a Single Page Application (SPA) dashboard where state preservation between "tabs" is critical but URL deep-linking was a secondary requirement for the MVP.
*   **Decision**: Use state-based conditional rendering for the main workspace (`activeTab`).
*   **Consequences**: simpler state management but requires custom handling for browser back button integration (future work).

### ADR-002: Tailwind for Enterprise Styling
*   **Status**: Accepted
*   **Context**: Need for rapid UI development with consistent spacing and typography constraints.
*   **Decision**: Use Tailwind CSS with a custom `nexus` color palette in `tailwind.config.js`.
*   **Consequences**: HTML classes can become verbose; extracted common patterns into `ThemeContext`.

### ADR-003: Gemini API for AI
*   **Status**: Accepted
*   **Context**: Need context-aware project analysis.
*   **Decision**: Direct integration via `@google/genai` SDK using a service layer (`services/geminiService.ts`).
*   **Security Note**: API Keys must be environment-injected and never hardcoded.

## 4. Layer Diagram

[UI Components] -> [Custom Hooks (Domain Logic)] -> [Global Context (Store)] -> [Services (API/Logger)]
