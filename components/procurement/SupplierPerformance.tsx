
import React from 'react';
import { Award, Star } from 'lucide-react';
import { useProcurementData } from '../../hooks';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { EmptyGrid } from '../common/EmptyGrid';

interface SupplierPerformanceProps {
    projectId: string;
}

const SupplierPerformance: React.FC<SupplierPerformanceProps> = ({ projectId }) => {
    const { supplierReviews, vendors } = useProcurementData(projectId);
    const theme = useTheme();

    return (
        <div className="h-full flex flex-col">
            <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center bg-slate-50/50`}>
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    <Award size={16} /> Supplier Performance Reviews
                </h3>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-4">
                {supplierReviews.length > 0 ? supplierReviews.map(review => {
                    const vendor = vendors.find(v => v.id === review.vendorId);
                    return (
                        <div key={review.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-lg text-slate-800">{vendor?.name || review.vendorId}</h4>
                                    <p className="text-xs text-slate-500">Review Date: {review.date}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                    <Star size={16} className="text-yellow-500 fill-yellow-500"/>
                                    <span className="font-bold text-yellow-700">{review.rating}/5</span>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700 italic mb-3">
                                "{review.comments}"
                            </div>
                            
                            <div className="flex justify-between items-center text-xs text-slate-500">
                                <span>Reviewer: <strong>{review.reviewer}</strong></span>
                                <Badge variant={review.rating >= 4 ? 'success' : review.rating >= 3 ? 'warning' : 'danger'}>
                                    {review.rating >= 4 ? 'Exceeds Expectations' : review.rating >= 3 ? 'Meets Expectations' : 'Below Expectations'}
                                </Badge>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="h-full flex flex-col justify-center">
                        <EmptyGrid 
                            title="No Performance Reviews"
                            description="Evaluate vendor performance to track compliance and delivery quality."
                            icon={Award}
                            actionLabel="Log Evaluation"
                            onAdd={() => {}}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupplierPerformance;
