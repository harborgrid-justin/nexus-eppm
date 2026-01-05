
import { DataState, Action } from '../../types/index';
import { transitionRecord } from '../../utils/logic/businessProcessEngine';

export const unifierReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'UNIFIER_UPDATE_BP_RECORD': {
        const { record, action: bpAction, user } = action.payload;
        
        // 1. Determine if this is an Insert or Update in the Record list
        let nextRecords = state.unifier.records;
        const exists = nextRecords.some(r => r.id === record.id);
        
        if (!exists) {
            nextRecords = [...nextRecords, record];
        } else {
            nextRecords = nextRecords.map(r => r.id === record.id ? record : r);
        }

        // Temporary state to allow engine to read current record
        const tempState = { ...state, unifier: { ...state.unifier, records: nextRecords } };
        
        // 2. Run Workflow Engine (Transition & Validation)
        const { updatedRecord, costUpdates } = transitionRecord(tempState, record.id, bpAction, user);
        
        // 3. Update Records with final state from engine
        nextRecords = nextRecords.map(r => r.id === updatedRecord.id ? updatedRecord : r);
        
        // 4. Update Cost Sheet if Engine dictated it
        let nextCostSheetRows = state.unifier.costSheet.rows;
        if (costUpdates) {
             nextCostSheetRows = nextCostSheetRows.map(row => {
                 if (row.costCode === costUpdates.costCode) {
                     const currentVal = row[costUpdates.columnId] || 0;
                     const newVal = costUpdates.operator === 'Add' ? currentVal + costUpdates.amount 
                                  : costUpdates.operator === 'Subtract' ? currentVal - costUpdates.amount
                                  : costUpdates.amount;
                     return { ...row, [costUpdates.columnId]: newVal };
                 }
                 return row;
             });
        }

        return {
            ...state,
            unifier: {
                ...state.unifier,
                records: nextRecords,
                costSheet: { ...state.unifier.costSheet, rows: nextCostSheetRows }
            }
        };
    }
    default:
        return state;
  }
};
