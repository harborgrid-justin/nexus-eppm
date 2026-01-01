
export interface TeamCharter {
  values: string[];
  communicationGuidelines: string;
  decisionMakingProcess: string;
  conflictResolutionProcess: string;
}

export interface Stakeholder {
  id: string;
  projectId?: string; // FK to Project
  name: string;
  role: string;
  interest: 'High' | 'Medium' | 'Low';
  influence: 'High' | 'Medium' | 'Low';
  engagementStrategy: string;
  programId?: string; // FK to Program
  userId?: string; // Optional linkage to an internal User
}

export interface StakeholderEngagement {
  stakeholderId: string; // FK to Stakeholder
  currentLevel: string;
  desiredLevel: string;
}

export interface Assumption {
  id: string;
  description: string;
  ownerId: string; // FK to Resource
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

export interface CommunicationLog {
  id: string;
  projectId: string;
  date: string;
  type: 'Meeting' | 'Email' | 'Call' | 'RFI';
  subject: string;
  summary: string;
  participantIds: string[];
  linkedTaskId?: string;
  status?: 'Open' | 'Closed';
}

export interface EnrichedStakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
  category: 'Internal' | 'External' | 'Regulatory';
  interest: number; // 1-10
  power: number; // 1-10
  support: number; // -5 to +5 (Sentiment)
  engagement: {
    current: 'Unaware' | 'Resistant' | 'Neutral' | 'Supportive' | 'Leading';
    desired: 'Unaware' | 'Resistant' | 'Neutral' | 'Supportive' | 'Leading';
  };
  financialAuthority: {
    limit: number;
    ccbMember: boolean;
    costInfluence: 'High' | 'Medium' | 'Low';
  };
}
