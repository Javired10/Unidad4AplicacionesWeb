<template>
    <div class="home">
        <h1>Catálogo de Productos</h1>

        <div class="filters">
            <div class="search-box">
                <input 
                    v-model="searchQuery" 
                    type="text" 
                    placeholder="Buscar producto..." 
                />
            </div>
            <div class="category-box">
                <select v-model="selectedCategory">
                    <option value="">Todas las categorías</option>
                    <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                        {{ cat.nombre }}
                    </option>
                </select>
            </div>
        </div>

        <div v-if="productsLoading" class="loading">Cargando productos...</div>
        <div v-else-if="productsError" class="error">{{ productsError }}</div>
        
        <div v-else class="product-grid">
            <ProductCard
                v-for="product in filteredProducts"
                :key="product._id"
                :product="product"
                @added-to-cart="addToCart"
                @edit-product="editProduct"
                @delete-product="deleteProduct"
            />
            <div v-if="filteredProducts.length === 0" class="no-results">
                No se encontraron productos que coincidan con tu búsqueda.
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProducts } from '../composables/useProducts';
import { useCartStore } from '../stores/cart';
import ProductCard from '../components/ProductCard.vue';
import api from '../api';

const {
    products,
    productsLoading,
    productsError,
    getAllProducts,
    categories,
    categoriesLoading,
    getAllCategories
} = useProducts();

const cartStore = useCartStore();
const router = useRouter();

const searchQuery = ref('');
const selectedCategory = ref('');

const filteredProducts = computed(() => {
    if (!products.value) return [];
    return products.value.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                              product.descripcion.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesCategory = selectedCategory.value === '' || product.categoryId?._id === selectedCategory.value;
        return matchesSearch && matchesCategory;
    });
});

async function addToCart(product) {
    cartStore.addToCart(product);
    alert(`${product.nombre} ha sido añadido al carrito`);
}

function editProduct(productId) {
    router.push(`/product/${productId}/edit`);
}

async function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        try {
            await api.delete(`/products/${productId}`);
            await getAllProducts(); // Recargar la lista
            alert('Producto eliminado correctamente');
        } catch (err) {
            alert('Error al eliminar el producto');
        }
    }
}

onMounted(async () => {
    await Promise.all([
        getAllProducts(),
        getAllCategories()
    ]);
});
</script>

<style scoped>
.home {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
}

.filters {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    justify-content: center;
    flex-wrap: wrap;
}

.search-box input, .category-box select {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-width: 250px;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
}

.loading, .error, .no-results {
    text-align: center;
    font-size: 1.2rem;
    margin-top: 50px;
}

.error {
    color: red;
}

.no-results {
    color: #666;
    grid-column: 1 / -1;
}
</style>
