
/**
 * Utility functions for runtime validation and DOM checks.
 */

export const isDefined = <T>(value: T | undefined | null): value is T => {
  return value !== undefined && value !== null;
};

export const ensureElement = (id: string): HTMLElement => {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`DOM Element with ID '${id}' not found. Ensure the DOM is fully hydrated.`);
  }
  return element;
};

export const validateProjectData = (project: any): boolean => {
  if (!project || typeof project !== 'object') {
    console.error("Invalid project data: is not an object");
    return false;
  }
  if (!project.id || !project.tasks) {
    console.error("Invalid project data: missing id or tasks");
    return false;
  }
  return true;
};

export const safelyExecute = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch (error) {
    console.error("Execution failed safely:", error);
    return fallback;
  }
};
