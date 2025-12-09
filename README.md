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
   cd hilarious-horizon
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura el proyecto**
   - Copia el archivo de ejemplo de configuración:
     ```bash
     cp src/data/travel.config.example.json src/data/travel.config.json
     ```
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
│   │   └── travel.config.example.json  # Archivo de ejemplo
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

`src/data/travel.config.example.json` contiene un ejemplo completo con datos ficticios para Italia 2026. Úsalo como referencia para configurar tu propio viaje.

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
