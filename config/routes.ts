export default [
  {
    path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/settings', component: './User/Settings' },
    ],
  },
  {path: '/',name: '欢迎',icon: 'smile',component: './Welcome'},

/*  { path: '/', redirect: '/add_chart' },*/
  { path: '/add_chart', name: '智能分析(实时)', icon: 'barChart', component: './AddChart' },
  { path: '/add_chart_async', name: '智能分析(非实时)', icon: 'barChart', component: './AddChartAsync' },
  { path: '/my_chart', name: '我的图表', icon: 'pieChart', component: './MyChart' },
  { path: '/update_chart/:id',  component: './MyChart/UpdateMyChart' },
  { path: '/chart_data/:dataId',  component: './ChartData' },


  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    name: '管理',
    routes: [
      { path: '/admin/userList', name: '用户管理', component: './admin/UserInfo' },
    ],
  },

  { path: '*', layout: false, component: './404' },
];
