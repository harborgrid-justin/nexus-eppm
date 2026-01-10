
import { DataState } from '../types/index';

const STORAGE_KEY = 'NEXUS_PPM_STORE_V1';

/**
 * Loads the state from LocalStorage.
 * Merges with defaultState (initialState) to ensure new schema fields added during development
 * are present even if the stored data is older.
 */
export const loadPersistedState = (defaultState: DataState): DataState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return defaultState;
    }
    const parsedState = JSON.parse(serializedState);
    
    // Intelligent Merge Strategy:
    // 1. Arrays (projects, resources, etc.) are taken directly from storage to preserve user data.
    // 2. Configuration objects (governance, settings) are shallow merged to ensure new flags/options 
    //    from defaultState are present if missing in storage.
    // 3. Transient state (staging) is reset to default to avoid stuck import processes.
    
    return {
        ...defaultState,
        ...parsedState,
        governance: {
            ...defaultState.governance,
            ...(parsedState.governance || {}),
            // Ensure nested config objects are also merged safely
            security: { ...defaultState.governance.security, ...(parsedState.governance?.security || {}) },
            scheduling: { ...defaultState.governance.scheduling, ...(parsedState.governance?.scheduling || {}) },
            resourceDefaults: { ...defaultState.governance.resourceDefaults, ...(parsedState.governance?.resourceDefaults || {}) },
            organization: { ...defaultState.governance.organization, ...(parsedState.governance?.organization || {}) }
        },
        // Reset transient UI states that shouldn't persist across reloads
        staging: defaultState.staging 
    };
  } catch (err) {
    console.warn('Failed to load state from local storage, falling back to default.', err);
    return defaultState;
  }
};

/**
 * Saves the current state to LocalStorage.
 */
export const savePersistedState = (state: DataState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Failed to save state to local storage.', err);
  }
};

/**
 * Clears the storage (used for factory reset).
 */
export const clearPersistedState = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
        console.error('Failed to clear local storage.', err);
    }
};
