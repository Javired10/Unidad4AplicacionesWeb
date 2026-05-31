<template>
    <div class="app-container">
        <nav class="navbar">
            <div class="nav-brand">
                <router-link to="/">🛒 MercApp</router-link>
            </div>
            <div class="nav-links">
                <router-link to="/">Catálogo</router-link>
                <router-link to="/about">Acerca de</router-link>
                <router-link to="/cart" class="cart-link">
                    Carrito <span class="cart-count">{{ cartStore.items.length }}</span>
                </router-link>
                <router-link to="/product/new" class="admin-link">Admin: Nuevo Producto</router-link>
            </div>
        </nav>

        <main class="main-content">
            <Suspense>
                <template #default>
                    <router-view />
                </template>
                <template #fallback>
                    <div class="loading-screen">
                        <div class="spinner"></div>
                        <p>Cargando vista...</p>
                    </div>
                </template>
            </Suspense>
        </main>
    </div>
</template>

<script setup>
import { useCartStore } from './stores/cart';
const cartStore = useCartStore();
</script>

<style>
:root {
    --primary-color: #42b983;
    --secondary-color: #2c3e50;
    --bg-color: #f4f7f6;
    --text-color: #333;
}

body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
}

.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-brand a {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color);
    text-decoration: none;
}

.nav-links {
    display: flex;
    gap: 20px;
    align-items: center;
}

.nav-links a {
    text-decoration: none;
    color: var(--secondary-color);
    font-weight: 500;
    transition: color 0.2s;
}

.nav-links a:hover {
    color: var(--primary-color);
}

.nav-links a.router-link-active {
    color: var(--primary-color);
    border-bottom: 2px solid var(--primary-color);
}

.cart-link {
    position: relative;
    background: #eee;
    padding: 5px 12px;
    border-radius: 20px;
}

.cart-count {
    background: var(--primary-color);
    color: white;
    font-size: 0.75rem;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: 5px;
}

.admin-link {
    border: 1px solid var(--primary-color);
    padding: 5px 12px;
    border-radius: 4px;
    color: var(--primary-color) !important;
}

.main-content {
    flex: 1;
    padding: 20px;
}

.loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #ddd;
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 15px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
