/**
 * BolsaVision - Lógica de Control de Widgets y Datos de Mercado
 * Versión 2026 - Corrección Nativa y Estable
 */

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

// Arrancar la aplicación de manera segura
document.addEventListener("DOMContentLoaded", () => {
    initClocks();
    renderAssetList('overview');
    setupEventListeners();
    
    // Esperamos 1 segundo para asegurar que la librería externa de TradingView está lista en el navegador
    setTimeout(() => {
        if (typeof TradingView !== 'undefined') {
            initGlobalWidgets();
        } else {
            console.error("La librería de TradingView no se ha descargado a tiempo.");
        }
    }, 1000);
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

                    // Abierto de lunes (1) a viernes (5) en sus horas de mercado
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
// CARGA DE WIDGETS CON EL MÉTODO OFICIAL
// ==========================================
function initGlobalWidgets() {
    // 1. Ticker Tape (Cinta superior corrediza)
    if (document.getElementById("tradingview-ticker-tape")) {
        new TradingView.widget({
            "container_id": "tradingview-ticker-tape",
            "symbols": [
                { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
                { "proName": "FOREXCOM:NSXUSD", "title": "Nasdaq 100" },
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

    // 2. Gráficos de la cuadrícula general (Usamos el widget estándar adaptado a miniatura)
    const miniCharts = [
        { id: 'mini-ibex', symbol: 'TVC:IBEX35' },
        { id: 'mini-stoxx', symbol: 'INDEX:SX5E' },
        { id: 'mini-dax', symbol: 'XETR:DAX' },
        { id: 'mini-spx', symbol: 'SP:SPX' },
        { id: 'mini-nasdaq', symbol: 'NASDAQ:IXIC' },
        { id: 'mini-ftse', symbol: 'INDEX:UKX' }
    ];

    miniCharts.forEach(chart => {
        if (document.getElementById(chart.id)) {
            new TradingView.widget({
                "autosize": true,
                "symbol": chart.symbol,
                "interval": "D",
                "timezone": "Europe/Madrid",
                "theme": "dark",
                "style": "3", // Estilo de área/línea limpia
                "locale": "es",
                "container_id": chart.id,
                "hide_top_toolbar": true,
                "hide_legend": true,
                "disabled_features": ["header_widget", "left_toolbar", "timeframes_filter", "volume_force_overlay"]
            });
        }
    });

    // 3. Noticias de mercados
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

    // 4. Calendario Económico
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
}

// ==========================================
// VISTA DETALLADA DE UN ACTIVO (TERMINAL)
// ==========================================
function updateTerminalAsset(symbol, name, flag) {
    document.getElementById('active-symbol-flag').textContent = flag;
    document.getElementById('active-symbol-title').textContent = name;
    document.getElementById('active-symbol-ticker').textContent = symbol;

    // Gráfico Avanzado interactivo completo
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

    // Nota: El gauge y el profile usan scripts de widgets que TradingView requiere embebidos.
    // Para evitar que fallen al recargar, los inyectamos de forma limpia y controlada con iframes seguros.
    const gaugeContainer = document.getElementById('technical-analysis-container');
    if (gaugeContainer) {
        gaugeContainer.innerHTML = `<iframe src="https://s3.tradingview.com/embed-widget/technical-analysis/?locale=es&style=dark&symbol=${encodeURIComponent(symbol)}" style="width:100%; height:100%; border:none;"></iframe>`;
    }

    const infoContainer = document.getElementById('symbol-info-container');
    if (infoContainer) {
        infoContainer.innerHTML = `<iframe src="https://s3.tradingview.com/embed-widget/symbol-profile/?locale=es&style=dark&symbol=${encodeURIComponent(symbol)}" style="width:100%; height:100%; border:none;"></iframe>`;
    }

    switchView('terminal');
}

function switchView(viewName) {
    const viewOverview = document.getElementById('view-overview');
    const viewTerminal = document.getElementById('view-terminal');

    if (viewName === 'overview') {
        viewOverview.classList.add('active');
        viewTerminal.classList.remove('active');
        document.querySelectorAll('.sidebar-nav .nav-btn').forEach(btn => {
            if (btn.getAttribute('data-view') === 'overview') btn.classList.add('active');
            else btn.classList.remove('active');
        });
    } else {
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
    if (titleContainer) titleContainer.textContent = titles[categoryKey];

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
        item.addEventListener('click', () => updateTerminalAsset(asset.symbol, asset.name, asset.flag));
        container.appendChild(item);
    });
}

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
        card.addEventListener('click', (e) => {
            const cardHeader = e.currentTarget.querySelector('.card-header');
            if (cardHeader) {
                const name = cardHeader.querySelector('h4').textContent.trim();
                const assetMatch = marketData.overview.find(item => item.name === name);
                if (assetMatch) updateTerminalAsset(assetMatch.symbol, assetMatch.name, assetMatch.flag);
            }
        });
    });
}// ==========================================
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
