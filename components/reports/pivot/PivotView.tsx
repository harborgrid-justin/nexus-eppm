
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatCompactCurrency } from '../../../utils/formatters';

interface PivotViewProps {
    viewMode: 'Table' | 'Chart';
    pivotData: any;
    valField: string;
    rowField: string;
    colField: string;
}

export const PivotView: React.FC<PivotViewProps> = ({ viewMode, pivotData, valField, rowField, colField }) => {
    const theme = useTheme();
    const { rowKeys, colKeys, values, chartData } = pivotData;

    if (viewMode === 'Table') {
        return (
            <div className="h-full overflow-auto scrollbar-thin bg-white">
                <table