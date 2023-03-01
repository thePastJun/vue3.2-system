import { App } from 'vue';

import {createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { createRouterGuards } from './router-guards';


const modules = import.meta.globEager('./modules/**/*.ts');

const routeModuleList: RouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key]?.default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

function sortRoute(a:any, b:any) {
  return (a.meta?.sort || 0) - (b.meta?.sort || 0);
}

routeModuleList.sort(sortRoute);

const RootRoute: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Root',
        redirect: 'home',
        meta: {
          title: 'Root',
        },
    }
]
export const LoginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/view/system/login.vue'),
  meta: {
    title: '登录',
  },
};
// 需要验证权限
export const asyncRoutes = [...routeModuleList];

// 不需要验证权限
export const constantRouter: any[] = [RootRoute, LoginRoute];

console.log(constantRouter)


const router = createRouter({
    history: createWebHistory(),
    routes: constantRouter,
    strict: true,
    scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
}


export default router