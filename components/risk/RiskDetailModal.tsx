
import React from 'react';
import { RiskDetailPanel } from './RiskDetailPanel';

interface RiskDetailModalProps {
  riskId: string;
  projectId: string;
  onClose: () => void;
}

export const RiskDetailModal: React.FC<RiskDetailModalProps> = (props) => {
  return (
    <RiskDetailPanel {...props} />
  );
};

export default RiskDetailModal;
