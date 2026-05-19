import { post } from '../methods';

export const authApi = {
  login: (data: { username: string; password: string }) => post<any>('/login', data),
  logout: () => post<any>('/logout'),
};
