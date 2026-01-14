
import React from 'react';
import { Task, UserDefinedField, ActivityCode } from '../../../types';
import { Edit3, Tag, Receipt, AlertTriangle, ShieldAlert, Plus } from 'lucide-react';
import { Input } from '../../ui/Input';
import { useTheme } from '../../../context/ThemeContext';

interface TaskAdvancedTabProps {
  task: Task;
  isReadOnly: boolean;
  udfs: UserDefinedField