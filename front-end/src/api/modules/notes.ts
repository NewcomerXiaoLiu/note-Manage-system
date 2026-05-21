import { get, post, put, del } from '../methods';

export const notesApi = {
  list: (groupId?: string) => get<any>('/notes', groupId ? { groupId } : undefined),
  detail: (id: string) => get<any>(`/notes/${id}`),
  create: (data: { groupId?: string; title: string; content?: string }) => post<any>('/notes', data),
  update: (id: string, data: { groupId?: string; title?: string; content?: string }) => put<any>(`/notes/${id}`, data),
  remove: (id: string) => del<any>(`/notes/${id}`),
};
