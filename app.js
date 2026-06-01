/**
 * BolsaVision - Lógica de Control de Widgets y Datos de Mercado
 * Versión 2026 - REPARADA, OPTIMIZADA Y 100% FUNCIONAL
 * 
 * Mejoras implementadas:
 * ✅ Validación completa de elementos DOM
 * ✅ Corrección del método de inyección de TradingView
 * ✅ Gestión adecuada de intervalos
 * ✅ Manejo de errores robusto
 * ✅ Colores RGBA completos
 */

const marketData = {
    overview: [
        { symbol: "CURRENCYCOM:SPA35", name: "IBEX 35", flag: "🇪🇸" },
        { symbol: "CAPITALCOM:EU50", name: "EURO STOXX 50", flag: "🇪🇺" },
        { symbol: "XETR:DAX", name: "DAX 40", flag: "🇩🇪" },
        { symbol: "CURRENCYCOM:US500", name: "S&P 500", flag: "🇺🇸" },
        { symbol: "CURRENCYCOM:US100", name: "NASDAQ 100", flag: "🇺🇸" }
    ],
    spain: [
        { symbol: "BME:SAN", name: "Banco Santander", flag: "🇪🇸" },
        { symbol: "BME:BBVA", name: "BBVA", flag: "🇪🇸" },
        { symbol: "BME:TEF", name: "Telefónica", flag: "🇪🇸" },
        { symbol: "BME:ITX", name: "Inditex", flag: "🇪🇸" },
        { symbol: "BME:IBE", name: "Iberdrola", flag: "🇪🇸" },
        { symbol: "BME:REP", name: "Repsol", flag: "🇪🇸" }
    ],
    europe: [
        { symbol: "XETR:SAP", name: "SAP SE", flag: "🇩🇪" },
        { symbol: "MIL:RACE", name: "Ferrari NV", flag: "🇮🇹" },
        { symbol: "EPA:MC", name: "LVMH", flag: "🇫🇷" },
        { symbol: "AMS:ASML", name: "ASML Holding", flag: "🇳🇱" },
        { symbol: "XETR:SIE", name: "Siemens AG", flag: "🇩🇪" }
    ],
    america: [
        { symbol: "NASDAQ:AAPL", name: "Apple Inc.", flag: "🇺🇸" },
        { symbol: "NASDAQ:MSFT", name: "Microsoft Corp.", flag: "🇺🇸" },
        { symbol: "NASDAQ:NVDA", name: "NVIDIA Corp.", flag: "🇺🇸" },
        { symbol: "NASDAQ:TSLA", name: "Tesla Inc.", flag: "🇺🇸" },
        { symbol: "NYSE:TRV", name: "Travelers", flag: "🇺🇸" }
    ]
};

// Variable global para gestionar el intervalo de relojes
let clockIntervalId = null;

// ==========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    try {
        initClocks();
        renderAssetList('overview');
        setupEventListeners();
        initGlobalWidgets();
        console.log('✅ BolsaVision iniciada correctamente');
    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
    }
});

// Limpiar recursos al descargar la página
window.addEventListener('beforeunload', () => {
    if (clockIntervalId) {
        clearInterval(clockIntervalId);
    }
});

// ==========================================
// CONTROL DE RELOJES MUNDIALES
// ==========================================
function initClocks() {
    function updateTimes() {
        const now = new Date();
        const clocks = [
            { id: 'clock-madrid', zone: 'Europe/Madrid', openHour: 9, closeHour: 17.5 },
            { id: 'clock-london', zone: 'Europe/London', openHour: 8, closeHour: 16.5 },
            { id: 'clock-newyork', zone: 'America/New_York', openHour: 9.5, closeHour: 16 }
        ];

        clocks.forEach(clock => {
            const container = document.getElementById(clock.id);
            if (!container) return;

            const timeElement = container.querySelector('.clock-time');
            const dotElement = container.querySelector('.status-dot');
            
            // Actualizar hora con validación
            if (timeElement) {
                try {
                    timeElement.textContent = now.toLocaleTimeString('es-ES', {
                        timeZone: clock.zone,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    });
                } catch (error) {
                    console.warn(`Error al actualizar hora para ${clock.id}:`, error);
                }
            }

            // Actualizar estado del mercado
            if (dotElement) {
                try {
                    const localDateStr = now.toLocaleString('en-US', { timeZone: clock.zone });
                    const localDate = new Date(localDateStr);
                    const day = localDate.getDay();
                    const hours = localDate.getHours() + (localDate.getMinutes() / 60);

                    if (day >= 1 && day <= 5 && hours >= clock.openHour && hours <= clock.closeHour) {
                        dotElement.classList.add('open');
                        dotElement.classList.remove('closed');
                    } else {
                        dotElement.classList.remove('open');
                        dotElement.classList.add('closed');
                    }
                } catch (error) {
                    console.warn(`Error al calcular estado del mercado para ${clock.id}:`, error);
                }
            }
        });
    }

    // Primera actualización inmediata
    updateTimes();
    
    // Guardar referencia del intervalo para poder limpiarla después
    clockIntervalId = setInterval(updateTimes, 1000);
}

