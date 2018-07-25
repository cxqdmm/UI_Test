import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
    mode:'hash',
    routes: [
        {
            path: '/main',
            name: 'main',
            component: () => { return import('../views/Main') },
            children:[
                { path: 'autoLogIn', component: () => { return import('../views/autoLogIn') }},
            ]
        },
        {
            path: '*',
            redirect: '/main'
        }
    ]
})
