export default [
  {
    path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/settings', component: './User/Settings' },
    ],
  },
  { path: '/', name: '主页', icon: 'smile', component: './Welcome' },
  { path: '/ai', name: 'AI服务', icon: 'smile', component: './ListPage' },

  /*  { path: '/', redirect: '/add_chart' },*/
  /*, name: '智能分析(非实时)', icon: 'barChart'
  * name: '智能分析(实时)', icon: 'barChart'
  * */
  { path: '/add_chart', component: './AddChart' },
  { path: '/add_chart_async', component: './AddChartAsync' },
  { path: '/add_chart_async_upgrade', component: './AddChartAsyncUpgrade' },
  { path: '/add_chart_async_upgrade/add', component: './AddChartAsyncUpgrade/GenChartUpgrade' },
  { path: '/my_chart', name: '我的图表', icon: 'pieChart', component: './MyChart' },
  { path: '/message', component: './Message' },
  { path: '/chart', component: './ChartBox' },
  { path: '/update_chart/:id', component: './MyChart/UpdateMyChart' },
  { path: '/chart_data/:dataId', component: './ChartData' },


  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    name: '管理',
    routes: [
      { path: '/admin/userList', name: '用户管理', component: './admin/UserInfo' },
      { path: '/admin/AIModelList', name: 'AI管理', component: './admin/AiModel' },
      { path: '/admin/chartList', name: '图表管理', component: './admin/ChartInfo' },
    ],

  },

  { path: '*', layout: false, component: './404' },
];