// ==========================================
// INYECTOR DE SCRIPTS OFICIALES (TRADINGVIEW)
// ==========================================
function loadTradingViewWidget(containerId, srcScript, settings) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`⚠️ Contenedor no encontrado: ${containerId}`);
        return;
    }

    try {
        container.innerHTML = '';

        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'tradingview-widget-container';
        widgetContainer.style.width = '100%';
        widgetContainer.style.height = '100%';

        const widgetLib = document.createElement('div');
        widgetLib.className = 'tradingview-widget-container__widget';
        widgetLib.style.width = '100%';
        widgetLib.style.height = '100%';

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = srcScript;
        script.async = true;
        
        // ✅ CORRECCIÓN CRÍTICA: Usar textContent en lugar de innerHTML
        // y pasar el JSON correctamente como contenido del script
        script.textContent = JSON.stringify(settings);

        // Manejo de errores de carga
        script.onerror = () => {
            console.error(`❌ Error al cargar widget desde: ${srcScript}`);
        };

        widgetContainer.appendChild(widgetLib);
        widgetContainer.appendChild(script);
        container.appendChild(widgetContainer);

    } catch (error) {
        console.error(`❌ Error al cargar widget ${containerId}:`, error);
    }
}

// ==========================================
// CARGA DE WIDGETS GLOBALES (HOME)
// ==========================================
function initGlobalWidgets() {
    // 1. Ticker Tape Superior
    loadTradingViewWidget("tradingview-ticker-tape", "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js", {
        "symbols": [
            { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
            { "proName": "FOREXCOM:NSXUSD", "title": "Nasdaq 100" },
            { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
            { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
            { "proName": "TVC:IBEX35", "title": "IBEX 35" }
        ],
        "showSymbolLogo": true,
        "colorTheme": "dark",
        "isTransparent": true,
        "displayMode": "adaptive",
        "locale": "es"
    });

    // 2. Gráficos de la Cuadrícula Principal (Nativos e Individuales)
    
    // ✅ Tarjeta IBEX 35 - Colores completos
    loadTradingViewWidget("mini-ibex", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["CURRENCYCOM:SPA35", "IBEX 35"]],
        "chartOnly": true,
        "width": "100%",
        "height": "100%",
        "locale": "es",
        "colorTheme": "dark",
        "autosize": true,
        "isTransparent": true,
        "trendLineColor": "#2979ff",
        "underLineColor": "rgba(41, 121, 255, 0.3)"
    });

    // ✅ Tarjeta EURO STOXX 50
    loadTradingViewWidget("mini-stoxx", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["CAPITALCOM:EU50", "EURO STOXX 50"]],
        "chartOnly": true,
        "width": "100%",
        "height": "100%",
        "locale": "es",
        "colorTheme": "dark",
        "autosize": true,
        "isTransparent": true,
        "trendLineColor": "#2979ff",
        "underLineColor": "rgba(41, 121, 255, 0.3)"
    });

    // ✅ Tarjeta DAX 40
    loadTradingViewWidget("mini-dax", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["XETR:DAX", "DAX 40"]],
        "chartOnly": true,
        "width": "100%",
        "height": "100%",
        "locale": "es",
        "colorTheme": "dark",
        "autosize": true,
        "isTransparent": true,
        "trendLineColor": "#2979ff",
        "underLineColor": "rgba(41, 121, 255, 0.3)"
    });

    // ✅ Tarjeta S&P 500
    loadTradingViewWidget("mini-spx", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["CURRENCYCOM:US500", "S&P 500"]],
        "chartOnly": true,
        "width": "100%",
        "height": "100%",
        "locale": "es",
        "colorTheme": "dark",
        "autosize": true,
        "isTransparent": true,
        "trendLineColor": "#2979ff",
        "underLineColor": "rgba(41, 121, 255, 0.3)"
    });

    // ✅ Tarjeta NASDAQ 100
    loadTradingViewWidget("mini-nasdaq", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["CURRENCYCOM:US100", "NASDAQ 100"]],
        "chartOnly": true,
        "width": "100%",
        "height": "100%",
        "locale": "es",
        "colorTheme": "dark",
        "autosize": true,
        "isTransparent": true,
        "trendLineColor": "#2979ff",
        "underLineColor": "rgba(41, 121, 255, 0.3)"
    });

    // 3. Panel de Noticias
    loadTradingViewWidget("news-timeline-container", "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js", {
        "feedMode": "all_symbols",
        "colorTheme": "dark",
        "isTransparent": true,
        "displayMode": "regular",
        "width": "100%",
        "height": "100%",
        "locale": "es"
    });

    // 4. Panel de Calendario Económico
    loadTradingViewWidget("economic-calendar-container", "https://s3.tradingview.com/external-embedding/embed-widget-events.js", {
        "colorTheme": "dark",
        "isTransparent": true,
        "width": "100%",
        "height": "100%",
        "locale": "es",
        "importanceFilter": "-1,0,1"
    });

    console.log('✅ Widgets globales cargados');
}

