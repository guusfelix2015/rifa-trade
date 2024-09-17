import { api } from '@/config';


export interface CampaignCategories {
  campaignCategories: Categories
}

export interface Categories {
  current_page: number;
  data: Daum[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: any;
  path: string;
  per_page: number;
  prev_page_url: any;
  to: number;
  total: number;
}

export interface Daum {
  id: number;
  name: string;
  active: boolean;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

export const getCategories = async () => {
  const response = await api.get<CampaignCategories>('/api/campaign/category');
  return response.data;
};
