/* ==========================================================================
   BOLSA VISION - CORE APP LOGIC
   ========================================================================== */

// 1. DATABASE: STOCK INDICES & KEY EQUITIES
const MARKET_DATA = {
    spain: {
        title: "Bolsa Española",
        flag: "🇪🇸",
        items: [
            { symbol: "TVC:IBEX35", name: "IBEX 35", desc: "Índice de referencia nacional (España)" },
            { symbol: "BME:SAN", name: "Banco Santander", desc: "Grupo financiero diversificado" },
            { symbol: "BME:BBVA", name: "BBVA", desc: "Servicios financieros internacionales" },
            { symbol: "BME:IBE", name: "Iberdrola", desc: "Líder energético renovable" },
            { symbol: "BME:ITX", name: "Inditex", desc: "Grupo multinacional de distribución de moda" },
            { symbol: "BME:TEF", name: "Telefónica", desc: "Compañía global de telecomunicaciones" }
        ]
    },
    europe: {
        title: "Bolsas Europeas",
        flag: "🇪🇺",
        items: [
            { symbol: "TVC:SX5E", name: "EURO STOXX 50", desc: "50 mayores blue-chips de la Eurozona" },
            { symbol: "TVC:DEU40", name: "DAX 40", desc: "Índice principal alemán (Frankfurt)" },
            { symbol: "TVC:PX1", name: "CAC 40", desc: "Índice principal francés (París)" },
            { symbol: "TVC:UK100", name: "FTSE 100", desc: "Índice principal británico (Londres)" },
            { symbol: "TVC:FTSEMIB", name: "FTSE MIB", desc: "Índice de referencia italiano (Milán)" }
        ]
    },
    america: {
        title: "Bolsas Americanas",
        flag: "🇺🇸",
        items: [
            { symbol: "TVC:SPX", name: "S&P 500", desc: "500 mayores empresas de EE. UU. (Wall Street)" },
            { symbol: "TVC:IXIC", name: "NASDAQ Composite", desc: "Índice del mercado tecnológico (EE. UU.)" },
            { symbol: "TVC:DJI", name: "Dow Jones Industrial", desc: "30 principales empresas industriales de EE. UU." },
            { symbol: "TVC:RUT", name: "Russell 2000", desc: "Índice de pequeña capitalización de EE. UU." }
        ]
    }
};

// 2. ACTIVE SYSTEM STATE
let currentView = "overview"; // 'overview' | 'terminal'
let activeCategory = "spain"; 
let activeSymbol = "TVC:IBEX35";
let activeName = "IBEX 35";
let activeFlag = "🇪🇸";

// 3. CORE INIT FUNCTION
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    // Setup Clocks (run immediately and then every second)
    updateClocks();
    setInterval(updateClocks, 1000);

    // Load static global widgets (Ticker Tape, Overview Mini-charts, News and Calendar)
    loadTickerTape();
    loadOverviewGridWidgets();
    loadOverviewWidgets();

    // Render initial sidebar (all combined index overview list)
    renderSidebarList("overview");

    // Setup navigation event listeners
    setupEventListeners();
}

