import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";
import { flattedChildren } from "element-plus/es/utils/index.mjs";
import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser } from '@/api/user-api'

let routes = [

    //一级路由，登录注册相关
    {
        path: '/auth',
        name: 'auth',
        component: () => import('../layouts/AuthLayout.vue'),
        children: [

            {
                path: 'login',
                name: 'login',
                component: () => import('../view/auth/LoginView.vue')
            }
            ,
            {
                path: 'register',
                name: 'register',
                component: () => import('../view/auth/RegisterView.vue')
            }


        ]

    },
    //一级路由，主应用领域

    {
        path: '/',
        name: 'app',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../layouts/MainLayout.vue'),
        redirect: '/auth/login',
        children: [
            {

                path: 'home',
                name: 'home',

                component: () => import('../view/HomeView.vue')
            },
            {
                path: 'guide',
                name: 'guide',

                component: () => import('../view/Guide.vue')


            },
            {
                path: 'team',
                name: 'team',
                redirect: '/team/list',

                children: [
                    {

                        path: 'list',
                        name: 'list',
                        component: () => import('../view/team/TeamList.vue'),

                    },
                    {
                        path: 'detail/:id',
                        name: 'teamdetail',
                        component: () => import('../view/team/TeamDetail.vue')
                    },
                    {
                        path: 'create',
                        name: 'create',
                        component: () => import('../view/team/TeamCreate.vue'),


                    },
                    {

                        path: 'mycreateteams',
                        name: 'mycreateteams',
                        component: () => import('../view/team/MyCreateTeams.vue')
                    }, {
                        path: 'myjointeams',
                        name: 'myjointeams',
                        component: () => import('../view/team/MyJoinTeams.vue')
                    }


                ]
            },
            {
                path: 'user',
                name: 'user',


                redirect: '/user/profile',
                children: [
                    {

                        path: 'profile/:userId?',
                        name: 'userprofile',
                        component: () => import('../view/user/UserProfile.vue')

                    },
                    {
                        path: 'edit',

                        name: 'useredit',
                        component: () => import('../view/user/UserEdit.vue')



                    }


                ]

            }, {
                path: 'usersearch',
                name: 'usersearch',
                component: () => import('../view/user/UserSearchView.vue')
            },{
                path:'usermatch',
                name:'usermatch',
                component: () => import('../view/user/UserMatchView.vue')
            },
            {
                path: 'friendtest/:userId?',
                name: 'friendtest',
                component: () => import('../view/user/FriendTestView.vue')
            }


        ]
    }

]
// 路由
const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
  // 允许直接访问登录、注册页面
  if (to.path.startsWith('/auth')) {
    return next()
  }
  // 其他页面需要登录
  try {
    const res = await getCurrentUser()
    if (res && res.code === 0 && res.data) {
      // 已登录
      return next()
    }
  } catch (e) {
    // ignore
  }
  // 未登录，跳转到登录页
  next('/auth/login')
})
// 导出
export default router