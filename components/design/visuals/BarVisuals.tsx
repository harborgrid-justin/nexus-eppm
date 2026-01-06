import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { DemoContainer, ComponentLabel } from '../DesignHelpers';

const DATA = [{n: 'A', v: 40}, {n: 'B', v: 70}, {n: 'C', v: 55}];

export const BarVisuals = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DemoContainer>
            <ComponentLabel id="VZ-13" name="Standard Column" />
            <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Bar dataKey="v" fill="#3b82f6" radius={[4,4,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </DemoContainer>
        <DemoContainer>
            <ComponentLabel id="VZ-17" name="Horizontal Bar" />
            <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DATA} layout="vertical">
                        <XAxis type="number" hide /><YAxis dataKey="n" type="category" width={20} hide />
                        <Bar dataKey="v" fill="#10b981" radius={[0,4,4,0]} barSize={10} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </DemoContainer>
    </div>
);