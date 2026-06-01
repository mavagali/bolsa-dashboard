/**
 * BolsaVision - Lógica de Control de Widgets y Datos de Mercado
 * Versión 2026 - Blindada contra fallos de IDs
 */

// ==========================================
// 1. CONFIGURACIÓN DE ACTIVOS Y MERCADOS
// ==========================================
const marketData = {
    overview: [
        { symbol: "TVC:IBEX35", name: "IBEX 35", flag: "🇪🇸" },
        { symbol: "INDEX:SX5E", name: "EURO STOXX 50", flag: "🇪🇺" },
        { symbol: "XETR:DAX", name: "DAX 40", flag: "🇩🇪" },
        { symbol: "SP:SPX", name: "S&P 500", flag: "🇺🇸" },
        { symbol: "NASDAQ:IXIC", name: "NASDAQ 100", flag: "🇺🇸" },
        { symbol: "INDEX:UKX", name: "FTSE 100", flag: "🇬🇧" }
    ],
    spain: [
        { symbol: "BMV:SAN", name: "Banco Santander", flag: "🇪🇸" },
        { symbol: "BMV:BBVA", name: "BBVA", flag: "🇪🇸" },
        { symbol: "BMV:TEF", name: "Telefónica", flag: "🇪🇸" },
        { symbol: "BMV:ITX", name: "Inditex", flag: "🇪🇸" },
        { symbol: "BMV:IBE", name: "Iberdrola", flag: "🇪🇸" },
        { symbol: "BMV:REP", name: "Repsol", flag: "🇪🇸" }
    ],
    europe: [
        { symbol: "XETR:SAP", name: "SAP SE", flag: "🇩🇪" },
        { symbol: "MIL:RACE", name: "Ferrari NV", flag: "🇮🇹" },
        { symbol: "Euronext:MC", name: "LVMH Moët Hennessy", flag: "🇫🇷" },
        { symbol: "ASML:ASML", name: "ASML Holding", flag: "🇳🇱" },
        { symbol: "XETR:SIE", name: "Siemens AG", flag: "🇩🇪" }
    ],
    america: [
        { symbol: "NASDAQ:AAPL", name: "Apple Inc.", flag: "🇺🇸" },
        { symbol: "NASDAQ:MSFT", name: "Microsoft Corp.", flag: "🇺🇸" },
        { symbol: "NASDAQ:NVDA", name: "NVIDIA Corp.", flag: "🇺🇸" },
        { symbol: "NASDAQ:TSLA", name: "Tesla Inc.", flag: "🇺🇸" },
        { symbol: "NYSE:TRV", name: "The Travelers Companies", flag: "🇺🇸" }
    ]
};

// ==========================================
// 2. INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Arrancar relojes inmediatamente
    initClocks();
    
    // 2. Pintar la barra lateral inicial
    renderAssetList('overview');
    
    // 3. Vincular los eventos de los clics de forma segura
    setupEventListeners();
    
    // 4. Cargar los componentes pesados de TradingView tras un breve delay seguro
    setTimeout(() => {
        initGlobalWidgets();
    }, 1500);
});

// ==========================================
// 3. CONTROL DE RELOJES MUNDIALES (CON CONTROL DE ERRORES)
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
            if (container) {
                const timeElement = container.querySelector('.clock-time');
                const dotElement = container.querySelector('.status-dot');
                
                if (timeElement) {
                    timeElement.textContent = now.toLocaleTimeString('es-ES', {
                        timeZone: clock.zone,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    });
                }

                if (dotElement) {
                    const localDateStr = now.toLocaleString('en-US', { timeZone: clock.zone });
                    const localDate = new Date(localDateStr);
                    const day = localDate.getDay();
                    const hours = localDate.getHours() + (localDate.getMinutes() / 60);

                    // Abierto de Lunes a Viernes (1-5) en horario comercial
                    if (day >= 1 && day <= 5 && hours >= clock.openHour && hours <= clock.closeHour) {
                        dotElement.classList.add('open');
                    } else {
                        dotElement.classList.remove('open');
                    }
                }
            }
        });
    }
    
    updateTimes();
    setInterval(updateTimes, 1000);
}

