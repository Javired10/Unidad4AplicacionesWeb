<template>
    <div class="cart">
        <h1>Tu Carrito de Compras</h1>

        <div v-if="cartStore.items.length === 0" class="empty-cart">
            <p>El carrito está vacío.</p>
            <button @click="$router.push('/')">Ir al catálogo</button>
        </div>

        <div v-else class="cart-container">
            <div class="cart-items">
                <div v-for="item in cartStore.items" :key="item.product._id" class="cart-item">
                    <img :src="item.product.imageUrl" :alt="item.product.nombre" class="item-image" />
                    <div class="item-details">
                        <h3>{{ item.product.nombre }}</h3>
                        <p class="price">${{ item.product.precio.toFixed(2) }}</p>
                        <div class="quantity-controls">
                            <button @click="updateQuantity(item.product._id, item.quantity - 1)">-</button>
                            <span>{{ item.quantity }}</span>
                            <button @click="updateQuantity(item.product._id, item.quantity + 1)">+</button>
                        </div>
                    </div>
                    <div class="item-total">
                        <p>${{ (item.product.precio * item.quantity).toFixed(2) }}</p>
                        <button @click="removeFromCart(item.product._id)" class="remove-btn">Eliminar</button>
                    </div>
                </div>
            </div>

            <div class="cart-summary">
                <h2>Resumen</h2>
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>${{ cartStore.total.toFixed(2) }}</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>${{ cartStore.total.toFixed(2) }}</span>
                </div>
                <button @click="checkout" class="checkout-btn">Finalizar Compra</button>
                <button @click="clearCart" class="clear-btn">Vaciar Carrito</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();

function updateQuantity(productId, quantity) {
    cartStore.updateQuantity(productId, quantity);
}

function removeFromCart(productId) {
    cartStore.removeFromCart(productId);
}

function clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cartStore.clearCart();
    }
}

function checkout() {
    alert('¡Gracias por tu compra!');
    cartStore.clearCart();
}
</script>

<style scoped>
.cart {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
}

.empty-cart {
    text-align: center;
    padding: 50px;
    font-size: 1.2rem;
}

.empty-cart button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.cart-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
}

.cart-items {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.cart-item {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 15px;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.item-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
}

.item-details {
    flex: 1;
}

.item-details h3 {
    margin: 0 0 5px 0;
}

.price {
    color: #666;
    margin-bottom: 10px;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.quantity-controls button {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
}

.item-total {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
}

.item-total p {
    font-weight: bold;
    font-size: 1.1rem;
}

.remove-btn {
    background: none;
    border: none;
    color: red;
    cursor: pointer;
    font-size: 0.9rem;
}

.cart-summary {
    padding: 20px;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    height: fit-content;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
}

.summary-row.total {
    font-weight: bold;
    font-size: 1.3rem;
    border-top: 1px solid #ddd;
    padding-top: 15px;
    margin-top: 15px;
}

.checkout-btn {
    width: 100%;
    padding: 12px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 10px;
}

.clear-btn {
    width: 100%;
    padding: 12px;
    background: none;
    border: 1px solid #ccc;
    color: #666;
    border-radius: 4px;
    cursor: pointer;
}

@media (max-width: 768px) {
    .cart-container {
        grid-template-columns: 1fr;
    }
}
</style>
