import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/about',
    name: 'about',
    component: Layout,
    meta: {
      sort: 10,
      isRoot: true,
      activeMenu: 'about_index',
    },
    children: [
      {
        path: 'index',
        name: `about_index`,
        meta: {
          title: '关于',
          activeMenu: 'about_index',
        },
        component: () => import('@/view/about/index.vue'),
      },
    ],
  },
];

export default routes;
