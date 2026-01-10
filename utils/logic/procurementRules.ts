
import { DataState, Action } from '../../types/index';
import { SystemAlert } from '../../types/business';
import { createAlert } from './common';

export const applyProcurementRules = (state: DataState, action: Action, alerts: SystemAlert[]) => {

    // Rule 35: Active Contract with Blacklisted Vendor
    state.contracts.forEach(c => {
        if (c.status === 'Active') {
            const vendor = state.vendors.find(v => v.id === c.vendorId);
            if (vendor && vendor.status === 'Blacklisted') {
                 alerts.push(createAlert('Blocker', 'Compliance', 'Sanctioned Vendor', 
                    `Active contract ${c.id} with blacklisted vendor ${vendor.name}.`, { type: 'Vendor', id: vendor.id }));
            }
        }
    });

    // Rule 36: Contract Expiry Imminent
    const today = new Date();
    state.contracts.forEach(c => {
        if (c.status === 'Active') {
            const endDate = new Date(c.endDate);
            const daysLeft = (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
            if (daysLeft > 0 && daysLeft < 30) {
                 alerts.push(createAlert('Warning', 'Supply Chain', 'Contract Expiring', 
                    `Contract ${c.title} expires in ${Math.ceil(daysLeft)} days.`, { type: 'Project', id: c.projectId }));
            }
        }
    });

    // Rule 37: PO exceeds Contract Value
    state.contracts.forEach(c => {
        const poSum = state.purchaseOrders.filter(po => po.contractId === c.id).reduce((s, po) => s + po.amount, 0);
        if (poSum > c.contractValue) {
             alerts.push(createAlert('Critical', 'Finance', 'Contract Ceiling Breach', 
                `POs for ${c.title} exceed contract value by ${(poSum - c.contractValue).toFixed(2)}.`, { type: 'Project', id: c.projectId }));
        }
    });

    // Rule 38: Sole Source without Justification
    state.procurementPlans.forEach(pp => {
        if (pp.approach === 'Sole Source' && pp.procurementMethods.length === 0) {
             // Mock check for justification document or note
             alerts.push(createAlert('Warning', 'Compliance', 'Sole Source Risk', 
                `Procurement Plan ${pp.id} marked Sole Source without justification attached.`, { type: 'Project', id: pp.projectId }));
        }
    });

    // Rule 39: Bid Variance High
    state.solicitations.forEach(sol => {
        if (sol.bids && sol.bids.length > 0) {
            const amounts = sol.bids.map(b => b.totalAmount);
            const min = Math.min(...amounts);
            const max = Math.max(...amounts);
            const variance = (max - min) / min;
            if (variance > 0.5) { // 50% spread
                 alerts.push(createAlert('Info', 'Supply Chain', 'Bid Spread High', 
                    `Solicitation ${sol.title} has >50% variance between high and low bids. Scope ambiguity likely.`, { type: 'Project', id: sol.projectId }));
            }
        }
    });

    // Rule 40: Vendor Performance Dip
    state.vendors.forEach(v => {
        if (v.status === 'Approved' && v.performanceScore < 60) {
             alerts.push(createAlert('Warning', 'Quality', 'Vendor Quality Alert', 
                `Vendor ${v.name} performance score dropped to ${v.performanceScore}. Review status.`, { type: 'Vendor', id: v.id }));
        }
    });

    // Rule 41: Material Shortage (Physical)
    // Checked via Inventory logic in components mostly, but can alert here
    
    // Rule 42: Claims Open too long
    state.claims.forEach(cl => {
        if (cl.status === 'Open') {
            const fileDate = new Date(cl.filingDate);
            const age = (today.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24);
            if (age > 60) {
                 alerts.push(createAlert('Warning', 'Legal', 'Stagnant Claim', 
                    `Claim ${cl.title} open for >60 days.`, { type: 'Project', id: cl.projectId }));
            }
        }
    });

    return {};
};
