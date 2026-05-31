import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/product/:id',
        name: 'product-detail',
        component: () => import('../views/ProductDetailView.vue')
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('../views/CartView.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue')
    },
    {
        path: '/product/new',
        name: 'product-new',
        component: () => import('../views/ProductFormView.vue')
    },
    {
        path: '/product/:id/edit',
        name: 'product-edit',
        component: () => import('../views/ProductFormView.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('../views/NotFoundView.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
