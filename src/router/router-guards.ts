import type { RouteRecordRaw } from 'vue-router';
import { isNavigationFailure, Router } from 'vue-router';
import { storage } from '@/utils/Storage';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import { useUserStoreWidthOut } from '@/store/modules/user';
import { useAsyncRouteStoreWidthOut } from '@/store/modules/asyncRoute';
import { ErrorPageRoute } from '@/router/base';
import { PageEnum } from '@/enums/pageEnum';

const LOGIN_PATH = PageEnum.BASE_LOGIN;
const whitePathList = [LOGIN_PATH]; // 无重定向白名单

export function createRouterGuards(router: Router) {
    console.log(router, 'router')
  const userStore = useUserStoreWidthOut();
  const asyncRouteStore = useAsyncRouteStoreWidthOut();
  router.beforeEach(async (to, from, next) => {
    // 加载
    // const Loading = window['$loading'] || null;
    // Loading && Loading.start();

    if (from.path === LOGIN_PATH && to.name === 'errorPage') {
      next('login');
      return;
    }

    // 可以直接进入白名单
    if (whitePathList.includes(to.path as PageEnum)) {
      next();
      return;
    }
    // 获取token
    const token = storage.get(ACCESS_TOKEN);

    if (!token) {
      // 您可以在没有权限的情况下访问。您需要设置路由.ignoreAuth为true ----> meta.ignoreAuth
      if (to.meta.ignoreAuth) {
        next();
        return;
      }
      // 重定向登录页面
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }

    if (asyncRouteStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    const userInfo = await userStore.GetInfo();

    const routes = await asyncRouteStore.generateRoutes(userInfo);

    // 动态添加可访问路由表
    routes.forEach((item: unknown) => {
      console.log(item, '2222222222')
      router.addRoute(item as unknown as RouteRecordRaw);
    });

    //添加404
    const isErrorPage = router.getRoutes().findIndex((item) => item.name === ErrorPageRoute.name);
    if (isErrorPage === -1) {
      router.addRoute(ErrorPageRoute as unknown as RouteRecordRaw);
    }

    const redirectPath = (from.query.redirect || to.path) as string;
    const redirect = decodeURIComponent(redirectPath);
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
    asyncRouteStore.setDynamicAddedRoute(true);
    next(nextData);
    // Loading && Loading.finish();
  });

  router.afterEach((to, _, failure) => {
    document.title = (to?.meta?.title as string) || document.title;
    if (isNavigationFailure(failure)) {
      //console.log('failed navigation', failure)
    }
    const asyncRouteStore = useAsyncRouteStoreWidthOut();
    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = asyncRouteStore.keepAliveComponents;
    const currentComName: any = to.matched.find((item) => item.name == to.name)?.name;
    if (currentComName && !keepAliveComponents.includes(currentComName) && to.meta?.keepAlive) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName);
    } else if (!to.meta?.keepAlive || to.name == 'Redirect') {
      // 不需要缓存的组件
      const index = asyncRouteStore.keepAliveComponents.findIndex((name) => name == currentComName);
      if (index != -1) {
        keepAliveComponents.splice(index, 1);
      }
    }
    asyncRouteStore.setKeepAliveComponents(keepAliveComponents);
    // const Loading = window['$loading'] || null;
    // Loading && Loading.finish();
  });

  router.onError((error) => {
    console.log(error, '路由错误');
  });
}
