import { defineStore } from 'pinia';
import { ref } from 'vue';
// import { KeepAliveState } from '../interface';

export const useKeepAliveStore = defineStore('keepAliveStore', () => {
  const keepAliveName = ref<string[]>([]);

  const setKeepAliveName = (name: string[] = []) => {
    keepAliveName.value = name;
  };

  const addKeepAliveName = (name: string) => {
    if (!keepAliveName.value.includes(name)) {
      keepAliveName.value.push(name);
    }
  };

  const removeKeepAliveName = (name: string) => {
    keepAliveName.value = keepAliveName.value.filter(item => item !== name);
  };

  return {
    keepAliveName,
    setKeepAliveName,
    addKeepAliveName,
    removeKeepAliveName
  };
});
