import { ref } from 'vue';
import api from '../api';
import { useApi } from './useApi';

export function useProducts() {
    const { data: products, loading: productsLoading, error: productsError, request: fetchProducts } = useApi();
    const { data: categories, loading: categoriesLoading, error: categoriesError, request: fetchCategories } = useApi();

    async function getAllProducts() {
        return await fetchProducts(() => api.get('/products'));
    }

    async function getProductById(id) {
        const { data, loading, error, request } = useApi();
        // We use a separate instance of useApi for the detail to avoid conflicts
        return {
            data: ref(null),
            loading: ref(false),
            error: ref(null),
            fetch: async () => {
                loading.value = true;
                try {
                    const response = await api.get(`/products/${id}`);
                    return response.data;
                } catch (err) {
                    throw err;
                } finally {
                    loading.value = false;
                }
            }
        };
    }

    async function createProduct(productData) {
        try {
            const response = await api.post('/products', productData);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    async function updateProduct(id, productData) {
        try {
            const response = await api.put(`/products/${id}`, productData);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    async function deleteProduct(id) {
        try {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    async function getAllCategories() {
        return await fetchCategories(() => api.get('/categories'));
    }

    return {
        products,
        productsLoading,
        productsError,
        getAllProducts,
        categories,
        categoriesLoading,
        categoriesError,
        getAllCategories,
        createProduct,
        updateProduct,
        deleteProduct
    };
}
