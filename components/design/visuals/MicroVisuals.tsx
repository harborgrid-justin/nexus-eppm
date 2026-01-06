import React from 'react';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar, Cell, ReferenceLine } from 'recharts';
import { DemoContainer, ComponentLabel } from '../DesignHelpers';

const DATA = [{v: 10}, {v: 25}, {v: 15}, {v: 30}, {v: 20}];

export const MicroVisuals = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <DemoContainer>
            <ComponentLabel id="VZ-01" name="Area Spark" />
            <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DATA}><Area type="monotone" dataKey="v" stroke="#3b82f6" fill="#dbeafe" /></AreaChart>
                </ResponsiveContainer>
            </div>
        </DemoContainer>
        <DemoContainer>
            <ComponentLabel id="VZ-02" name="Line Spark" />
            <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={DATA}><Line type="monotone" dataKey="v" stroke="#10b981" dot={false} /></LineChart>
                </ResponsiveContainer>
            </div>
        </DemoContainer>
        <DemoContainer>
            <ComponentLabel id="VZ-05" name="Win/Loss" />
            <div className="h-12 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{v:10},{v:-5},{v:8}]}>
                        <ReferenceLine y={0} stroke="#cbd5e1" />
                        <Bar dataKey="v">{[{v:10},{v:-5},{v:8}].map((e, i) => <Cell key={i} fill={e.v > 0 ? '#10b981' : '#ef4444'} />)}</Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </DemoContainer>
    </div>
);