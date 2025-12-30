// Ambient types for packages without official types and global JSX

// Ensure 'process' is available in the browser build scripts and services
declare const process: {
  env: {
    [key: string]: string | undefined
  }
};

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

declare module 'recharts' {
  export const ResponsiveContainer: any;
  export const ComposedChart: any;
  export const BarChart: any;
  export const LineChart: any;
  export const ScatterChart: any;
  export const RadarChart: any;
  export const PieChart: any;
  export const AreaChart: any;
  export const Bar: any;
  export const Line: any;
  export const Area: any;
  export const Scatter: any;
  export const Radar: any;
  export const Pie: any;
  export const XAxis: any;
  export const YAxis: any;
  export const ZAxis: any;
  export const CartesianGrid: any;
  export const Tooltip: any;
  export const Legend: any;
  export const ReferenceLine: any;
  export const PolarGrid: any;
  export const PolarAngleAxis: any;
  export const PolarRadiusAxis: any;
  export const Sankey: any;
  export const Cell: any;
  export const Treemap: any;
}
