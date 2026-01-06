import { useMemo } from 'react';
import { useData } from '../../context/DataContext';

export const usePortfolioBenefitsLogic = () => {
    const { state } = useData();

    const componentsMap = useMemo(() => {
        return new Map([...state.projects, ...state.programs].map(item => [item.id, item.name]));
    }, [state.projects, state.programs]);

    const benefitsData = useMemo(() => {
        return state.benefits.map(benefit => ({
            ...benefit,
            componentName: componentsMap.get(benefit.componentId) || benefit.componentId
        }));
    }, [state.benefits, componentsMap]);

    const isEmpty = benefitsData.length === 0;

    return {
        benefits: benefitsData,
        isEmpty
    };
};