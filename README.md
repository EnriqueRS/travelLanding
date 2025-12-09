# Travel Landing Page

A modern and customizable web page for displaying travel itineraries, built with modern web technologies. Perfect for travel bloggers, agencies, or anyone who wants to share their next adventure in a visual and attractive way.

## 🚀 Technologies Used

- **Astro**: Modern framework for building fast and optimized websites
- **React**: For interactive components (maps, charts, carousels)
- **Tailwind CSS**: Utility-first CSS framework for responsive styles
- **TypeScript**: Static typing for greater robustness
- **Leaflet**: Interactive maps with markers
- **ApexCharts/Recharts**: Charts for data visualization
- **Material-UI**: Additional UI components
- **Unsplash API**: For automatically obtaining city images

## 📋 What Does It Offer?

This application provides a complete experience for displaying travel information:

- **Step-by-step itinerary** with background images for each city
- **Detailed flight information** with segments and connections
- **Interactive map** with routes and hotel markers
- **Expense management** with pie charts and breakdowns
- **Countdown** to departure date
- **City carousel** with dynamic images
- **Dark/light theme** adaptable
- **Fully customizable** through JSON configuration

## 🛠️ Installation and Configuration

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/EnriqueRS/travelLanding
   cd travelLanding
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the project**
   - Edit `src/data/travel.config.json` with your personalized information

