import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const dogtag: AppRouteModule = {
  path: '/dogtag',
  name: 'Dogtag',
  component: LAYOUT,
  redirect: '/dogtag/index',
  meta: {
    icon: 'simple-icons:about-dot-me',
    title: '狗牌',
  },
  children: [
    {
      path: 'index',
      name: 'DogtagIndex',
      component: () => import('/@/views/dogtag/index.vue'),
      meta: {
        title: '狗牌列表',
        icon: 'simple-icons:about-dot-me',
      },
    },
  ],
};

export default dogtag;
