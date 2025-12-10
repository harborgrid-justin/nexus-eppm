import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { RiskBreakdownStructureNode } from '../../types';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface RiskBreakdownStructureProps {
  projectId: string;
}

const RBSNodeComponent: React.FC<{ node: RiskBreakdownStructureNode; level: number }> = ({ node, level }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div>
        <div 
          className="group flex items-center p-2 rounded-md my-0.5"
          style={{ paddingLeft: `${level * 24 + 8}px` }}
        >
          <div onClick={() => setIsOpen(!isOpen)} className="p-1 -ml-2 cursor-pointer">
            {node.children.length > 0 && (
              isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />
            )}
            {node.children.length === 0 && <div className="w-[18px]"></div>}
          </div>
          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md mr-3">{node.code}</span>
          <span className="text-sm font-medium text-slate-800">{node.name}</span>
        </div>
        {isOpen && node.children.length > 0 && (
          <div>
            {node.children.map(child => <RBSNodeComponent key={child.id} node={child} level={level + 1} />)}
          </div>
        )}
      </div>
    );
  }

const RiskBreakdownStructure: React.FC<RiskBreakdownStructureProps> = ({ projectId }) => {
  const { getRBS } = useData();
  const rbs = getRBS();

  return (
    <div className="h-full flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">Risk Breakdown Structure (RBS)</h3>
        </div>
        <div className="flex-1 overflow-auto p-4">
            {rbs.map(node => <RBSNodeComponent key={node.id} node={node} level={0} />)}
        </div>
    </div>
  );
};

export default RiskBreakdownStructure;