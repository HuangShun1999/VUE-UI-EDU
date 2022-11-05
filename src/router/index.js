import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/Login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  }
]

const Home = {
  path: '/',
  name: 'home',
  component: HomeView,
  meta:{
    requireAuth:true
  }
}
const Course = {
  path: '/Courses',
  name: 'Course',
  component: () => import(/* webpackChunkName: "about" */ '../views/Courses.vue'),
  meta:{
    requireAuth:true
  }
}
const CourseTasks = {
  path: '/CourseTasks',
  name: 'CourseTasks',
  component: () => import(/* webpackChunkName: "about" */ '../views/CourseTasks.vue'),
  meta:{
    requireAuth:true
  }
}

const router = new VueRouter({
  routes
})
router.addRoute(Home)
router.addRoute(Course)
router.addRoute(CourseTasks)
export default router