// 4. EVENT LISTENERS SETUP
function setupEventListeners() {
    // Navigation Tabs
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetView = btn.getAttribute("data-view");
            
            // Remove active classes
            navButtons.forEach(b => b.classList.remove("active"));
            
            if (targetView === "overview") {
                btn.classList.add("active");
                switchToOverview();
            } else {
                btn.classList.add("active");
                // Load default symbol for each category
                const defaultSymbolMap = {
                    spain: { sym: "TVC:IBEX35", name: "IBEX 35", flag: "🇪🇸" },
                    europe: { sym: "TVC:SX5E", name: "EURO STOXX 50", flag: "🇪🇺" },
                    america: { sym: "TVC:SPX", name: "S&P 500", flag: "🇺🇸" }
                };
                
                const selectInfo = defaultSymbolMap[targetView];
                activeCategory = targetView;
                switchToTerminal(selectInfo.sym, selectInfo.name, selectInfo.flag);
            }
        });
    });

    // Back to Overview Button in Terminal Header
    document.getElementById("btn-back-overview").addEventListener("click", () => {
        // Toggle active button in sidebar
        document.querySelectorAll(".nav-btn").forEach(btn => {
            btn.classList.remove("active");
        });
        document.getElementById("btn-overview").classList.add("active");
        switchToOverview();
    });

    // Make Overview Cards Clickable to Load detailed chart
    const overviewGridCards = document.querySelectorAll(".mini-chart-card");
    const overviewSymMap = [
        { id: "mini-ibex", sym: "TVC:IBEX35", name: "IBEX 35", flag: "🇪🇸", cat: "spain" },
        { id: "mini-stoxx", sym: "TVC:SX5E", name: "EURO STOXX 50", flag: "🇪🇺", cat: "europe" },
        { id: "mini-dax", sym: "TVC:DEU40", name: "DAX 40", flag: "🇩🇪", cat: "europe" },
        { id: "mini-spx", sym: "TVC:SPX", name: "S&P 500", flag: "🇺🇸", cat: "america" },
        { id: "mini-nasdaq", sym: "TVC:IXIC", name: "NASDAQ Composite", flag: "🇺🇸", cat: "america" },
        { id: "mini-ftse", sym: "TVC:UK100", name: "FTSE 100", flag: "🇬🇧", cat: "europe" }
    ];

    overviewGridCards.forEach((card, index) => {
        card.addEventListener("click", () => {
            const symInfo = overviewSymMap[index];
            activeCategory = symInfo.cat;
            
            // Set matching sidebar category as active
            document.querySelectorAll(".nav-btn").forEach(btn => {
                btn.classList.remove("active");
                if (btn.getAttribute("data-view") === symInfo.cat) {
                    btn.classList.add("active");
                }
            });

            switchToTerminal(symInfo.sym, symInfo.name, symInfo.flag);
        });
    });
}

// 5. VIEW SWITCHING ROUTING
function switchToOverview() {
    currentView = "overview";
    
    // Toggle DOM panels
    document.getElementById("view-overview").classList.add("active");
    document.getElementById("view-terminal").classList.remove("active");
    
    // Refresh Sidebar title & list
    document.getElementById("asset-list-title").textContent = "Índices Principales";
    renderSidebarList("overview");
}

function switchToTerminal(symbol, name, flag) {
    currentView = "terminal";
    activeSymbol = symbol;
    activeName = name;
    activeFlag = flag;

    // Toggle DOM panels
    document.getElementById("view-overview").classList.remove("active");
    document.getElementById("view-terminal").classList.add("active");

    // Update Terminal Header Details
    document.getElementById("active-symbol-flag").textContent = flag;
    document.getElementById("active-symbol-title").textContent = name;
    document.getElementById("active-symbol-ticker").textContent = symbol;

    // Render sidebar specifically filtered
    document.getElementById("asset-list-title").textContent = MARKET_DATA[activeCategory].title;
    renderSidebarList(activeCategory);

    // Load Widgets for this symbol
    loadDetailedTerminalWidgets(symbol);
}

