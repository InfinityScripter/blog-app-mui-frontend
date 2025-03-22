import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export const navData = [
  {
    title: "Главная",
    path: "/",
    icon: <Iconify width={22} icon="solar:home-2-bold-duotone" />,
  },
  {
    title: "Вопросы и ответы",
    path: "/faqs",
    icon: <Iconify width={22} icon="solar:file-bold-duotone" />,
  },
  {
    title: "Блог",
    path: "/post",
    icon: <Iconify width={22} icon="solar:file-bold-duotone" />,
  },

  // {
  //   title: 'Компоненты',
  //   path: paths.components,
  //   icon: <Iconify width={22} icon="solar:atom-bold-duotone" />,
  // },
  // {
  //   title: 'Страницы',
  //   path: '/pages',
  //   icon: <Iconify width={22} icon="solar:file-bold-duotone" />,
  //   children: [
  //     {
  //       subheader: 'Другое',
  //       items: [
  //         { title: 'О нас', path: paths.about },
  //         { title: 'Контакты', path: paths.contact },
  //         { title: 'Вопросы и ответы', path: paths.faqs },
  //         { title: 'Цены', path: paths.pricing },
  //         { title: 'Оплата', path: paths.payment },
  //         { title: 'Техническое обслуживание', path: paths.maintenance },
  //         { title: 'Скоро', path: paths.comingSoon },
  //       ],
  //     },
  //     {
  //       subheader: 'Концепции',
  //       items: [
  //         // { title: 'Магазин', path: paths.product.root },
  //         // { title: 'Продукт', path: paths.product.demo.details },
  //         // { title: 'Оформление заказа', path: paths.product.checkout },
  //         // { title: 'Публикации', path: paths.post.root },
  //         // { title: 'Публикация', path: paths.post.demo.details },
  //       ],
  //     },
  //     {
  //       subheader: 'Демо авторизации',
  //       items: [
  //         { title: 'Вход', path: paths.authDemo.split.signIn },
  //         { title: 'Регистрация', path: paths.authDemo.split.signUp },
  //         { title: 'Сброс пароля', path: paths.authDemo.split.resetPassword },
  //         { title: 'Обновление пароля', path: paths.authDemo.split.updatePassword },
  //         { title: 'Подтверждение', path: paths.authDemo.split.verify },
  //         { title: 'Вход (центрировано)', path: paths.authDemo.centered.signIn },
  //         { title: 'Регистрация (центрировано)', path: paths.authDemo.centered.signUp },
  //         { title: 'Сброс пароля (центрировано)', path: paths.authDemo.centered.resetPassword },
  //         { title: 'Обновление пароля (центрировано)', path: paths.authDemo.centered.updatePassword },
  //         { title: 'Подтверждение (центрировано)', path: paths.authDemo.centered.verify },
  //       ],
  //     },
  //     {
  //       subheader: 'Ошибка',
  //       items: [
  //         // { title: 'Страница 403', path: paths.page403 },
  //         // { title: 'Страница 404', path: paths.page404 },
  //         // { title: 'Страница 500', path: paths.page500 },
  //       ],
  //     },
  //     { subheader: 'Панель управления', items: [{ title: 'Панель управления', path: CONFIG.auth.redirectPath }] },
  //   ],
  // },
  // {
  //   title: 'Документация',
  //   icon: <Iconify width={22} icon="solar:notebook-bold-duotone" />,
  //   // path: paths.docs,
  // },
];
