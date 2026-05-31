<template>
    <div class="product-form">
        <h1>{{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}</h1>
        
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label>Nombre:</label>
                <input v-model="form.nombre" type="text" :class="{ 'error-border': errors.nombre }" />
                <span v-if="errors.nombre" class="error-text">{{ errors.nombre }}</span>
            </div>

            <div class="form-group">
                <label>Descripción:</label>
                <textarea v-model="form.descripcion" :class="{ 'error-border': errors.descripcion }"></textarea>
                <span v-if="errors.descripcion" class="error-text">{{ errors.descripcion }}</span>
            </div>

            <div class="form-group">
                <label>Precio:</label>
                <input v-model.number="form.precio" type="number" step="0.01" :class="{ 'error-border': errors.precio }" />
                <span v-if="errors.precio" class="error-text">{{ errors.precio }}</span>
            </div>

            <div class="form-group">
                <label>Stock:</label>
                <input v-model.number="form.stock" type="number" :class="{ 'error-border': errors.stock }" />
                <span v-if="errors.stock" class="error-text">{{ errors.stock }}</span>
            </div>

            <div class="form-group">
                <label>Categoría:</label>
                <select v-model="form.categoryId" :class="{ 'error-border': errors.categoryId }">
                    <option value="">Seleccione una categoría</option>
                    <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                        {{ cat.nombre }}
                    </option>
                </select>
                <span v-if="errors.categoryId" class="error-text">{{ errors.categoryId }}</span>
            </div>

            <div class="form-group">
                <label>URL de Imagen:</label>
                <input v-model="form.imageUrl" type="text" :class="{ 'error-border': errors.imageUrl }" />
                <span v-if="errors.imageUrl" class="error-text">{{ errors.imageUrl }}</span>
            </div>

            <div class="form-actions">
                <button type="button" @click="$router.push('/')" class="cancel-btn">Cancelar</button>
                <button type="submit" class="submit-btn">Guardar Producto</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProducts } from '../composables/useProducts';
import api from '../api';

const route = useRoute();
const router = useRouter();
const { categories, getAllCategories } = useProducts();

const isEdit = computed(() => !!route.params.id);

const form = ref({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoryId: '',
    imageUrl: ''
});

const errors = ref({});

async function loadProduct() {
    if (isEdit.value) {
        try {
            const response = await api.get(`/products/${route.params.id}`);
            const product = response.data;
            form.value = {
                nombre: product.nombre,
                descripcion: product.descripcion,
                precio: product.precio,
                stock: product.stock,
                categoryId: product.categoryId._id,
                imageUrl: product.imageUrl
            };
        } catch (err) {
            alert('Error al cargar el producto');
            router.push('/');
        }
    }
}

function validate() {
    const newErrors = {};
    if (!form.value.nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.value.descripcion) newErrors.descripcion = 'La descripción es obligatoria';
    if (form.value.precio <= 0) newErrors.precio = 'El precio debe ser mayor a 0';
    if (form.value.stock < 0) newErrors.stock = 'El stock no puede ser negativo';
    if (!form.value.categoryId) newErrors.categoryId = 'La categoría es obligatoria';
    if (!form.value.imageUrl) newErrors.imageUrl = 'La URL de la imagen es obligatoria';
    else if (!form.value.imageUrl.match(/\.(jpeg|jpg|gif|png)$/) && !form.value.imageUrl.startsWith('http')) {
        newErrors.imageUrl = 'URL de imagen no válida';
    }
    
    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
}

async function handleSubmit() {
    if (!validate()) return;

    try {
        if (isEdit.value) {
            await api.put(`/products/${route.params.id}`, form.value);
        } else {
            await api.post('/products', form.value);
        }
        alert('Producto guardado con éxito');
        router.push('/');
    } catch (err) {
        alert(err.response?.data?.message || 'Error al guardar el producto');
    }
}

onMounted(async () => {
    await getAllCategories();
    await loadProduct();
});
</script>

<style scoped>
.product-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
}

.form-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input, .form-group textarea, .form-group select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-group textarea {
    height: 100px;
    resize: vertical;
}

.error-border {
    border-color: red !important;
}

.error-text {
    color: red;
    font-size: 0.85rem;
    margin-top: 5px;
}

.form-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 30px;
}

.cancel-btn {
    padding: 10px 20px;
    background: #ccc;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.submit-btn {
    padding: 10px 20px;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.submit-btn:hover {
    background: #3aa876;
}
</style>
