/**
 * BolsaVision - Lógica de Control de Widgets y Datos de Mercado
 * Versión 2026 - Corregida y Optimizada
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
    initClocks();
    renderAssetList('overview'); // Carga la lista lateral inicial
    setupEventListeners();
    
    // Dejamos una pequeña pausa de 300ms para asegurar que tv.js en diferido se ha cargado en el navegador
    setTimeout(() => {
        initGlobalWidgets();
    }, 3000);
});

// ==========================================
// 3. CONTROL DE RELOJES MUNDIALES
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
                // Generar hora en formato string
                const timeString = now.toLocaleTimeString('es-ES', {
                    timeZone: clock.zone,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
                container.querySelector('.clock-time').textContent = timeString;

                // Extraer hora numérica decimal local de esa zona para saber si el mercado está abierto
                const localDateStr = now.toLocaleString('en-US', { timeZone: clock.zone });
                const localDate = new Date(localDateStr);
                const day = localDate.getDay();
                const hours = localDate.getHours() + (localDate.getMinutes() / 60);

                const dot = container.querySelector('.status-dot');
                // Abierto de Lunes a Viernes (1-5) dentro del horario comercial
                if (day >= 1 && day <= 5 && hours >= clock.openHour && hours <= clock.closeHour) {
                    dot.classList.add('open');
                } else {
                    dot.classList.remove('open');
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
        console.error("La librería de TradingView no se ha cargado correctamente.");
        return;
    }

    try {
        // Ticker Tape (Cinta superior corrediza)
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

        // Inyección nativa y segura para los 6 minigráficos de la cuadrícula principal
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
                container.innerHTML = ''; // Limpiamos contenedor
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

        // Noticias del mercado en tiempo real
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

        // Calendario Económico mundial
        new TradingView.widget({
            "container_id": "economic-calendar-container",
            "colorTheme": "dark",
            "isTransparent": true,
            "width": "100%",
            "height": "100%",
            "locale": "es",
            "importanceFilter": "-1,0,1"
        });

    } catch (e) {
        console.error("Error cargando los widgets globales:", e);
    }
}

// ==========================================
// 5. CAMBIO DINÁMICO DE ACTIVOS (TERMINAL DE DETALLE)
// ==========================================
function updateTerminalAsset(symbol, name, flag) {
    try {
        // 1. Modificar textos de la cabecera de la terminal
        document.getElementById('active-symbol-flag').textContent = flag;
        document.getElementById('active-symbol-title').textContent = name;
        document.getElementById('active-symbol-ticker').textContent = symbol;

        // 2. Gráfico Avanzado interactivo principal
        document.getElementById('tradingview_chart').innerHTML = '<div id="tradingview_chart_real"></div>';
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
            "container_id": "tradingview_chart_real",
            "studies": [
                "RSI@tv-basicstudies",
                "MASimple@tv-basicstudies"
            ]
        });

        // 3. Widget del Reloj Técnico (Gauge)
        const gaugeContainer = document.getElementById('technical-analysis-container');
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

        // 4. Perfil e Información de la Empresa
        const infoContainer = document.getElementById('symbol-info-container');
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

        // 5. Ejecutar la transición visual de la vista
        switchView('terminal');
    } catch (err) {
        console.error("Error al actualizar la terminal:", err);
    }
}

// ==========================================
// 6. ENRUTADO Y NAVEGACIÓN INTERNA (VISTAS)
// ==========================================
function switchView(viewName) {
    const viewOverview = document.getElementById('view-overview');
    const viewTerminal = document.getElementById('view-terminal');

    if (viewName === 'overview') {
        viewOverview.classList.add('active');
        viewTerminal.classList.remove('active');
        document.querySelectorAll('.sidebar-nav .nav-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('btn-overview').classList.add('active');
    } else if (viewName === 'terminal') {
        viewOverview.classList.remove('active');
        viewTerminal.classList.add('active');
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
    titleContainer.textContent = titles[categoryKey] || "Índices y Acciones";

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
// 7. MANEJO DE EVENTOS (LISTENERS)
// ==========================================
function setupEventListeners() {
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

    const backBtn = document.getElementById('btn-back-overview');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            switchView('overview');
            renderAssetList('overview');
        });
    }

    const overviewCards = document.querySelectorAll('.mini-chart-card');
    overviewCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            const cardHeader = e.currentTarget.querySelector('.card-header');
            const name = cardHeader.querySelector('h4').textContent;
            const flag = cardHeader.querySelector('.flag').textContent;
            
            const assetMatch = marketData.overview.find(item => item.name === name);
            if (assetMatch) {
                updateTerminalAsset(assetMatch.symbol, assetMatch.name, assetMatch.flag);
            }
        });
    });
}
