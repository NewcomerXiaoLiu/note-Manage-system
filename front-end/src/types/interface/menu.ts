/* Menu */
export interface MetaProps {
  icon: string;
  title: string;
  isFull: boolean;
  isAffix: boolean;
  isKeepAlive: boolean;
  isHide: boolean;
}

export interface MenuOptions {
  path: string;
  name: string;
  component?: string | (() => Promise<unknown>);
  redirect?: string;
  meta: MetaProps;
  children?: MenuOptions[];
}
