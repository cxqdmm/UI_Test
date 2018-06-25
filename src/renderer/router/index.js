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
                { 
                    path: 'puppeteer', 
                    component: () => { return import('../components/puppeteer') },
                    children: [
                        {
                            path: 'uitestIndex',
                            name: '测试页面',
                            component: () => {return import('../components/puppeteer/uitestIndex')}
                        }
                    ]
                },
            ]
        },
        {
            path: '*',
            redirect: '/main'
        }
    ]
})
