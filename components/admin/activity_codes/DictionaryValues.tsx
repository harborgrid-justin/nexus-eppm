import React from 'react';
import { Badge } from '../../ui/Badge';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/Button';

interface Props {
    code: any;
    onAddValue: () => void;
}

export const DictionaryValues: React.FC<Props> = ({ code, onAddValue }) => (
    <div className="p-8">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{code.name}</h2>
            <Button size="sm" variant="outline" icon={Plus} onClick={onAddValue}>Add Value</Button>
        </div>
        <div className="space-y-4">
            {code.values.map((v: any) => (
                <div key={v.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="w-4 h-4 rounded-full shadow-sm border border-black/10" style={{ backgroundColor: v.color || '#eee' }} />
                        <span className="font-bold text-sm font-mono">{v.value}</span>
                        <span className="text-sm text-slate-500">{v.description}</span>
                    </div>
                    <Badge variant="neutral">Active</Badge>
                </div>
            ))}
        </div>
    </div>
);