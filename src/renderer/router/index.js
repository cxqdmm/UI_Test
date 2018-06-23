import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
    mode:'hash',
    routes: [
        {
            path: '/main',
            name: 'main',
            component: () => { return import('../components/Main') },
            children:[
                { path: 'puppeteer', component: () => { return import('../components/Puppeteer') }},
            ]
        },
        {
            path: '*',
            redirect: '/main'
        }
    ]
})
