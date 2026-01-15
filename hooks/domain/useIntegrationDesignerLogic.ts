import { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { NEXUS_SCHEMAS } from '../../constants/index';
import { EtlMapping } from '../../types';

export const useIntegrationDesignerLogic = () => {
    const { state, dispatch } = useData();
    const [activeTab, setActiveTab] = useState<'mapping' | 'transform' | 'orchestration' | 'governance'>('mapping');
    const [targetEntity, setTargetEntity] = useState('Project');
    
    // Mapping State populated from global store
    const [mappings, setMappings] = useState<EtlMapping[]>([]);
    
    // Orchestration State
    const [orchestration, setOrchestration] = useState({
        triggerType: 'Scheduled',
        cronExpression: '0 0 * * *',
        frequency: 'Daily',
        retryAttempts: 3,
        backoffInterval: 300, // seconds
        dependencyJobId: ''
    });

    // Governance State
    const [governance, setGovernance] = useState({
        validationMode: 'Strict',
        errorThreshold: 5, // %
        notifyEmails: 'admin@nexus.com',
        dataSteward: 'Chief Data Officer'
    });

    // Editable Test Payload State
    const [testPayload, setTestPayload] = useState(JSON.stringify({
        EXTERNAL_ID: "PRJ-9920",
        PROJ_NAME: "  Global Expansion Initiative  ", 
        BUDGET_AMT: "1250000.00",
        START_DT: "2024-10-01T00:00:00Z",
        COST_CENTER: "CC-NY-01",
        STATUS_CODE: "A"
    }, null, 2));

    useEffect(() => {
        if(state.etlMappings && state.etlMappings.length > 0) {
            setMappings(state.etlMappings);
        }
    }, [state.etlMappings]);

    const availableTargets = useMemo(() => NEXUS_SCHEMAS[targetEntity] || [], [targetEntity]);

    const handleAddMapping = () => {
        setMappings([...mappings, { 
            id: Date.now(), 
            source: '', 
            target: availableTargets[0] || '', 
            transform: 'Direct', 
            type: 'String' 
        }]);
    };

    const handleRemoveMapping = (id: number) => {
        setMappings(mappings.filter(m => m.id !== id));
    };

    const handleTargetChange = (id: number, newTarget: string) => {
        setMappings(mappings.map(m => m.id === id ? { ...m, target: newTarget } : m));
    };

    const handleSourceChange = (id: number, newSource: string) => {
        setMappings(mappings.map(m => m.id === id ? { ...m, source: newSource } : m));
    };

    const handleTransformChange = (id: number, newTransform: string) => {
        setMappings(mappings.map(m => m.id === id ? { ...m, transform: newTransform } : m));
    };

    const handleSaveConfig = () => {
        dispatch({ type: 'SYSTEM_SAVE_ETL_MAPPINGS', payload: mappings });
        // In a real app, this would trigger a toast and save orchestration/governance
        // Here we simulate saving the full config
        console.log("Saving Full Integration Config:", { mappings, orchestration, governance });
        alert("ETL Configuration Saved to System Core.");
    };

    // --- Dynamic Preview Generation ---
    const previewOutput = useMemo(() => {
        let sourceData: Record<string, any> = {};
        try {
            sourceData = JSON.parse(testPayload);
        } catch (e) {
            return { error: "Invalid JSON in Source Payload" };
        }

        const result: Record<string, any> = {};
        
        mappings.forEach(m => {
            if (!m.target) return;
            
            let val = sourceData[m.source] || null;

            // Apply simulated transformations
            if (val !== null) {
                if (m.transform === 'Trim Whitespace' && typeof val === 'string') {
                    val = val.trim();
                } else if (m.transform === 'Currency(USD)' || m.transform === 'Number') {
                    val = parseFloat(val);
                } else if (m.transform === 'Date(ISO8601)') {
                    try { val = new Date(val).toISOString().split('T')[0]; } catch {}
                } else if (m.transform === 'Uppercase') {
                    val = String(val).toUpperCase();
                }
            }

            // Nested object simulation (e.g., metrics.budget)
            if (m.target.includes('.')) {
                const parts = m.target.split('.');
                if (!result[parts[0]]) result[parts[0]] = {};
                result[parts[0]][parts[1]] = val;
            } else {
                result[m.target] = val;
            }
        });

        return {
            source_id: sourceData.EXTERNAL_ID,
            timestamp: new Date().toISOString(),
            status: "Transformed",
            entity: targetEntity,
            data: result
        };
    }, [mappings, targetEntity, testPayload]);

    return {
        activeTab,
        setActiveTab,
        targetEntity,
        setTargetEntity,
        mappings,
        testPayload,
        setTestPayload,
        availableTargets,
        previewOutput,
        orchestration,
        setOrchestration,
        governance,
        setGovernance,
        handleAddMapping,
        handleRemoveMapping,
        handleTargetChange,
        handleSourceChange,
        handleTransformChange,
        handleSaveConfig
    };
};