// ==========================================
// 4. RENDERS DE TRADINGVIEW FIJOS (HOME)
// ==========================================
function initGlobalWidgets() {
    if (typeof TradingView === 'undefined') {
        console.warn("Retrying widgets loading... TradingView SDK not ready yet.");
        return;
    }

    try {
        // Ticker Tape
        if (document.getElementById("tradingview-ticker-tape")) {
            new TradingView.widget({
                "container_id": "tradingview-ticker-tape",
                "symbols": [
                    { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
                    { "proName": "FOREXCOM:NSXUSD", "title": "US Tech 100" },
                    { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
                    { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" }
                ],
                "showSymbolLogo": true,
                "colorTheme": "dark",
                "isTransparent": true,
                "displayMode": "adaptive",
                "locale": "es"
            });
        }

        // Minigráficos embebidos mediante script nativo
        const miniCharts = [
            { id: 'mini-ibex', symbol: 'TVC:IBEX35' },
            { id: 'mini-stoxx', symbol: 'INDEX:SX5E' },
            { id: 'mini-dax', symbol: 'XETR:DAX' },
            { id: 'mini-spx', symbol: 'SP:SPX' },
            { id: 'mini-nasdaq', symbol: 'NASDAQ:IXIC' },
            { id: 'mini-ftse', symbol: 'INDEX:UKX' }
        ];

        miniCharts.forEach(chart => {
            const container = document.getElementById(chart.id);
            if (container) {
                container.innerHTML = '';
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
                script.async = true;
                script.innerHTML = JSON.stringify({
                    "symbol": chart.symbol,
                    "width": "100%",
                    "height": "100%",
                    "dateRange": "1M",
                    "colorTheme": "dark",
                    "trendLineColor": "#2979ff",
                    "underLineColor": "rgba(41, 121, 255, 0.15)",
                    "underLineBottomColor": "rgba(41, 121, 255, 0)",
                    "isTransparent": true,
                    "autosize": true,
                    "locale": "es"
                });
                container.appendChild(script);
            }
        });

        // Noticias
        if (document.getElementById("news-timeline-container")) {
            new TradingView.widget({
                "container_id": "news-timeline-container",
                "feedMode": "all_symbols",
                "colorTheme": "dark",
                "isTransparent": true,
                "displayMode": "regular",
                "width": "100%",
                "height": "100%",
                "locale": "es"
            });
        }

        // Calendario
        if (document.getElementById("economic-calendar-container")) {
            new TradingView.widget({
                "container_id": "economic-calendar-container",
                "colorTheme": "dark",
                "isTransparent": true,
                "width": "100%",
                "height": "100%",
                "locale": "es",
                "importanceFilter": "-1,0,1"
            });
        }

    } catch (e) {
        console.error("Error inicializando componentes TradingView:", e);
    }
}

// ==========================================
// 5. CAMBIO DINÁMICO DE ACTIVOS (TERMINAL)
// ==========================================
function updateTerminalAsset(symbol, name, flag) {
    // Actualizar textos e iconos de cabecera de forma segura
    const flagEl = document.getElementById('active-symbol-flag');
    const titleEl = document.getElementById('active-symbol-title');
    const tickerEl = document.getElementById('active-symbol-ticker');
    
    if (flagEl) flagEl.textContent = flag;
    if (titleEl) titleEl.textContent = name;
    if (tickerEl) tickerEl.textContent = symbol;

    // 1. Renderizar Gráfico de Detalle Principal
    const chartBox = document.getElementById('tradingview_chart');
    if (chartBox) {
        chartBox.innerHTML = '<div id="tradingview_chart_real" style="width:100%; height:100%;"></div>';
        new TradingView.widget({
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
    }

    // 2. Renderizar Widget de Análisis Técnico (Reloj / Gauge)
    const gaugeContainer = document.getElementById('technical-analysis-container');
    if (gaugeContainer) {
        gaugeContainer.innerHTML = '';
        const gaugeScript = document.createElement('script');
        gaugeScript.type = 'text/javascript';
        gaugeScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
        gaugeScript.async = true;
        gaugeScript.innerHTML = JSON.stringify({
            "interval": "1D",
            "width": "100%",
            "isTransparent": true,
            "height": "100%",
            "symbol": symbol,
            "showIntervalTabs": true,
            "locale": "es",
            "colorTheme": "dark"
        });
        gaugeContainer.appendChild(gaugeScript);
    }

    // 3. Renderizar Perfil Corporativo del Activo
    const infoContainer = document.getElementById('symbol-info-container');
    if (infoContainer) {
        infoContainer.innerHTML = '';
        const infoScript = document.createElement('script');
        infoScript.type = 'text/javascript';
        infoScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js';
        infoScript.async = true;
        infoScript.innerHTML = JSON.stringify({
            "symbol": symbol,
            "width": "100%",
            "height": "100%",
            "colorTheme": "dark",
            "isTransparent": true,
            "locale": "es"
        });
        infoContainer.appendChild(infoScript);
    }

    switchView('terminal');
}

// ==========================================
// 6. NAVEGACIÓN ENTRE VISTAS
// ==========================================
function switchView(viewName) {
    const viewOverview = document.getElementById('view-overview');
    const viewTerminal = document.getElementById('view-terminal');

    if (viewName === 'overview') {
        if (viewOverview) viewOverview.classList.add('active');
        if (viewTerminal) viewTerminal.classList.remove('active');
        
        // Sincronizar estado visual activo en el menú lateral de forma genérica
        document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
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
}

function renderAssetList(categoryKey) {
    const container = document.getElementById('asset-list');
    const titleContainer = document.getElementById('asset-list-title');
    
    if (!container) return;
    container.innerHTML = '';

    const titles = {
        overview: "Índices Globales",
        spain: "Acciones Continuo",
        europe: "EuroZone Blue Chips",
        america: "Wall Street List"
    };
    if (titleContainer) titleContainer.textContent = titles[categoryKey] || "Índices y Acciones";

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
}

// ==========================================
// 7. MANEJO DE EVENTOS SEGUROS
// ==========================================
function setupEventListeners() {
    // Clics en los botones de navegación lateral (utilizando clases y atributos nativos)
    const navButtons = document.querySelectorAll('.sidebar-nav .nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
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
        });
    });

    // Clic en el botón Volver dentro de la Terminal de Detalle (buscando por su clase o texto)
    const backBtn = document.querySelector('.terminal-actions button, #btn-back-overview');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            switchView('overview');
            renderAssetList('overview');
        });
    }

    // Vincular las 6 tarjetas de la cuadrícula principal
    const overviewCards = document.querySelectorAll('.mini-chart-card');
    overviewCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            const cardHeader = e.currentTarget.querySelector('.card-header');
            if (cardHeader) {
                const name = cardHeader.querySelector('h4').textContent.trim();
                const flag = cardHeader.querySelector('.flag').textContent.trim();
                
                const assetMatch = marketData.overview.find(item => item.name === name);
                if (assetMatch) {
                    updateTerminalAsset(assetMatch.symbol, assetMatch.name, assetMatch.flag);
                }
            }
        });
    });
}