// 6. SIDEBAR POPULATOR
function renderSidebarList(category) {
    const listContainer = document.getElementById("asset-list");
    listContainer.innerHTML = ""; // Clear list

    let listItems = [];

    if (category === "overview") {
        // Combined key index items
        listItems = [
            { symbol: "TVC:IBEX35", name: "IBEX 35", flag: "🇪🇸", desc: "Bolsa de Madrid", cat: "spain" },
            { symbol: "TVC:SX5E", name: "EURO STOXX 50", flag: "🇪🇺", desc: "Eurozona", cat: "europe" },
            { symbol: "TVC:DEU40", name: "DAX 40", flag: "🇩🇪", desc: "Bolsa de Frankfurt", cat: "europe" },
            { symbol: "TVC:PX1", name: "CAC 40", flag: "🇫🇷", desc: "Bolsa de París", cat: "europe" },
            { symbol: "TVC:UK100", name: "FTSE 100", flag: "🇬🇧", desc: "Bolsa de Londres", cat: "europe" },
            { symbol: "TVC:SPX", name: "S&P 500", flag: "🇺🇸", desc: "Wall Street Index", cat: "america" },
            { symbol: "TVC:IXIC", name: "NASDAQ Composite", flag: "🇺🇸", desc: "US Tech Index", cat: "america" },
            { symbol: "TVC:DJI", name: "Dow Jones 30", flag: "🇺🇸", desc: "US Blue-chips", cat: "america" }
        ];
    } else {
        // Items from the specific category list
        const flag = MARKET_DATA[category].flag;
        listItems = MARKET_DATA[category].items.map(item => ({
            ...item,
            flag: flag,
            cat: category
        }));
    }

    listItems.forEach(item => {
        const itemEl = document.createElement("button");
        itemEl.className = "asset-item";
        if (currentView === "terminal" && item.symbol === activeSymbol) {
            itemEl.classList.add("active");
        }

        itemEl.innerHTML = `
            <div class="asset-item-header">
                <span class="asset-name">${item.flag} ${item.name}</span>
                <span class="asset-symbol">${item.symbol.split(':')[1] || item.symbol}</span>
            </div>
            <div class="asset-desc">${item.desc}</div>
        `;

        itemEl.addEventListener("click", () => {
            activeCategory = item.cat;
            
            // Set active category tab state
            document.querySelectorAll(".nav-btn").forEach(btn => {
                btn.classList.remove("active");
                if (btn.getAttribute("data-view") === item.cat) {
                    btn.classList.add("active");
                }
            });

            // If switching from overview, toggle layout
            if (currentView === "overview") {
                switchToTerminal(item.symbol, item.name, item.flag);
            } else {
                // Update terminal details
                activeSymbol = item.symbol;
                activeName = item.name;
                activeFlag = item.flag;
                
                document.getElementById("active-symbol-flag").textContent = item.flag;
                document.getElementById("active-symbol-title").textContent = item.name;
                document.getElementById("active-symbol-ticker").textContent = item.symbol;
                
                // Set active item state in sidebar
                document.querySelectorAll(".asset-item").forEach(el => el.classList.remove("active"));
                itemEl.classList.add("active");
                
                loadDetailedTerminalWidgets(item.symbol);
            }
        });

        listContainer.appendChild(itemEl);
    });
}

// 7. WIDGET INJECTOR PATTERN
function injectWidgetScript(containerId, scriptSrc, config) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = ''; // Clear prior content
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptSrc;
    script.async = true;
    script.innerHTML = JSON.stringify(config);
    container.appendChild(script);
}

// 8. SPECIFIC WIDGETS RENDERING
function loadTickerTape() {
    injectWidgetScript("tradingview-ticker-tape", "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js", {
        "symbols": [
            { "proName": "TVC:IBEX35", "title": "IBEX 35" },
            { "proName": "TVC:SX5E", "title": "Euro Stoxx 50" },
            { "proName": "TVC:DEU40", "title": "DAX 40" },
            { "proName": "TVC:PX1", "title": "CAC 40" },
            { "proName": "TVC:UK100", "title": "FTSE 100" },
            { "proName": "TVC:SPX", "title": "S&P 500" },
            { "proName": "TVC:IXIC", "title": "NASDAQ" },
            { "proName": "TVC:DJI", "title": "Dow Jones" },
            { "proName": "BME:SAN", "title": "Santander" },
            { "proName": "BME:IBE", "title": "Iberdrola" }
        ],
        "showSymbolLogo": true,
        "colorTheme": "dark",
        "isTransparent": true,
        "displayMode": "adaptive",
        "locale": "es"
    });
}

function loadOverviewGridWidgets() {
    const miniCharts = [
        { id: "mini-ibex", symbol: "TVC:IBEX35" },
        { id: "mini-stoxx", symbol: "TVC:SX5E" },
        { id: "mini-dax", symbol: "TVC:DEU40" },
        { id: "mini-spx", symbol: "TVC:SPX" },
        { id: "mini-nasdaq", symbol: "TVC:IXIC" },
        { id: "mini-ftse", symbol: "TVC:UK100" }
    ];

    miniCharts.forEach(chart => {
        injectWidgetScript(chart.id, "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js", {
            "symbol": chart.symbol,
            "width": "100%",
            "height": "100%",
            "locale": "es",
            "dateRange": "12M",
            "colorTheme": "dark",
            "isTransparent": true,
            "autosize": true,
            "largeChartUrl": ""
        });
    });
}

