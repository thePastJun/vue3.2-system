
// import { h, unref } from 'vue';
import type { App, Plugin, Component } from 'vue';
import { PageEnum } from '@/enums/pageEnum';
import { cloneDeep } from 'lodash-es';
import { isObject } from './is/index';
/**
 * 递归组装菜单格式
 */
export function generatorMenu(routerMap: Array<any>) {
    return filterRouter(routerMap).map((item) => {
      const isRoot = isRootRouter(item);
      const info = isRoot ? item.children[0] : item;
      const currentMenu = {
        ...info,
        ...info.meta,
        label: info.meta?.title,
        key: info.name,
        icon: isRoot ? item.meta?.icon : info.meta?.icon,
      };
      // 是否有子菜单，并递归处理
      if (info.children && info.children.length > 0) {
        // Recursion
        currentMenu.children = generatorMenu(info.children);
      }
      return currentMenu;
    });
  }
  /**
 * 混合菜单
 * */
export function generatorMenuMix(routerMap: Array<any>, routerName: string, location: string) {
    const cloneRouterMap = cloneDeep(routerMap);
    const newRouter = filterRouter(cloneRouterMap);
    if (location === 'header') {
      const firstRouter: any[] = [];
      newRouter.forEach((item) => {
        const isRoot = isRootRouter(item);
        const info = isRoot ? item.children[0] : item;
        info.children = undefined;
        const currentMenu = {
          ...info,
          ...info.meta,
          label: info.meta?.title,
          key: info.name,
        };
        firstRouter.push(currentMenu);
      });
      return firstRouter;
    } else {
      return getChildrenRouter(newRouter.filter((item) => item.name === routerName));
    }
  }
  /**
 * 递归组装子菜单
 * */
export function getChildrenRouter(routerMap: Array<any>) {
    return filterRouter(routerMap).map((item) => {
      const isRoot = isRootRouter(item);
      const info = isRoot ? item.children[0] : item;
      const currentMenu = {
        ...info,
        ...info.meta,
        label: info.meta?.title,
        key: info.name,
      };
      // 是否有子菜单，并递归处理
      if (info.children && info.children.length > 0) {
        // Recursion
        currentMenu.children = getChildrenRouter(info.children);
      }
      return currentMenu;
    });
  }
  /**
 * 判断根路由 Router
 * */
export function isRootRouter(item: { meta: { alwaysShow: boolean; }; children: { filter: (arg0: (item: any) => boolean) => { (): any; new(): any; length: number; }; }; }) {
    return (
      item.meta?.alwaysShow != true &&
      item?.children?.filter((item: { meta: { hidden: any; }; }) => !Boolean(item?.meta?.hidden))?.length === 1
    );
  }
  
  /**
   * 排除Router
   * */
  export function filterRouter(routerMap: Array<any>) {
    return routerMap.filter((item) => {
      return (
        (item.meta?.hidden || false) != true &&
        !['/:path(.*)*', '/', PageEnum.REDIRECT, PageEnum.BASE_LOGIN].includes(item.path)
      );
    });
  }
  
export const withInstall = <T extends Component>(component: T, alias?: string) => {
    const comp = component as any;
    comp.install = (app: App) => {
      app.component(comp.name || comp.displayName, component);
      if (alias) {
        app.config.globalProperties[alias] = component;
      }
    };
    return component as T & Plugin;
  };
  /**
 *  找到对应的节点
 * */
let result: any = null;
export function getTreeItem(data: any[], key?: string | number): any {
  data.map((item) => {
    if (item.key === key) {
      result = item;
    } else {
      if (item.children && item.children.length) {
        getTreeItem(item.children, key);
      }
    }
  });
  return result;
}

/**
 *  找到所有节点
 * */
const treeAll: any[] = [];
export function getTreeAll(data: any[]): any[] {
  data.map((item) => {
    treeAll.push(item.key);
    if (item.children && item.children.length) {
      getTreeAll(item.children);
    }
  });
  return treeAll;
}
/**
 * 判断是否 url
 * */
export function isUrl(url: string) {
    return /^(http|https):\/\//g.test(url);
  }


export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}