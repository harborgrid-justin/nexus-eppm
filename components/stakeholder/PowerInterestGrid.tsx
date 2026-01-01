
import React, { useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from 'recharts';
import { EnrichedStakeholder } from '../../types';

interface PowerInterestGridProps {
    stakeholders: EnrichedStakeholder[];
}

export const PowerInterestGrid: React.FC<PowerInterestGridProps> = ({ stakeholders }) => {
    const scatterData = useMemo(() => stakeholders.map(s => ({
        x: s.interest, y: s.power, z: 100, name: s.name, role: s.role
    })), [stakeholders]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="x" name="Interest" domain={[0, 10]} label={{ value: 'Interest', position: 'bottom' }} />
              <YAxis type="number" dataKey="y" name="Power" domain={[0, 10]} label={{ value: 'Power', angle: -90, position: 'insideLeft' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                if (!payload || !payload.length) return null;
                const data = payload[0].payload;
                return <div className="bg-white p-2 border shadow-md rounded text-xs"><p className="font-bold">{data.name}</p></div>;
              }} />
              <ReferenceLine x={5} stroke="gray" />
              <ReferenceLine y={5} stroke="gray" />
              <Scatter name="Stakeholders" data={scatterData} fill="#0ea5e9">
                {scatterData.map((e, i) => <Cell key={`c-${i}`} fill={e.y > 5 && e.x > 5 ? '#ef4444' : '#22c55e'} />)}
              </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
    );
};
