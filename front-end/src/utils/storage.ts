/*
 * @FilePath: /project-code/src/utils/storage.ts
 * @Description: 文件描述...
 */
const Storage = localStorage; // 配置使用的存储器

export function setStorage(key: string, value: string | number | object): void {
  if (typeof value === 'object') {
    Storage.setItem(key, JSON.stringify(value));
  } else {
    Storage.setItem(key, value as string);
  }
}

export function getStorage(key: string): any {
  const value = Storage.getItem(key) || '';
  return value.match(/(^\[[\s\S]*\]$|^\{[\s\S]*\}$)/) ? JSON.parse(value) : value;
}

export function removeStorage(...keys: string[]) {
  keys.map(item => Storage.removeItem(item));
}

export function clearStorage() {
  Storage.clear();
}

export function keyStorage(index: number) {
  return Storage.key(index);
}
