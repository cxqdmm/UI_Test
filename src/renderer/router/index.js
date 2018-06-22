import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'main-page',
            component: () => { return import('../components/Main') }
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
