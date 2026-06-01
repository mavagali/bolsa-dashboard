// ==========================================
// 4. CARGA DE WIDGETS GLOBALES (HOME) - FIJO
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

    // 2. Gráficos de la Cuadrícula Principal (Inyección Individual Nativa Desbloqueada)
    
    // Tarjeta IBEX 35
    loadTradingViewWidget("mini-ibex", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["BME:IBEX", "IBEX 35"]],
        "chartOnly": true, "width": "100%", "height": "100%", "locale": "es", "colorTheme": "dark", "autosize": true, "isTransparent": true, "trendLineColor": "#2979ff", "underLineColor": "rgba(41, 121, 255, 0.12)"
    });

    // Tarjeta EURO STOXX 50
    loadTradingViewWidget("mini-stoxx", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["FOREXCOM:EU50", "EURO STOXX 50"]],
        "chartOnly": true, "width": "100%", "height": "100%", "locale": "es", "colorTheme": "dark", "autosize": true, "isTransparent": true, "trendLineColor": "#2979ff", "underLineColor": "rgba(41, 121, 255, 0.12)"
    });

    // Tarjeta DAX 40
    loadTradingViewWidget("mini-dax", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["XETR:DAX", "DAX 40"]],
        "chartOnly": true, "width": "100%", "height": "100%", "locale": "es", "colorTheme": "dark", "autosize": true, "isTransparent": true, "trendLineColor": "#2979ff", "underLineColor": "rgba(41, 121, 255, 0.12)"
    });

    // Tarjeta S&P 500 (Corregido con Feed Global Libre)
    loadTradingViewWidget("mini-spx", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js", {
        "symbols": [["FOREXCOM:SPXUSD", "S&P 500"]],
        "chartOnly": true, "width": "100%", "height": "100%", "locale": "es", "colorTheme": "dark", "autosize": true, "isTransparent": true, "trendLineColor": "#2979ff", "underLineColor": "rgba(41, 121, 255, 0.12)"
    });

    // Tarjeta NASDAQ 100 (Corregido con Feed Global Libre)
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
