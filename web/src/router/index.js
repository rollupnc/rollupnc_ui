import Vue from 'vue'
import Router from 'vue-router'
import RollupNC from '@/components/RollupNC'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'RollupNC',
      component: RollupNC
    }
  ]
})
