/**
 * BolsaVision - Lógica de Control de Widgets y Datos de Mercado
 * Versión 2026 - Versión Corregida de Alta Compatibilidad
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

document.addEventListener("DOMContentLoaded", () => {
    initClocks();
    renderAssetList('overview');
    setupEventListeners();
    initGlobalWidgets(); // Cargamos los componentes nativos inmediatamente
});

// ==========================================
// CONTROL DE RELOJES MUNDIALES (CON LEDS)
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
// INYECCIÓN DE COMPONENTES POR IFRAME SEGURO
// ==========================================
function initGlobalWidgets() {
    // 1. Ticker Tape (Cinta corrediza)
    const tapeContainer = document.getElementById("tradingview-ticker-tape");
    if (tapeContainer) {
        tapeContainer.innerHTML = `<iframe src="https://s3.tradingview.com/embed-widget/ticker-tape/?locale=es&theme=dark&symbols=%5B%7B%22proName%22%3A%22FOREXCOM%3ASPXUSD%22%2C%22title%22%3A%22S%26P+500%22%7D%2C%7B%22proName%22%3A%22FOREXCOM%3ANSXUSD%22%2C%22title%22%3A%22Nasdaq+100%22%7D%2C%7B%22proName%22%3A%22FX_IDC%3AEURUSD%22%2C%22title%22%3A%22EUR%2FUSD%22%7D%2C%7B%22proName%22%3A%22BITSTAMP%3ABTCUSD%22%2C%22title%22%3A%22Bitcoin%22%7D%5D" style="width:100%; height:100%; border:none; overflow:hidden;"></iframe>`;
    }

    // 2. Minigráficos de la cuadrícula general
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
            container.innerHTML = `<iframe src="https://s3.tradingview.com/embed-widget/mini-symbol-overview/?locale=es&theme=dark&symbol=${encodeURIComponent(chart.symbol)}&trendLineColor=%232979ff&underLineColor=rgba(41%2C+121%2C+255%2C+0.15)&underLineBottomColor=rgba(41%2C+121%2C+255%2C+0)" style="width:100%; height:100%; border:none; overflow:hidden;"></iframe>`;
        }
    });

    // 3. Noticias en tiempo real
    const newsContainer = document.getElementById("news-timeline-container");
    if (newsContainer) {
        newsContainer.innerHTML = `<iframe src="https://s3.tradingview.com/embed-widget/timeline/?locale=es&theme=dark&feedMode=all_symbols" style="width:100%; height:100%; border:none; overflow:hidden;"></iframe>`;
    }

    // 4. Calendario Económico
    const calendarContainer = document.getElementById("economic-calendar-container");
    if (calendarContainer) {
        calendarContainer.innerHTML = `<iframe src="https://s3.tradingview.com/embed-widget/events/?locale=es&theme=dark&importanceFilter=-1%2C0%2C1" style="width:100%; height:100%; border:none; overflow:hidden;"></iframe>`;
    }
}

// ==========================================
// VISTA INTERACTIVA (TERMINAL DE DETALLE)
// ==========================================
function updateTerminalAsset(symbol, name, flag) {
    document.getElementById('active-symbol-flag').textContent = flag;
    document.getElementById('active-symbol-title').textContent = name;
    document.getElementById('active-symbol-ticker').textContent = symbol;

    // Aquí sí se usa de forma segura la librería nativa de tv.js instalada en el HTML
    const chartBox = document.getElementById('tradingview_chart');
    if (chartBox) {
        chartBox.innerHTML = '<div id="tradingview_chart_real" style="width:100%; height:100%;"></div>';
        if (typeof TradingView !== 'undefined') {
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
    }

    const gaugeContainer = document.getElementById('technical-analysis-container');
    if (gaugeContainer) {
        gaugeContainer.innerHTML = `<iframe src="https://s3.tradingview.com/embed-widget/technical-analysis/?locale=es&style=dark&symbol=${encodeURIComponent(symbol)}&interval=1D" style="width:100%; height:100%; border:none; overflow:hidden;"></iframe>`;
    }

    const infoContainer = document.getElementById('symbol-info-container');
    if (infoContainer) {
        infoContainer.innerHTML = `<iframe src="https://s3.tradingview.com/embed-widget/symbol-profile/?locale=es&style=dark&symbol=${encodeURIComponent(symbol)}" style="width:100%; height:100%; border:none; overflow:hidden;"></iframe>`;
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
}
