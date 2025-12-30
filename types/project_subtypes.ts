
export interface TeamCharter {
  values: string[];
  communicationGuidelines: string;
  decisionMakingProcess: string;
  conflictResolutionProcess: string;
}

export interface Stakeholder {
  id: string;
  projectId?: string; // Made optional
  name: string;
  role: string;
  interest: 'High' | 'Medium' | 'Low';
  influence: 'High' | 'Medium' | 'Low';
  engagementStrategy: string;
  programId?: string; // Added for program context
}

export interface StakeholderEngagement {
  stakeholderId: string;
  currentLevel: string;
  desiredLevel: string;
}

export interface Assumption {
  id: string;
  description: string;
  owner: string;
  status: string;
}

export interface LessonLearned {
  id: string;
  category: string;
  situation: string;
  recommendation: string;
}

export interface Requirement {
  id: string;
  description: string;
  source: string;
  verificationMethod: string;
  status: string;
}
