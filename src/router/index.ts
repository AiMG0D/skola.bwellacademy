import isAuthenticated from "@/router/guards/isAuthenticated";
import isGuest from "@/router/guards/isGuest";
import ForgotPassword from "@/views/ForgotPassword.vue";
import GoalsImprovePage from '@/views/GoalsImprovePage.vue';
import GoalsMidPage from '@/views/GoalsMidPage.vue';
import GoalsPage from '@/views/GoalsPage.vue';
import GoalsPhysicalTestsReminder from "@/views/GoalsPhysicalTestsReminder.vue";
import GoalsStartPage from '@/views/GoalsStartPage.vue';
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import MinLivsstilPage from '@/views/MinLivsstilPage.vue';
import MittArbetePage from '@/views/MittArbetePage.vue';
import OverviewPage from "@/views/OverviewPage.vue";
import PlanPage from '@/views/PlanPage.vue';
import PlanPreludePage from '@/views/PlanPreludePage.vue';
import PlanResultsPage from '@/views/PlanResultsPage.vue';
import StartPage from '@/views/StartPage.vue';
import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Start',
    component: StartPage,
    beforeEnter: isGuest,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    beforeEnter: isGuest,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    beforeEnter: isGuest,
  },
  {
    path: '/home',
    name: 'Home',
    component: OverviewPage,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/evaluate',
    name: 'Evaluate',
    component: HomePage,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/questions/1',
    name: 'MittArbete',
    component: MittArbetePage,
    props: { page: 1 },
    beforeEnter: isAuthenticated,
  },
  {
    path: '/questions/2',
    name: 'MinLivsstil',
    component: MinLivsstilPage,
    props: { page: 2 },
    beforeEnter: isAuthenticated,
  },
  {
    path: '/goals/happy',
    name: 'Goals',
    component: GoalsPage,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/goals/reflect',
    name: 'GoalsMidPage',
    component: GoalsMidPage,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/goals/improve',
    name: 'GoalsImprovePage',
    component: GoalsImprovePage,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/goals/reminder',
    name: 'GoalsPhysicalTestsReminder',
    component: GoalsPhysicalTestsReminder,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/goals',
    name: 'GoalsStartPage',
    component: GoalsStartPage,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/plan/prelude',
    name: 'PlanPrelude',
    component: PlanPreludePage,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/plan',
    name: 'Plan',
    component: PlanPage,
    beforeEnter: isAuthenticated,
  },
  {
    path: '/plan/results',
    name: 'PlanResults',
    component: PlanResultsPage,
    beforeEnter: isAuthenticated,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router
