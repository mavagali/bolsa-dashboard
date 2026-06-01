/**
 * BolsaVision - Lógica de Control de Widgets y Datos de Mercado
 * Versión 2026 - REPARADA, OPTIMIZADA Y 100% FUNCIONAL
 */

const marketData = {
    overview: [
        { symbol: "TVC:IBEX35", name: "IBEX 35", flag: "🇪🇸" },
        { symbol: "TVC:SX5E", name: "EURO STOXX 50", flag: "🇪🇺" },
        { symbol: "TVC:DAX", name: "DAX 40", flag: "🇩🇪" },
        { symbol: "FOREXCOM:SPXUSD", name: "S&P 500", flag: "🇺🇸" },
        { symbol: "FOREXCOM:NSXUSD", name: "NASDAQ 100", flag: "🇺🇸" }
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
        { symbol: "XMIL:RACE", name: "Ferrari NV", flag: "🇮🇹" },
        { symbol: "EURONEXT:MC", name: "LVMH", flag: "🇫🇷" },
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

let clockIntervalId = null;

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

window.addEventListener('beforeunload', () => {
    if (clockIntervalId) {
        clearInterval(clockIntervalId);
    }
});

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
                    console.warn(`Error actualizando hora ${clock.id}:`, error);
                }
            }

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
                    console.warn(`Error calculando estado ${clock.id}:`, error);
                }
            }
        });
    }

    updateTimes();
    clockIntervalId = setInterval(updateTimes, 1000);
}

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
        script.innerHTML = JSON.stringify(settings);

        script.onerror = () => {
            console.error(`❌ Error cargando widget: ${srcScript}`);
        };

        widgetContainer.appendChild(widgetLib);
        widgetContainer.appendChild(script);
        container.appendChild(widgetContainer);

    } catch (error) {
        console.error(`❌ Error en widget ${containerId}:`, error);
    }
}

function initGlobalWidgets() {
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

    const miniCharts = [
        { id: "mini-ibex", symbol: "TVC:IBEX35", title: "IBEX 35" },
        { id: "mini-stoxx", symbol: "TVC:SX5E", title: "EURO STOXX 50" },
        { id: "mini-dax", symbol: "TVC:DAX", title: "DAX 40" },
        { id: "mini-spx", symbol: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { id: "mini-nasdaq", symbol: "FOREXCOM:NSXUSD", title: "NASDAQ 100" }
    ];

    miniCharts.forEach(chart => {
        loadTradingViewWidget(chart.id, "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js", {
            "symbol": chart.symbol,
            "width": "100%",
            "height": "100%",
            "locale": "es",
            "colorTheme": "dark",
            "isTransparent": true
        });
    });

    loadTradingViewWidget("news-timeline-container", "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js", {
        "feedMode": "all_symbols",
        "colorTheme": "dark",
        "isTransparent": true,
        "displayMode": "regular",
        "width": "100%",
        "height": "100%",
        "locale": "es"
    });

    loadTradingViewWidget("economic-calendar-container", "https://s3.tradingview.com/external-embedding/embed-widget-events.js", {
        "colorTheme": "dark",
        "isTransparent": true,
        "width": "100%",
        "height": "100%",
        "locale": "es",
        "importanceFilter": "-1,0,1"
    });

    console.log('✅ Widgets cargados');
}

function updateTerminalAsset(symbol, name, flag) {
    try {
        const flagEl = document.getElementById('active-symbol-flag');
        const titleEl = document.getElementById('active-symbol-title');
        const tickerEl = document.getElementById('active-symbol-ticker');

        if (flagEl) flagEl.textContent = flag;
        if (titleEl) titleEl.textContent = name;
        if (tickerEl) tickerEl.textContent = symbol;

        const chartBox = document.getElementById('tradingview_chart');
        if (chartBox) {
            chartBox.innerHTML = '<div id="tradingview_chart_real" style="width:100%; height:100%;"></div>';
            
            let attempts = 0;
            const maxAttempts = 50;
            
            const checkTV = setInterval(() => {
                if (typeof window.TradingView !== 'undefined' && typeof window.TradingView.widget === 'function') {
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
                        console.log(`✅ Gráfico: ${symbol}`);
                    } catch (error) {
                        console.error('❌ Error TradingView:', error);
                    }
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkTV);
                    console.warn('⚠️ TradingView no disponible');
                }
                attempts++;
            }, 100);
        }

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

        loadTradingViewWidget("symbol-info-container", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js", {
            "symbol": symbol,
            "width": "100%",
            "height": "100%",
            "colorTheme": "dark",
            "isTransparent": true,
            "locale": "es"
        });

        switchView('terminal');
        console.log(`✅ Terminal: ${symbol}`);

    } catch (error) {
        console.error('❌ Error terminal:', error);
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
        console.error('❌ Error cambio vista:', error);
    }
}

function renderAssetList(categoryKey) {
    try {
        const container = document.getElementById('asset-list');
        const titleContainer = document.getElementById('asset-list-title');
        
        if (!container) {
            console.warn(`⚠️ No encontrado: asset-list`);
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

        console.log(`✅ Lista: ${categoryKey} (${assets.length} activos)`);

    } catch (error) {
        console.error('❌ Error lista:', error);
    }
}

function findAssetByName(assetName) {
    // Normalizar la búsqueda: eliminar espacios extra y convertir a minúsculas
    const normalizedSearch = assetName.trim().toLowerCase();
    
    console.log(`🔍 Buscando activo: "${assetName}" (normalizado: "${normalizedSearch}")`);
    
    for (const category in marketData) {
        const asset = marketData[category].find(item => 
            item.name.trim().toLowerCase() === normalizedSearch
        );
        if (asset) {
            console.log(`✅ Activo encontrado en ${category}: ${asset.name} (${asset.symbol})`);
            return asset;
        }
    }
    
    console.warn(`⚠️ Activo NO encontrado: "${assetName}". Imprimiendo disponibles:`);
    console.table(marketData);
    return null;
}

function setupEventListeners() {
    try {
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
                    console.error('Error navegación:', error);
                }
            });
        });

        const backBtn = document.getElementById('btn-back-overview');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                try {
                    switchView('overview');
                    renderAssetList('overview');
                } catch (error) {
                    console.error('Error retorno:', error);
                }
            });
        }

        const overviewCards = document.querySelectorAll('.mini-chart-card');
        overviewCards.forEach(card => {
            card.addEventListener('click', (e) => {
                try {
                    const cardHeader = e.currentTarget.querySelector('.card-header');
                    if (cardHeader) {
                        const heading = cardHeader.querySelector('h4');
                        if (heading) {
                            const name = heading.textContent;
                            console.log(`📌 Tarjeta clickeada. Texto extraído: "${name}" (length: ${name.length})`);
                            
                            const assetMatch = findAssetByName(name);
                            if (assetMatch) {
                                console.log(`📊 Cargando: ${assetMatch.symbol}`);
                                updateTerminalAsset(assetMatch.symbol, assetMatch.name, assetMatch.flag);
                            } else {
                                console.error(`❌ No se encontró activo para: "${name}"`);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error tarjeta:', error);
                }
            });
        });

        console.log('✅ Listeners configurados');

    } catch (error) {
        console.error('❌ Error listeners:', error);
    }
}
