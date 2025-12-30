// Ambient types for packages without official types and global JSX

declare module 'lucide-react' {
  import * as React from 'react';
  export const Loader2: React.ComponentType<any>;
  export const WifiOff: React.ComponentType<any>;
  export const Menu: React.ComponentType<any>;
  export const Sparkles: React.ComponentType<any>;
  export default {} as {
    [key: string]: React.ComponentType<any>
  };
}

// Provide JSX namespace if not found (helps older TS setups)
declare global {
  namespace JSX {
    interface IntrinsicAttributes { [key: string]: any }
    interface IntrinsicElements { [key: string]: any }
  }
}

// Minimal ambient declarations for React when @types/react isn't installed
declare module 'react' {
  export type ReactNode = any;
  export type ReactElement = any;
  export type ComponentType<P = any> = any;
  export type FC<P = any> = any;
  export type Context<T> = any;
  export type Reducer<S, A> = any;
  export function createContext<T = any>(defaultValue?: T): Context<T>;
  export function useContext<T = any>(ctx: Context<T>): T;
  export function useState<S = any>(initial: S | (() => S)): [S, (s: S | ((prev: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps?: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps?: any[]): T;
  export function useRef<T = any>(initial?: T): { current: T | null };
  export function lazy<T extends ComponentType<any>>(loader: () => Promise<{ default: T }>): T;
  export const Suspense: any;
  export default {} as any;
}

declare module 'react/jsx-runtime' {
  export function jsx(type: any, props?: any, key?: any): any;
  export function jsxs(type: any, props?: any, key?: any): any;
  export const Fragment: any;
}

// Basic React namespace types used across the codebase
declare namespace React {
  type ReactNode = any;
  type ReactElement = any;
  type ComponentType<P = any> = any;
  type FC<P = any> = any;
  interface Attributes { [key: string]: any }
  interface MouseEvent { [key: string]: any }
  interface DragEvent { [key: string]: any }
  interface KeyboardEvent { [key: string]: any }
  interface RefObject<T = any> { current: T | null }
}

// Ensure 'process' is available in the browser build scripts and services
declare const process: {
  env: {
    [key: string]: string | undefined
  }
};

// Ambient module for lucide-react — export common icons as any to avoid TS errors
declare module 'lucide-react' {
  export const Loader2: any;
  export const WifiOff: any;
  export const Menu: any;
  export const Sparkles: any;
  export const Gavel: any;
  export const CheckCircle: any;
  export const XCircle: any;
  export const Clock: any;
  export const FileText: any;
  export const LayoutDashboard: any;
  export const ShoppingCart: any;
  export const Users: any;
  export const Briefcase: any;
  export const DollarSign: any;
  export const Award: any;
  export const BarChart2: any;
  export const Sliders: any;
  export const BookOpen: any;
  export const Folder: any;
  export const ChevronRight: any;
  export const ChevronLeft: any;
  export const Plus: any;
  export const Search: any;
  export const X: any;
  export default {} as any;
}

// Other ambient modules used in the project
declare module 'react-dom/client' {
  const Client: any;
  export default Client;
}

declare module 'vite' {
  export function defineConfig(cfg: any): any;
}

declare module '@vitejs/plugin-react' {
  const plugin: any;
  export default plugin;
}

declare module '@google/genai' {
  const genai: any;
  export default genai;
  export const GoogleGenAI: any;
  export const Type: any;
}
