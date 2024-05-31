import { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/store";

import { RouteVO } from "@/api/menu/model";
import { getList } from "@/service/role/RoleApi";
import { convertToTree } from "@/utils/utils";

const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layout/index.vue");

/**
 * 递归过滤有权限的动态路由
 *
 * @param routes 接口返回所有的动态路由
 * @param url
 * @returns 返回用户有权限的动态路由
 * @url 路径
 */
const filterAsyncRoutes = (routes: RouteVO[], url: string = "") => {
  const asyncRoutes: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const tmpRoute = { ...route } as RouteRecordRaw; // 深拷贝 route 对象 避免污染
    // 如果是顶级目录，替换为 Layout 组件
    if (tmpRoute.component?.toString() == "Layout") {
      tmpRoute.component = Layout;
    } else {
      // 如果是子目录，动态加载组件
      // console.log(route.meta?.title, `../../views${url.includes('branch')?'/company':url}/${ tmpRoute.component}View.vue`)

      const component =
        modules[
          `../../views${url.includes("branch") ? "/company" : url}/${tmpRoute.component}View.vue`
        ];
      if (component) {
        tmpRoute.component = component;
      } else {
        tmpRoute.component = modules[`../../views/error-page/404.vue`];
      }
    }

    if (tmpRoute.children) {
      tmpRoute.children = filterAsyncRoutes(route.children, url + route.path);
    }
    asyncRoutes.push(tmpRoute);
  });

  return asyncRoutes;
};
// setup
export const usePermissionStore = defineStore("permission", () => {
  // state
  const routes = ref<RouteRecordRaw[]>([]);

  // actions
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = constantRoutes.concat(newRoutes);
  }

  /**
   * 生成动态路由
   *
   * @param roles 用户角色集合
   * @returns
   */
  function generateRoutes(roles: string[]) {
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      // 接口获取所有路由
      getList()
        .then((data) => {
          // 过滤有权限的动态路由
          const treeData = data.data.list
            .map((item: any) => ({
              id: item.id,
              pid: item.pid,
              path: (!item.pid ? "/" : "") + item.url,
              component: !item.pid ? "Layout" : item.pathName,
              name: item.pathName + item.id,
              meta: {
                icon: item.icon,
                title: item.name,
                hidden: item.isButton === 1,
                keepAlive: true,
                alwaysShow: false,
                params: null,
              },
            }))
            .filter((item: any) => item.path);
          const accessedRoutes = filterAsyncRoutes(convertToTree(treeData));
          console.log("左侧路由", accessedRoutes);
          setRoutes(accessedRoutes);
          resolve(accessedRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 获取与激活的顶部菜单项相关的混合模式左侧菜单集合
   */
  const mixLeftMenus = ref<RouteRecordRaw[]>([]);

  function setMixLeftMenus(topMenuPath: string) {
    const matchedItem = routes.value.find((item) => item.path === topMenuPath);
    if (matchedItem && matchedItem.children) {
      mixLeftMenus.value = matchedItem.children;
    }
  }

  return {
    routes,
    setRoutes,
    generateRoutes,
    mixLeftMenus,
    setMixLeftMenus,
  };
});

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
