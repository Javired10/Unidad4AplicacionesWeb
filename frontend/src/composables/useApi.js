import { ref } from 'vue';
import api from '../api';

export function useApi() {
    const data = ref(null);
    const loading = ref(false);
    const error = ref(null);

    async function request(apiCall, retryCount = 1) {
        loading.value = true;
        error.value = null;
        
        try {
            const response = await apiCall();
            data.value = response.data;
            return response.data;
        } catch (err) {
            if (retryCount > 0) {
                console.log(`Retrying... (${retryCount} attempts left)`);
                return await request(apiCall, retryCount - 1);
            }
            error.value = err.response?.data?.message || err.message || 'Ocurrió un error inesperado';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return { data, loading, error, request };
}
