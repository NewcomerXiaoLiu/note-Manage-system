import { get } from '../methods';

export const dashboardApi = {
  stats: () => get<any>('/dashboard/stats'),
};
