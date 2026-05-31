<template>
    <div class="about">
        <h1>Acerca de MercApp</h1>
        <p>Bienvenido a MercApp, tu tienda virtual de confianza.</p>
        <p>Nuestra misión es ofrecerte los mejores productos con la mayor calidad y al mejor precio del mercado.</p>
        <div class="info-section">
            <h3>Nuestros Valores</h3>
            <ul>
                <li>Calidad Garantizada</li>
                <li>Envío Rápido</li>
                <li>Atención Personalizada</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.about {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    text-align: center;
    line-height: 1.6;
}

h1 {
    color: #2c3e50;
    margin-bottom: 20px;
}

.info-section {
    margin-top: 30px;
    text-align: left;
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
}

li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #42b983;
    font-weight: bold;
}
</style>