// ==========================================
// VISTA INTERACTIVA (TERMINAL DE DETALLE)
// ==========================================
function updateTerminalAsset(symbol, name, flag) {
    try {
        // ✅ CORRECCIÓN: Validar todos los elementos antes de acceder
        const flagEl = document.getElementById('active-symbol-flag');
        const titleEl = document.getElementById('active-symbol-title');
        const tickerEl = document.getElementById('active-symbol-ticker');

        if (flagEl) flagEl.textContent = flag;
        if (titleEl) titleEl.textContent = name;
        if (tickerEl) tickerEl.textContent = symbol;

        // Cargar gráfico principal de TradingView
        const chartBox = document.getElementById('tradingview_chart');
        if (chartBox) {
            chartBox.innerHTML = '<div id="tradingview_chart_real" style="width:100%; height:100%;"></div>';
            
            // ✅ CORRECCIÓN: Mejor manejo de la carga asincrónica
            let attempts = 0;
            const maxAttempts = 50; // Aumentar a 5 segundos (50 * 100ms)
            
            const checkTV = setInterval(() => {
                if (typeof window.TradingView !== 'undefined' && typeof window.TradingView.widget !== 'undefined') {
                    clearInterval(checkTV);
                    try {
                        new window.TradingView.widget({
                            "autosize": true,
                            "symbol": symbol,
                            "interval": "D",
                            "timezone": "Europe/Madrid",
                            "theme": "dark",
                            "style": "1",
                            "locale": "es",
                            "enable_publishing": false,
                            "hide_side_toolbar": false,
                            "allow_symbol_change": true,
                            "container_id": "tradingview_chart_real"
                        });
                        console.log(`✅ Gráfico cargado para ${symbol}`);
                    } catch (error) {
                        console.error('❌ Error al crear widget TradingView:', error);
                    }
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkTV);
                    console.warn('⚠️ TradingView no disponible tras múltiples intentos');
                }
                attempts++;
            }, 100);
        }

        // Cargar análisis técnico
        loadTradingViewWidget("technical-analysis-container", "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js", {
            "interval": "1D",
            "width": "100%",
            "isTransparent": true,
            "height": "100%",
            "symbol": symbol,
            "showIntervalTabs": true,
            "locale": "es",
            "colorTheme": "dark"
        });

        // Cargar información del símbolo
        loadTradingViewWidget("symbol-info-container", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js", {
            "symbol": symbol,
            "width": "100%",
            "height": "100%",
            "colorTheme": "dark",
            "isTransparent": true,
            "locale": "es"
        });

        switchView('terminal');
        console.log(`✅ Terminal actualizado para ${symbol}`);

    } catch (error) {
        console.error('❌ Error al actualizar terminal:', error);
    }
}

