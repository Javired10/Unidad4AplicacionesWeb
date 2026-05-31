<template>
    <div class="not-found">
        <h1>404 - Página no encontrada</h1>
        <p>Lo sentimos, la página que buscas no existe.</p>
        <button @click="$router.push('/')">Volver al Inicio</button>
    </div>
</template>

<style scoped>
.not-found {
    text-align: center;
    padding: 100px 20px;
}

h1 {
    font-size: 3rem;
    color: #e74c3c;
    margin-bottom: 20px;
}

p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 30px;
}

button {
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}
</style>