function loadOverviewWidgets() {
    // News Timeline Feed
    injectWidgetScript("news-timeline-container", "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js", {
        "feedMode": "all_symbols",
        "colorTheme": "dark",
        "isTransparent": true,
        "displayMode": "regular",
        "width": "100%",
        "height": "100%",
        "locale": "es"
    });

    // Economic Calendar Events
    injectWidgetScript("economic-calendar-container", "https://s3.tradingview.com/external-embedding/embed-widget-events.js", {
        "colorTheme": "dark",
        "isTransparent": true,
        "width": "100%",
        "height": "100%",
        "locale": "es",
        "importanceFilter": "-1,0,1"
    });
}

function loadDetailedTerminalWidgets(symbol) {
    // 1. Render main Advanced Interactive Chart (using tv.js constructor)
    renderAdvancedChart(symbol);

    // 2. Render Technical Analysis Gauge
    injectWidgetScript("technical-analysis-container", "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js", {
        "interval": "1D",
        "width": "100%",
        "isTransparent": true,
        "height": "100%",
        "symbol": symbol,
        "showIntervalTabs": true,
        "displayMode": "single",
        "locale": "es",
        "colorTheme": "dark"
    });

    // 3. Render Symbol Profile Information Widget
    injectWidgetScript("symbol-info-container", "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js", {
        "symbol": symbol,
        "width": "100%",
        "height": "100%",
        "locale": "es",
        "colorTheme": "dark",
        "isTransparent": true
    });
}

function renderAdvancedChart(symbol) {
    if (typeof TradingView !== 'undefined') {
        new TradingView.widget({
            "width": "100%",
            "height": "100%",
            "symbol": symbol,
            "interval": "D",
            "timezone": "Europe/Madrid",
            "theme": "dark",
            "style": "1",
            "locale": "es",
            "toolbar_bg": "#0c0f1d",
            "enable_publishing": false,
            "hide_side_toolbar": false,
            "allow_symbol_change": true,
            "container_id": "tradingview_chart"
        });
    } else {
        // Retry shortly if tv.js script hasn't initialized fully
        setTimeout(() => renderAdvancedChart(symbol), 100);
    }
}

// 9. REAL-TIME MARKET CLOCKS & STATE MANAGEMENT
function updateClocks() {
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

    // Clocks
    const clocks = [
        { id: "clock-madrid", timeZone: "Europe/Madrid", type: "madrid" },
        { id: "clock-london", timeZone: "Europe/London", type: "london" },
        { id: "clock-newyork", timeZone: "America/New_York", type: "newyork" }
    ];

    clocks.forEach(clock => {
        const container = document.getElementById(clock.id);
        if (!container) return;

        // Render current local time
        const timeStr = new Date().toLocaleTimeString('es-ES', { ...timeOptions, timeZone: clock.timeZone });
        container.querySelector(".clock-time").textContent = timeStr;

        // Determine Market Open Status
        const open = isMarketOpen(clock.timeZone, clock.type);
        const dot = container.querySelector(".status-dot");
        
        if (open) {
            dot.className = "status-dot open";
        } else {
            dot.className = "status-dot closed";
        }
    });
}

function isMarketOpen(timeZone, marketType) {
    const localDate = new Date(new Date().toLocaleString('en-US', { timeZone }));
    const day = localDate.getDay();
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();

    // Weekend Check (0 = Sunday, 6 = Saturday)
    if (day === 0 || day === 6) {
        return false;
    }

    if (marketType === "madrid") {
        // IBEX trading: Monday - Friday, 09:00 - 17:30 CET
        return (hours === 9 && minutes >= 0) || (hours > 9 && hours < 17) || (hours === 17 && minutes <= 30);
    } 
    else if (marketType === "london") {
        // LSE trading: Monday - Friday, 08:00 - 16:30 GMT/BST
        return (hours === 8 && minutes >= 0) || (hours > 8 && hours < 16) || (hours === 16 && minutes <= 30);
    } 
    else if (marketType === "newyork") {
        // NYSE/Nasdaq trading: Monday - Friday, 09:30 - 16:00 EST/EDT
        return (hours === 9 && minutes >= 30) || (hours > 9 && hours < 16);
    }

    return false;
}
