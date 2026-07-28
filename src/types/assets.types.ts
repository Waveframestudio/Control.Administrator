export type AssetCategory = 'Server' | 'Workstation' | 'Database' | 'Network';
export type AssetStatus = 'Active' | 'Maintenance' | 'Offline';
export type AssetCriticality = 'Low' | 'Medium' | 'High' | 'Critical';

export interface SystemAsset {
  id: string;
  name: string;
  ip_address: string;
  category: AssetCategory;
  status: AssetStatus;
  criticality: AssetCriticality;
  last_inspected: string;
}

export interface AssetFiltersState {
  search: string;
  category: string; // 'all' or AssetCategory
  status: string;   // 'all' or AssetStatus
  criticality: string; // 'all' or AssetCriticality
}

export interface AssetStatsData {
  total: number;
  active: number;
  maintenance: number;
  offline: number;
}
