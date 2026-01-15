
import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { TradeoffScenario } from '../../types';
import { generateId } from '../../utils/formatters';

export const useProgramTradeoffLogic = (programId: string) => {
    const { state, dispatch } = useData();
    const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

    // Filter scenarios for this program - assuming we add programId to TradeoffScenario later, 
    // but for now relying on global list or implicit context if needed.
    // Given the types, we'll filter from global state assuming they belong to the program context loaded.
    const tradeoffScenarios = state.tradeoffScenarios || [];

    const activeScenario = useMemo(() => 
        tradeoffScenarios.find(s => s.id === selectedScenario),
    [tradeoffScenarios, selectedScenario]);

    const handleCreateScenario = () => {
        const newScenario: TradeoffScenario = {
            id: generateId('SCN'),
            name: `Scenario ${tradeoffScenarios.length + 1}`,
            description: 'New cost-benefit analysis scenario.',
            benefitValue: 500000,
            costImpact: 250000,
            riskScore: 25,
            recommendation: 'Hold'
        };
        // We use a custom action type that we added to the reducer
        dispatch({ type: 'PROGRAM_ADD_TRADEOFF', payload: newScenario } as any);
        setSelectedScenario(newScenario.id);
    };

    return {
        tradeoffScenarios,
        selectedScenario,
        setSelectedScenario,
        activeScenario,
        handleCreateScenario
    };
};
