
export interface EPSNode {
  id: string;
  parentId: string | null;
  name: string;
  code: string; // e.g., 'E&C', 'IT'
  managerId?: string; // Links to Resource
}

export interface OBSNode {
  id: string;
  parentId: string | null;
  name: string;
  description?: string;
  managerId?: string; // Links to Resource
}

export interface Location {
  id: string;
  name: string;
  country: string;
  city: string;
  coordinates?: { lat: number; lng: number };
}
