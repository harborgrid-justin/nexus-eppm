
import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Project } from '../types/index';
import { calculateProjectProgress } from '../utils/calculations';
import { getDaysDiff } from '../utils/dateUtils';

export const useFinancials = (project: Project | undefined) => {
  const { state } = useData();

  const metrics = useMemo(() => {
    if (!project) return null;
    
    // 1. Calculate Actuals & Metrics
    const burnRate = project.spent / (new Date().getMonth() + 1) || 0; // Avoid NaN
    const etc = Math.max(0, project.budget - project.spent);
    const percentComplete = calculateProjectProgress(project);
    
    // CPI Calculation (Earned Value / Actual Cost)
    const ev = project.budget * (percentComplete / 100);
    const cpi = project.spent > 0 ? ev / project.spent : 1;

    // EAC (Estimate at Completion) = Budget / CPI
    // If CPI is healthy (>1), we might just use Budget. If poor (<1), we project overrun.
    const eac = cpi > 0 ? project.originalBudget / cpi : project.originalBudget;
    const variance = project.budget - eac;

    // 2. Generate Bottom-Up Cash Flow Forecast based on Task Schedule
    // We distribute the Remaining Budget (ETC) across the duration of incomplete tasks
    
    const today = new Date();
    const futureTasks = project.tasks.filter(t => t.status !== 'Completed');
    
    // Calculate total remaining duration 'weight' to allocate budget proportionally
    // (In a real system, this would use resource-loaded costs per task)
    let totalRemainingTaskDays = 0;
    futureTasks.forEach(t => {
        const start = new Date(t.startDate) > today ? new Date(t.startDate) : today;
        const end = new Date(t.endDate);
        const days = Math.max(0, getDaysDiff(start, end));
        totalRemainingTaskDays += days;
    });

    // Cost per day for the remaining work
    const dailyBurnRate = totalRemainingTaskDays > 0 ? etc / totalRemainingTaskDays : 0;

    // Initialize Forecast Buckets (Next 6 Months)
    const forecastBuckets = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() + i);
        d.setDate(1); // Start of month
        return {
            date: d,
            monthLabel: d.toLocaleString('default', { month: 'short' }),
            projectedSpend: 0,
            committed: 0
        };
    });

    // Distribute Task Costs into Buckets
    futureTasks.forEach(t => {
        const tStart = new Date(t.startDate) > today ? new Date(t.startDate) : today;
        const tEnd = new Date(t.endDate);
        
        forecastBuckets.forEach(bucket => {
            const bucketStart = new Date(bucket.date.getFullYear(), bucket.date.getMonth(), 1);
            const bucketEnd = new Date(bucket.date.getFullYear(), bucket.date.getMonth() + 1, 0);

            // Calculate intersection of Task Duration and Month
            const overlapStart = tStart > bucketStart ? tStart : bucketStart;
            const overlapEnd = tEnd < bucketEnd ? tEnd : bucketEnd;

            if (overlapStart <= overlapEnd) {
                const daysInMonth = getDaysDiff(overlapStart, overlapEnd) + 1; // Inclusive
                bucket.projectedSpend += (daysInMonth * dailyBurnRate);
            }
        });
    });

    // 3. Committed Costs (POs)
    // Distribute POs based on expected delivery dates
    const projectPOs = state.purchaseOrders.filter(po => po.projectId === project.id);
    
    projectPOs.forEach(po => {
        if (po.expectedDeliveryDate) {
            const deliveryDate = new Date(po.expectedDeliveryDate);
            const bucket = forecastBuckets.find(b => 
                b.date.getMonth() === deliveryDate.getMonth() && 
                b.date.getFullYear() === deliveryDate.getFullYear()
            );
            if (bucket) {
                bucket.committed += po.amount;
            }
        } else {
            // If no date, spread evenly or put in first bucket (using first bucket for visibility)
            if (forecastBuckets[0]) forecastBuckets[0].committed += po.amount;
        }
    });

    // Format for Chart
    const cashFlowForecast = forecastBuckets.map(b => ({
        month: b.monthLabel,
        projectedSpend: Math.round(b.projectedSpend),
        committed: Math.round(b.committed)
    }));

    return {
      burnRate,
      eac,
      variance,
      cashFlowForecast,
      cpi
    };
  }, [project, state.purchaseOrders]);

  return metrics;
};
