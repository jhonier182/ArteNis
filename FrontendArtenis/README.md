# Artenis Frontend - Aplicación Web Moderna

## 🎨 Descripción

Frontend de **Artenis**, la plataforma definitiva para tatuadores y amantes del arte corporal. Construido con las tecnologías más modernas y optimizado para experiencia de usuario excepcional.

## 🚀 Tecnologías

### Core Stack
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos utilitarios
- **Framer Motion** - Animaciones fluidas

### State Management & Data
- **Zustand** - Estado global ligero
- **TanStack Query** - Manejo de estado del servidor
- **Axios** - Cliente HTTP

### UI/UX
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconos consistentes
- **React Hot Toast** - Notificaciones elegantes
- **next-themes** - Soporte para modo oscuro

### Internacionalización
- **React i18next** - Soporte multiidioma (ES/EN)
- **i18next-browser-languagedetector** - Detección automática

### Multimedia & Performance
- **Sharp** - Optimización de imágenes
- **React Masonry CSS** - Grid tipo Pinterest
- **React Virtualized** - Renderizado eficiente
- **React Intersection Observer** - Lazy loading

### Testing & Quality
- **Jest** - Testing framework
- **Testing Library** - Utilities de testing
- **ESLint** - Linting
- **Prettier** - Formateo de código
- **Storybook** - Documentación de componentes

## 🏗️ Arquitectura

### Estructura de Carpetas
```
src/
├── app/                    # Next.js App Router
│   ├── globals.css         # Estilos globales
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página principal
│
├── components/             # Componentes reutilizables
│   ├── ui/                 # Componentes base (Button, Input, etc.)
│   ├── navigation/         # Navegación y menús
│   ├── providers/          # Context providers
│   └── feed/               # Componentes del feed
│
├── screens/                # Pantallas completas
│   ├── Auth/               # Login, registro
│   ├── Feed/               # Feed principal
│   ├── Profile/            # Perfiles de usuario
│   ├── AI/                 # Herramientas de IA
│   ├── Booking/            # Sistema de citas
│   └── Settings/           # Configuraciones
│
├── services/               # API calls y lógica de negocio
│   ├── api.ts              # Cliente HTTP configurado
│   ├── auth.ts             # Servicios de autenticación
│   └── posts.ts            # Servicios de publicaciones
│
├── store/                  # Estado global
│   ├── auth.ts             # Estado de autenticación
│   ├── posts.ts            # Estado de publicaciones
│   └── ui.ts               # Estado de UI
│
├── hooks/                  # Custom hooks
│   ├── useAuth.ts          # Hook de autenticación
│   ├── usePosts.ts         # Hook de publicaciones
│   └── useLocalStorage.ts  # Hook de localStorage
│
├── utils/                  # Funciones auxiliares
│   ├── cn.ts               # Utilidad para clases CSS
│   ├── i18n.ts             # Configuración de i18n
│   └── constants.ts        # Constantes de la app
│
├── types/                  # Definiciones de TypeScript
│   ├── user.ts             # Tipos de usuario
│   ├── post.ts             # Tipos de publicaciones
│   └── api.ts              # Tipos de API
│
└── assets/                 # Recursos estáticos
    ├── icons/              # Iconos personalizados
    ├── images/             # Imágenes
    └── fonts/              # Fuentes personalizadas
```

## 🎨 Diseño Visual

### Tema Oscuro Personalizado
- **Fondo principal**: `#0a0a0a` (dark-950)
- **Fondo secundario**: `#171717` (dark-900)
- **Superficie**: `#262626` (dark-800)
- **Bordes**: `#404040` (dark-700)

### Colores Neón
- **Cyan**: `#00ffff` - Color principal
- **Purple**: `#a855f7` - Color secundario
- **Pink**: `#ec4899` - Acento
- **Green**: `#10b981` - Éxito

### Tipografía
- **Principal**: Inter (legibilidad excepcional)
- **Display**: Poppins (headings y destacados)
- **Mono**: JetBrains Mono (código)

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build           # Build de producción
npm run start           # Servidor de producción
npm run lint            # Linting
npm run type-check      # Verificación de tipos

# Testing
npm run test            # Tests unitarios
npm run test:watch      # Tests en modo watch
npm run test:coverage   # Cobertura de tests

# Storybook
npm run storybook       # Ejecutar Storybook
npm run build-storybook # Build de Storybook
```

## 🌟 Características Principales

### 🔐 Sistema de Autenticación
- Login/registro con validación
- JWT token management
- Protección de rutas
- Refresh token automático

### 📱 Feed Tipo Pinterest
- Grid de mampostería responsivo
- Lazy loading de imágenes
- Infinite scroll
- Animaciones suaves

### 🎯 Interacciones Sociales
- Sistema de likes con animaciones
- Comentarios en tiempo real
- Guardar en tableros personalizados
- Compartir publicaciones

### 🔍 Búsqueda Avanzada
- Búsqueda en tiempo real
- Filtros por estilo, color, ubicación
- Autocompletado inteligente
- Historial de búsquedas

### 🎨 Herramientas de IA
- Generación de diseños desde texto
- Simulación de tatuajes en fotos
- Recomendaciones personalizadas
- Editor de diseños

### 📅 Sistema de Citas
- Calendario interactivo
- Cotizaciones automáticas
- Notificaciones push
- Gestión de disponibilidad

### 🌍 Internacionalización
- Soporte para español e inglés
- Detección automática de idioma
- Cambio dinámico de idioma
- Formateo de fechas/números localizados

## 🚀 Optimizaciones

### Performance
- **Code splitting** automático con Next.js
- **Image optimization** con Sharp
- **Bundle analyzer** para monitoreo
- **Service Workers** para cache

### SEO
- **Meta tags** dinámicos
- **Open Graph** completo
- **Structured data** para motores
- **Sitemap** automático

### Accesibilidad
- **ARIA labels** completos
- **Keyboard navigation** nativo
- **Screen reader** compatible
- **Color contrast** AA

### Mobile First
- **Responsive design** completo
- **Touch gestures** optimizados
- **PWA** ready
- **Offline support** básico

## 🔧 Configuración

### Variables de Entorno
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id

# Feature Flags
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_ENABLE_PAYMENTS=true
```

### Desarrollo Local
1. **Clonar repositorio**
```bash
git clone https://github.com/artenis/frontend.git
cd artenis-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables**
```bash
cp .env.example .env.local
# Editar .env.local con tus valores
```

4. **Ejecutar desarrollo**
```bash
npm run dev
```

## 📱 Progressive Web App

La aplicación está configurada como PWA con:
- **Manifest** completo
- **Service Worker** para cache
- **Offline fallbacks**
- **Install prompts**
- **Push notifications**

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Visual Regression
```bash
npm run storybook
npm run test:visual
```

## 🚀 Deployment

### Vercel (Recomendado)
```bash
vercel --prod
```

### Docker
```bash
docker build -t artenis-frontend .
docker run -p 3000:3000 artenis-frontend
```

### Manual
```bash
npm run build
npm run start
```

## 🤝 Contribución

1. **Fork** el proyecto
2. **Crear** rama feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir** Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- 📧 **Email**: frontend@artenis.com
- 💬 **Discord**: [Artenis Developers](https://discord.gg/artenis-dev)
- 📚 **Docs**: [docs.artenis.com/frontend](https://docs.artenis.com/frontend)
- 🐛 **Issues**: [GitHub Issues](https://github.com/artenis/frontend/issues)

---

**Desarrollado con ❤️ por el equipo de Artenis**

*La mejor experiencia para descobrir y conectar con tatuadores extraordinarios.*
