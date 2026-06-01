// ==========================================
// 2. INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Los relojes y la lista lateral arrancan al instante
    initClocks();
    renderAssetList('overview');
    setupEventListeners();
    
    // 2. Comprobación inteligente de la librería externa de TradingView
    let checkAttempts = 0;
    const checkTradingViewReady = setInterval(() => {
        checkAttempts++;
        
        // Si la librería ya está disponible en el navegador
        if (typeof TradingView !== 'undefined' && typeof TradingView.widget !== 'undefined') {
            clearInterval(checkTradingViewReady);
            console.log("¡SDK de TradingView detectado con éxito!");
            initGlobalWidgets();
        } 
        // Si tarda demasiado (más de 10 segundos), detenemos para no saturar
        else if (checkAttempts > 40) {
            clearInterval(checkTradingViewReady);
            console.error("Error: La librería externa de TradingView tardó demasiado en responder.");
        }
    }, 250); // Comprueba cada 250 milisegundos de forma ultra-rápida
});
