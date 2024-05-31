import { defineStore } from "pinia";
import { ref } from "vue";

export const useApperStore = defineStore(
  "appear",
  () => {
    // 菜单状态切换
    const statechange = ref(false);
    // 菜单改变样式
    const statestyle = ref("");
    // 菜单状态切换
    const menuStatechange = () => {
      statechange.value = !statechange.value;
    };
    // loading效果
    const isLoading = ref(false);
    return {
      statechange,
      statestyle,
      isLoading,
      menuStatechange,
    };
  },
  {
    // 持久化
    persist: {
      storage: sessionStorage,
    },
  }
);
