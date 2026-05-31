# BolsaVision - Terminal de Índices Globales 📈

BolsaVision es una terminal financiera interactiva basada en web que permite realizar un seguimiento en tiempo real de los principales índices y valores de las bolsas española, europea y americana.

El proyecto está diseñado con una estética premium oscura y moderna, utilizando efectos de desenfoque de fondo (*glassmorphism*), animaciones de estado fluidas y los widgets oficiales y gratuitos de **TradingView**.

## Características principales

*   **Cinta de Ticker Dinámica:** Variaciones de precios en tiempo real recorriendo la parte superior.
*   **Relojes de Bolsa Mundiales:** Indicador de hora local para Madrid, Londres y Nueva York con estado de apertura/cierre automatizado de cada mercado.
*   **Visión General Interactiva:** Rejilla de mini-gráficos, noticias financieras en tiempo real y calendario económico mundial.
*   **Workspace de Detalle:** Gráfico interactivo avanzado con herramientas técnicas para dibujar, dial de análisis técnico (Gauge) y ficha técnica de estadísticas de cada activo.
*   **Diseño 100% Responsivo:** Adaptado a dispositivos móviles, tablets y ordenadores.

---

## Cómo abrir localmente

No necesitas instalar dependencias ni compilar nada. BolsaVision es una aplicación web estática pura.

1.  Ve a la carpeta del proyecto: `/Users/miguelangelcobasgarcia/bolsa-dashboard/`
2.  Haz doble clic en el archivo **`index.html`** para abrirlo en cualquier navegador web (Chrome, Safari, Firefox, Edge, etc.).
3.  ¡Listo! Ya puedes empezar a navegar por las diferentes pestañas y analizar el mercado.

---

## Cómo subir el proyecto a tu cuenta de GitHub y desplegar la web gratis

Para alojar esta página web en internet de forma pública e ilimitada usando **GitHub Pages**, sigue estos sencillos pasos:

### Paso 1: Crear un Repositorio en GitHub
1.  Inicia sesión en tu cuenta de [GitHub](https://github.com/).
2.  Haz clic en el botón **"New"** (Nuevo) en la sección de repositorios, o ve directamente a: [https://github.com/new](https://github.com/new).
3.  Elige un nombre para tu repositorio (por ejemplo, `bolsa-dashboard` o `mis-indices-bolsa`).
4.  Asegúrate de que la visibilidad sea **Public** (Público).
5.  **IMPORTANTE:** No marques ninguna casilla de inicialización (como *"Add a README file"*, *"Add .gitignore"* o *"Choose a license"*). Déjalas desmarcadas.
6.  Haz clic en **"Create repository"** (Crear repositorio).

### Paso 2: Vincular y Subir los Archivos desde tu Terminal
Abre la aplicación **Terminal** en tu Mac y ejecuta los siguientes comandos en orden (el repositorio ya ha sido inicializado localmente en tu ordenador por mí):

1.  Entra en la carpeta del proyecto (copia y pega esto en la Terminal):
    ```bash
    cd /Users/miguelangelcobasgarcia/bolsa-dashboard
    ```
2.  Agrega todos los archivos al repositorio:
    ```bash
    git add .
    ```
3.  Crea el primer commit (guardado de los archivos):
    ```bash
    git commit -m "Primer commit: Estructura, estilos y logica de BolsaVision"
    ```
4.  Renombra la rama principal a `main`:
    ```bash
    git branch -M main
    ```
5.  Vincula tu repositorio local con el de GitHub (reemplaza `TU_USUARIO_DE_GITHUB` y `NOMBRE_REPOSITORIO` por tus datos reales de la URL que te muestra GitHub en pantalla):
    ```bash
    git remote add origin https://github.com/TU_USUARIO_DE_GITHUB/NOMBRE_REPOSITORIO.git
    ```
6.  Sube los archivos a GitHub (es posible que te pida iniciar sesión o introducir tus credenciales/token de acceso):
    ```bash
    git push -u origin main
    ```

### Paso 3: Activar GitHub Pages
Una vez hayas subido los archivos con éxito y los veas listados en la página de tu repositorio en GitHub:

1.  En la parte superior de tu repositorio, haz clic en la pestaña **Settings** (Configuración, representada con un icono de engranaje).
2.  En el menú lateral izquierdo, haz clic en **Pages** (dentro de la sección *Code and automation*).
3.  En el apartado **Build and deployment** -> **Source**, asegúrate de que esté seleccionado **"Deploy from a branch"** (Desplegar desde una rama).
4.  En **Branch** (Rama), selecciona **`main`** en el primer desplegable, deja el segundo desplegable en `/ (root)` y haz clic en el botón **Save** (Guardar).
5.  ¡Eso es todo! En aproximadamente 1 o 2 minutos, GitHub construirá tu web. Si refrescas la página de Configuración de Pages, verás un mensaje arriba en verde diciendo algo como:
    > "Your site is live at: `https://TU_USUARIO_DE_GITHUB.github.io/NOMBRE_REPOSITORIO/`"
6.  Haz clic en ese enlace para ver y compartir tu terminal financiera en internet.

---

## Estructura del Código

*   `index.html` - Contiene la estructura y maquetación de la aplicación.
*   `styles.css` - Contiene las reglas de estilo en cascada para la interfaz de usuario con diseño moderno y soporte de animaciones.
*   `app.js` - Controla el reloj de los mercados, la navegación interactiva y la inyección inteligente de los componentes de TradingView.

*Aviso: BolsaVision está desarrollada exclusivamente con fines educativos e informativos. Los precios y cotizaciones son proporcionados de forma gratuita y directa a través de la API pública de TradingView.*
