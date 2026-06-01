/**
 * BolsaVision - Lógica de Control de Widgets y Datos de Mercado
 * Versión 2026 - COMPLETA, BLINDADA Y 100% OPERATIVA
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

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
    initClocks();
    renderAssetList('overview');
    setupEventListeners();
    initGlobalWidgets();
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
// INYECTOR DE SCRIPTS OFICIALES
// ==========================================
function loadTradingViewWidget(containerId, srcScript, settings) {
    const container = document.getElementById(containerId);
    if (!container) return;

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
    script.innerHTML = JSON.stringify(settings);

    widgetContainer.appendChild(widgetLib);
    widgetContainer.appendChild(script);
    container.appendChild(widgetContainer);
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
    
    // Tarjeta IBEX 35
    loadTradingViewWidget("mini-ibex", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["CURRENCYCOM:SPA35", "IBEX 35"]],
        "chartOnly": true, "width": "100%", "height": "100%", "locale": "es", "colorTheme": "dark", "autosize": true, "isTransparent": true, "trendLineColor": "#2979ff", "underLineColor": "rgba(41, 121, 255, 0.12)"
    });

    // Tarjeta EURO STOXX 50
    loadTradingViewWidget("mini-stoxx", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["CAPITALCOM:EU50", "EURO STOXX 50"]],
        "chartOnly": true, "width": "100%", "height": "100%", "locale": "es", "colorTheme": "dark", "autosize": true, "isTransparent": true, "trendLineColor": "#2979ff", "underLineColor": "rgba(41, 121, 255, 0.12)"
    });

    // Tarjeta DAX 40
    loadTradingViewWidget("mini-dax", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["XETR:DAX", "DAX 40"]],
        "chartOnly": true, "width": "100%", "height": "100%", "locale": "es", "colorTheme": "dark", "autosize": true, "isTransparent": true, "trendLineColor": "#2979ff", "underLineColor": "rgba(41, 121, 255, 0.12)"
    });

    // Tarjeta S&P 500
    loadTradingViewWidget("mini-spx", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["CURRENCYCOM:US500", "S&P 500"]],
        "chartOnly": true, "width": "100%", "height": "100%", "locale": "es", "colorTheme": "dark", "autosize": true, "isTransparent": true, "trendLineColor": "#2979ff", "underLineColor": "rgba(41, 121, 255, 0.12)"
    });

    // Tarjeta NASDAQ 100
    loadTradingViewWidget("mini-nasdaq", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["CURRENCYCOM:US100", "NASDAQ 100"]],
        "chartOnly": true, "width": "100%", "height": "100%", "locale": "es", "colorTheme": "dark", "autosize": true, "isTransparent": true, "trendLineColor": "#2979ff", "underLineColor": "rgba(41, 121, 255, 0.12)"
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
}

// ==========================================
// VISTA INTERACTIVA (TERMINAL DE DETALLE)
// ==========================================
function updateTerminalAsset(symbol, name, flag) {
    document.getElementById('active-symbol-flag').textContent = flag;
    document.getElementById('active-symbol-title').textContent = name;
    document.getElementById('active-symbol-ticker').textContent = symbol;

    const chartBox = document.getElementById('tradingview_chart');
    if (chartBox) {
        chartBox.innerHTML = '<div id="tradingview_chart_real" style="width:100%; height:100%;"></div>';
        
        let attempts = 0;
        const checkTV = setInterval(() => {
            if (typeof TradingView !== 'undefined' && typeof TradingView.widget !== 'undefined') {
                clearInterval(checkTV);