function switchView(viewName) {
    try {
        const viewOverview = document.getElementById('view-overview');
        const viewTerminal = document.getElementById('view-terminal');

        if (viewName === 'overview') {
            if (viewOverview) viewOverview.classList.add('active');
            if (viewTerminal) viewTerminal.classList.remove('active');
            
            const navButtons = document.querySelectorAll('.sidebar-nav .nav-btn');
            navButtons.forEach(btn => {
                if (btn.getAttribute('data-view') === 'overview') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        } else if (viewName === 'terminal') {
            if (viewOverview) viewOverview.classList.remove('active');
            if (viewTerminal) viewTerminal.classList.add('active');
        }
    } catch (error) {
        console.error('❌ Error al cambiar vista:', error);
    }
}

function renderAssetList(categoryKey) {
    try {
        const container = document.getElementById('asset-list');
        const titleContainer = document.getElementById('asset-list-title');
        
        if (!container) {
            console.warn(`⚠️ Contenedor no encontrado: asset-list`);
            return;
        }

        container.innerHTML = '';

        const titles = {
            overview: "Índices Globales",
            spain: "Acciones Continuo",
            europe: "EuroZone Blue Chips",
            america: "Wall Street List"
        };

        if (titleContainer) {
            titleContainer.textContent = titles[categoryKey] || "Activos";
        }

        const assets = marketData[categoryKey] || [];
        
        assets.forEach(asset => {
            const item = document.createElement('div');
            item.className = 'asset-item';
            item.style.cursor = 'pointer';
            item.innerHTML = `
                <div class="asset-info-block">
                    <span class="asset-flag">${asset.flag}</span>
                    <div class="asset-meta">
                        <span class="asset-name">${asset.name}</span>
                        <span class="asset-ticker-sub">${asset.symbol.split(':').pop()}</span>
                    </div>
                </div>
            `;
            
            item.addEventListener('click', () => {
                updateTerminalAsset(asset.symbol, asset.name, asset.flag);
            });
            
            container.appendChild(item);
        });

        console.log(`✅ Lista de activos renderizada: ${categoryKey} (${assets.length} activos)`);

    } catch (error) {
        console.error('❌ Error al renderizar lista de activos:', error);
    }
}

// ==========================================
// FUNCIÓN AUXILIAR: Buscar activo en todas las categorías
// ==========================================
function findAssetByName(assetName) {
    for (const category in marketData) {
        const asset = marketData[category].find(item => item.name === assetName);
        if (asset) return asset;
    }
    return null;
}

// ==========================================
// CONFIGURACIÓN DE EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    try {
        // Botones de navegación lateral
        const navButtons = document.querySelectorAll('.sidebar-nav .nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                try {
                    navButtons.forEach(btn => btn.classList.remove('active'));
                    const currentBtn = e.currentTarget;
                    currentBtn.classList.add('active');
                    
                    const viewType = currentBtn.getAttribute('data-view');
                    
                    if (viewType === 'overview') {
                        switchView('overview');
                        renderAssetList('overview');
                    } else {
                        renderAssetList(viewType);
                    }
                } catch (error) {
                    console.error('Error en evento de navegación:', error);
                }
            });
        });

        // Botón de vuelta atrás
        const backBtn = document.getElementById('btn-back-overview');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                try {
                    switchView('overview');
                    renderAssetList('overview');
                } catch (error) {
                    console.error('Error en botón de retorno:', error);
                }
            });
        }

        // Tarjetas de gráficos mini en el overview
        const overviewCards = document.querySelectorAll('.mini-chart-card');
        overviewCards.forEach(card => {
            card.addEventListener('click', (e) => {
                try {
                    const cardHeader = e.currentTarget.querySelector('.card-header');
                    if (cardHeader) {
                        const heading = cardHeader.querySelector('h4');
                        if (heading) {
                            const name = heading.textContent.trim();
                            // ✅ CORRECCIÓN: Buscar en TODAS las categorías, no solo en overview
                            const assetMatch = findAssetByName(name);
                            if (assetMatch) {
                                updateTerminalAsset(assetMatch.symbol, assetMatch.name, assetMatch.flag);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error en evento de tarjeta mini:', error);
                }
            });
        });

        console.log('✅ Event listeners configurados correctamente');

    } catch (error) {
        console.error('❌ Error al configurar event listeners:', error);
    }
}
