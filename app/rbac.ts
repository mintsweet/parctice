export default [
  {
    name: 'dashboard',
    path: '/dashboard',
    icon: 'dashboard',
  },
  {
    name: 'auth',
    path: '/auth',
    icon: 'safety',
    routes: [
      {
        name: 'auth.group',
        path: '/auth/group',
        routes: [
          { path: '/auth/group/create' },
          { path: '/auth/group/delete' },
          { path: '/auth/group/update' },
        ],
      },
      {
        name: 'auth.user',
        path: '/auth/user',
        routes: [
          { path: '/auth/user/create' },
          { path: '/auth/user/delete' },
          { path: '/auth/user/update' },
        ],
      },
    ],
  },
];
