<template>
    <div class="product-detail">
        <div v-if="loading" class="loading">Cargando detalles del producto...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        
        <div v-else-if="product" class="detail-container">
            <button @click="$router.push('/')" class="back-btn">← Volver al catálogo</button>
            
            <div class="content">
                <img :src="product.imageUrl" :alt="product.nombre" class="detail-image" />
                <div class="info">
                    <h1>{{ product.nombre }}</h1>
                    <p class="category">{{ product.categoryId?.nombre || 'Sin categoría' }}</p>
                    <p class="price">${{ product.precio.toFixed(2) }}</p>
                    <p class="description">{{ product.descripcion }}</p>
                    <p class="stock">Stock disponible: {{ product.stock }}</p>
                    <div class="actions">
                        <button @click="addToCart" :disabled="product.stock <= 0" class="add-btn">
                            {{ product.stock <= 0 ? 'Agotado' : 'Añadir al Carrito' }}
                        </button>
                        <div class="admin-actions">
                            <button @click="$router.push(`/product/${product._id}/edit`)" class="edit-btn">Editar</button>
                            <button @click="deleteProduct" class="delete-btn">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../api';
import { useCartStore } from '../stores/cart';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const product = ref(null);
const loading = ref(true);
const error = ref(null);

async function fetchProduct() {
    try {
        const response = await api.get(`/products/${route.params.id}`);
        product.value = response.data;
    } catch (err) {
        error.value = err.response?.data?.message || 'Error al cargar el producto';
    } finally {
        loading.value = false;
    }
}

function addToCart() {
    cartStore.addToCart(product.value);
    alert(`${product.value.nombre} ha sido añadido al carrito`);
}

async function deleteProduct() {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        try {
            await api.delete(`/products/${product.value._id}`);
            alert('Producto eliminado correctamente');
            router.push('/');
        } catch (err) {
            alert('Error al eliminar el producto');
        }
    }
}

onMounted(fetchProduct);
</script>

<style scoped>
.product-detail {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

.back-btn {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    margin-bottom: 20px;
    font-size: 1rem;
}

.content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
}

.detail-image {
    width: 100%;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.info h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #2c3e50;
}

.category {
    color: #666;
    font-style: italic;
    margin-bottom: 15px;
}

.price {
    font-size: 1.8rem;
    font-weight: bold;
    color: #42b983;
    margin-bottom: 20px;
}

.description {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 25px;
    color: #444;
}

.stock {
    margin-bottom: 20px;
    font-weight: 500;
}

.actions {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
}

.add-btn {
    background-color: #42b983;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
    width: 100%;
}

.add-btn:hover:not(:disabled) {
    background-color: #3aa876;
}

.add-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.admin-actions {
    display: flex;
    gap: 10px;
    width: 100%;
}

.edit-btn, .delete-btn {
    flex: 1;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    border: 1px solid #ddd;
}

.edit-btn {
    background-color: #f0ad4e;
    color: white;
    border-color: #eea236;
}

.delete-btn {
    background-color: #d9534f;
    color: white;
    border-color: #d43f3a;
}

.edit-btn:hover { background-color: #ec971f; }
.delete-btn:hover { background-color: #c9302c; }

.loading, .error {
    text-align: center;
    font-size: 1.2rem;
    margin-top: 50px;
}

.error {
    color: red;
}

@media (max-width: 768px) {
    .content {
        grid-template-columns: 1fr;
    }
}
</style>
