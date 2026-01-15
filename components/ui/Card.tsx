
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, noPadding = false }) => {
  const theme = useTheme();
  
  return (
    <div 
      onClick={onClick}
      className={`
        bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)]
        ${onClick ? `cursor-pointer hover:border-[var(--color-focusRing)] transition-colors duration-300` : ''} 
        shadow-[var(--shadow-sm)]
        ${className}
      `}
      style={{
          padding: noPadding ? '0' : 'var(--spacing-cardPadding)'
      }}
    >
      