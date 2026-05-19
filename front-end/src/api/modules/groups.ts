import { get, post, put, del } from '../methods';

export const groupsApi = {
  list: () => get<any>('/groups'),
  create: (data: { name: string; sortOrder?: number }) => post<any>('/groups', data),
  update: (id: string, data: { name?: string; sortOrder?: number }) => put<any>(`/groups/${id}`, data),
  remove: (id: string) => del<any>(`/groups/${id}`),
};
