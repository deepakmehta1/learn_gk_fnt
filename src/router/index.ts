// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue' // Import HomeView
import QuizPlaygroundView from '@/views/QuizPlaygroundView.vue' // If you have the quiz page
import SubscriptionView from '@/views/SubscriptionView.vue' // Import SubscriptionView

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView, // HomeView is routed here
  },
  {
    path: '/quiz-playground',
    name: 'quiz-playground',
    component: QuizPlaygroundView,
  },
  {
    path: '/subscription',
    name: 'subscription',
    component: SubscriptionView, // Add SubscriptionView route
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
