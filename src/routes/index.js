import {lazy} from 'react'

export const allRoutes = {
  default: 'default',
  auth: 'auth',
  registration: 'registration',
  confirmation: 'confirmation',
  profile: 'profile',
  stickerSet: 'stickerSet',
  stickerSetCreate: 'stickerSetCreate',
  stickerSetUpdate: 'stickerSetUpdate',
  stickerSetUpdateAdd: 'stickerSetUpdateAdd',
}

export const menuRoutes = [allRoutes.stickerSet]

export const routesName = {
  [allRoutes.auth]: 'Авторизация',
  [allRoutes.registration]: 'Регистрация',
  [allRoutes.confirmation]: 'Подтверждение',
  [allRoutes.stickerSet]: 'Наборы',
  [allRoutes.stickerSetCreate]: 'Создание нового набора',
  [allRoutes.stickerSetUpdateAdd]: 'Добавление стикров в набор',
}

export const routes = {
  [allRoutes.default]: {
    path: '/',
    layout: false,
    protected: false,
    component: lazy(() => import('@pages/landing'))
  },
  [allRoutes.auth]: {
    path: '/auth',
    layout: false,
    protected: false,
    redirect: null,
    component: lazy(() => import('@pages/auth'))
    // component: Auth
  },
  [allRoutes.registration]: {
    path: '/auth/registration',
    layout: false,
    protected: false,
    redirect: null,
    component: lazy(() => import('@pages/auth/registration'))
    // component: Reg
  },
  [allRoutes.confirmation]: {
    path: '/auth/registration/confirmation/:id-:username',
    layout: false,
    protected: false,
    redirect: null,
    component: lazy(() => import('@pages/auth/registration/confirmation'))
    // component: Conf
  },
  [allRoutes.stickerSet]: {
    path: '/sticker-set',
    layout: true,
    protected: true,
    redirect: null,
    component: lazy(() => import('@pages/stickerSet'))
  },
  [allRoutes.stickerSetCreate]: {
    path: '/sticker-set/create',
    layout: true,
    protected: true,
    redirect: null,
    component: lazy(() => import('@pages/stickerSet/create'))
  },
  [allRoutes.stickerSetUpdate]: {
    path: '/sticker-set/update/:stickerSetId',
    layout: true,
    protected: true,
    redirect: null,
    component: lazy(() => import('@pages/stickerSet/update'))
  },
  [allRoutes.stickerSetUpdateAdd]: {
    path: '/sticker-set/update/:stickerSetId/add',
    layout: true,
    protected: true,
    redirect: null,
    component: lazy(() => import('@pages/stickerSet/update/add'))
  },
}
