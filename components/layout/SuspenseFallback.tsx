
import React from 'react';
import { Loader2 } from 'lucide-react';

const SuspenseFallback: React.FC = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
    <Loader2 className="animate-spin mb-4" size={32} />
    <span className="text-sm font-medium uppercase tracking-widest">Loading Module...</span>
  </div>
);

export default SuspenseFallback;
