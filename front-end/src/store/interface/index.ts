/*
 * @FilePath: /project-code/src/store/interface/index.ts
 * @Description: 文件描述...
 */
import { MenuOptions } from '@/types/interface/menu';

/* UserState */
export interface UserState {
  userInfo?: any;
}

/* MenuState */
export interface MenuState {
  menusList: MenuOptions[];
}

/* tabsMenuProps */
export interface TabsMenuProps {
  title: string;
  path: string;
  name: string;
  closable?: boolean;
}

/* TabsState */
export interface TabsState {
  tabsList: TabsMenuProps[];
}

/* KeepAliveState */
export interface KeepAliveState {
  keepAliveName: string[];
}

/* SystemState */
export interface SystemState {
  application: any[];
  domain: any[];
  org: any[];
  model: any[];
  waitCount: number;
}