4. **Run in development mode**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:4321`

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 📁 Project Structure

```
/
├── public/
│   ├── _unsplash_cache/     # Unsplash images cache
│   ├── cities_images/       # Static city images
│   └── favicon.svg
├── src/
│   ├── components/          # React/Astro components
│   ├── data/
│   │   ├── travel.config.json          # Main configuration
│   ├── layouts/             # Astro layouts
│   └── pages/               # Site pages
├── astro.config.mjs         # Astro configuration
├── tailwind.config.ts       # Tailwind configuration
└── package.json
```

## ⚙️ Configuration

### `travel.config.json` File

The heart of customization is in `src/data/travel.config.json`. This file contains all the trip information:

- **site**: General configuration (logo, title, reference blog)
- **trip**: Trip start date
- **cities**: List of cities with keys and labels
- **cityImages**: Mapping of cities to background images
- **flights**: Detailed flight information
- **itinerary**: Day-by-day itinerary with activities
- **expenses**: Expense breakdown by category
- **stops**: Points on the map with coordinates

### Example File

`src/data/travel.config.json` contains a complete example with fictional data for Italy 2026. Use it as a reference to configure your own trip.

## 🖼️ Image Management

### `_unsplash_cache`

This folder automatically stores images downloaded from Unsplash for the configured cities. The system:

- Searches for high-quality images for each city
- Saves them locally to avoid repeated API calls
- Improves performance and reduces external dependencies

**Note**: Make sure you have an Unsplash API key in your `.env` file if you use this functionality.

### `cities_images`

Contains static city images used as backgrounds in the itinerary. Place PNG/JPG images of your destinations here:

- `rome.png`
- `florence.png`
- `venice.png`

These images are mapped in `cityImages` from the configuration file.

## 🎨 Customization

- **Colors**: Modify `tailwind.config.ts` to change the color palette
- **Styles**: Components use Tailwind classes, easily modifiable
- **Layout**: `src/layouts/Layout.astro` controls the general structure
- **Components**: Each section is an independent component in `src/components/`

## 🚀 Deployment

### Deployment Options

- **Vercel**: Automatic deployment from GitHub
- **Netlify**: Native Astro support
- **Docker**: Use the included `Dockerfile` for containerization
- **Node.js**: Deploy the production build on any server

### Environment Variables

Create a `.env` file for sensitive configurations:

```env
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
```

## 🤝 Contributing

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/new-functionality`)
3. Commit your changes (`git commit -am 'Add new functionality'`)
4. Push to the branch (`git push origin feature/new-functionality`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License. See the `LICENSE` file for more details.

## 🙋‍♂️ Support

If you have questions or problems:

1. Check the [Astro documentation](https://docs.astro.build)
2. Check the repository issues
3. Contact the maintainer

---

Happy travels and enjoy sharing your adventures! 🌍✈️

---

# Travel Landing Page

Una página web moderna y personalizable para mostrar itinerarios de viaje, construida con tecnologías web modernas. Perfecta para bloggers de viajes, agencias o cualquier persona que quiera compartir su próxima aventura de manera visual y atractiva.

## 🚀 Tecnologías Utilizadas

- **Astro**: Framework moderno para construir sitios web rápidos y optimizados
- **React**: Para componentes interactivos (mapas, gráficos, carruseles)
- **Tailwind CSS**: Framework CSS utility-first para estilos responsivos
- **TypeScript**: Tipado estático para mayor robustez
- **Leaflet**: Mapas interactivos con marcadores
- **ApexCharts/Recharts**: Gráficos para visualización de datos
- **Material-UI**: Componentes UI adicionales
- **Unsplash API**: Para obtener imágenes de ciudades automáticamente

## 📋 ¿Qué Ofrece?

Esta aplicación proporciona una experiencia completa para mostrar información de viajes:

- **Itinerario paso a paso** con imágenes de fondo de cada ciudad
- **Información de vuelos** detallada con segmentos y conexiones
- **Mapa interactivo** con rutas y marcadores de hoteles
- **Gestión de gastos** con gráficos circulares y desgloses
- **Cuenta atrás** hasta la fecha de salida
- **Carrusel de ciudades** con imágenes dinámicas
- **Tema oscuro/claro** adaptable
- **Completamente personalizable** a través de configuración JSON

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/EnriqueRS/travelLanding
   cd travelLanding
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura el proyecto**
   - Edita `src/data/travel.config.json` con tu información personalizada

4. **Ejecuta en modo desarrollo**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:4321`

5. **Construye para producción**
   ```bash
   npm run build
   npm run preview
   ```

## 📁 Estructura del Proyecto

```
/
├── public/
│   ├── _unsplash_cache/     # Cache de imágenes de Unsplash
│   ├── cities_images/       # Imágenes estáticas de ciudades
│   └── favicon.svg
├── src/
│   ├── components/          # Componentes React/Astro
│   ├── data/
│   │   ├── travel.config.json          # Configuración principal
│   ├── layouts/             # Layouts de Astro
│   └── pages/               # Páginas del sitio
├── astro.config.mjs         # Configuración de Astro
├── tailwind.config.ts       # Configuración de Tailwind
└── package.json
```

## ⚙️ Configuración

### Archivo `travel.config.json`

El corazón de la personalización está en `src/data/travel.config.json`. Este archivo contiene toda la información del viaje:

- **site**: Configuración general (logo, título, blog de referencia)
- **trip**: Fecha de inicio del viaje
- **cities**: Lista de ciudades con claves y etiquetas
- **cityImages**: Mapeo de ciudades a imágenes de fondo
- **flights**: Información detallada de vuelos
- **itinerary**: Itinerario día a día con actividades
- **expenses**: Desglose de gastos por categoría
- **stops**: Puntos en el mapa con coordenadas

### Archivo de Ejemplo

`src/data/travel.config.json` contiene un ejemplo completo con datos ficticios para Italia 2026. Úsalo como referencia para configurar tu propio viaje.

## 🖼️ Gestión de Imágenes

### `_unsplash_cache`

Esta carpeta almacena automáticamente imágenes descargadas de Unsplash para las ciudades configuradas. El sistema:

- Busca imágenes de alta calidad para cada ciudad
- Las guarda localmente para evitar llamadas repetidas a la API
- Mejora el rendimiento y reduce dependencias externas

**Nota**: Asegúrate de tener una clave API de Unsplash en tu archivo `.env` si usas esta funcionalidad.

### `cities_images`

Contiene imágenes estáticas de ciudades que se usan como fondo en el itinerario. Coloca aquí imágenes PNG/JPG de tus destinos:

- `rome.png`
- `florence.png`
- `venice.png`

Estas imágenes se mapean en `cityImages` del archivo de configuración.

## 🎨 Personalización

- **Colores**: Modifica `tailwind.config.ts` para cambiar la paleta de colores
- **Estilos**: Los componentes usan Tailwind classes, fácilmente modificables
- **Layout**: `src/layouts/Layout.astro` controla la estructura general
- **Componentes**: Cada sección es un componente independiente en `src/components/`

## 🚀 Despliegue

### Opciones de Despliegue

- **Vercel**: Despliegue automático desde GitHub
- **Netlify**: Soporte nativo para Astro
- **Docker**: Usa el `Dockerfile` incluido para contenedorización
- **Node.js**: Despliega el build de producción en cualquier servidor

### Variables de Entorno

Crea un archivo `.env` para configuraciones sensibles:

```env
UNSPLASH_ACCESS_KEY=tu_clave_api_unsplash
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙋‍♂️ Soporte

Si tienes preguntas o problemas:

1. Revisa la documentación de [Astro](https://docs.astro.build)
2. Consulta los issues del repositorio
3. Contacta al maintainer

---

¡Feliz viaje y que disfrutes compartiendo tus aventuras! 🌍✈️
