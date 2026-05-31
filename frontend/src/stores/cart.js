import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const items = ref(JSON.parse(localStorage.getItem('cart')) || []);

    const total = computed(() => {
        return items.value.reduce((acc, item) => acc + item.product.precio * item.quantity, 0);
    });

    function addToCart(product) {
        const existingItem = items.value.find(item => item.product._id === product._id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            items.value.push({ product, quantity: 1 });
        }
        saveCart();
    }

    function removeFromCart(productId) {
        items.value = items.value.filter(item => item.product._id !== productId);
        saveCart();
    }

    function updateQuantity(productId, quantity) {
        const item = items.value.find(item => item.product._id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            saveCart();
        }
    }

    function clearCart() {
        items.value = [];
        saveCart();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(items.value));
    }

    return {
        items,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
    };
});
