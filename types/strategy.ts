
export interface RoadmapItem {
    id: string;
    laneId: string;
    name: string;
    start: string;
    end: string;
    type: 'product' | 'strategic' | 'platform' | 'tech';
    status: 'On Track' | 'At Risk' | 'Complete' | 'Planned';
    owner: string;
}

export interface RoadmapLane {
    id: string;
    title: string;
    owner: string;
    milestones: RoadmapMilestone[];
}

export interface RoadmapMilestone {
    id: string;
    name: string;
    date: string;
    type: 'decision' | 'release';
}

export interface PortfolioCommunicationItem {
  id: string;
  item: string;
  audience: 'Executive' | 'PMO' | 'Team';
  frequency: string;
  channel: string;
  owner: string;
}
