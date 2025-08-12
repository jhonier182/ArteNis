# Artenis Backend - Arquitectura Hexagonal

## 🏗️ Arquitectura

Este backend implementa **Arquitectura Hexagonal (Clean Architecture)** con **CQRS** para garantizar:

- ✅ **Separación clara de responsabilidades**
- ✅ **Código testeable y mantenible**
- ✅ **Independencia de frameworks**
- ✅ **Facilidad para cambiar tecnologías**
- ✅ **Escalabilidad horizontal**

## 📁 Estructura del Proyecto

```
/src
│
├── main.ts                  # Punto de entrada de la app
├── app.module.ts            # Módulo raíz
│
├── config/                  # Configuración global
│   ├── app.config.ts        # Config general de la app
│   ├── database.config.ts   # Config de bases de datos
│   └── cloud.config.ts      # Config de servicios cloud
│
├── common/                  # Elementos reutilizables
│   ├── constants/           # Constantes globales
│   ├── decorators/          # Decoradores personalizados
│   ├── filters/             # Filtros globales de errores
│   ├── guards/              # Guards para auth, roles, etc.
│   └── interceptors/        # Interceptores (logging, transform)
│
├── infrastructure/          # Capa de acceso a datos y servicios externos
│   ├── database/
│   │   └── mysql/           # Implementación MySQL
│   │       ├── config.ts    # Configuración TypeORM
│   │       ├── entities/    # Entidades de BD
│   │       └── repositories/ # Implementaciones de repositorios
│   ├── storage/             # S3, Cloudflare R2, etc.
│   ├── auth/                # Firebase/Auth0 integration
│   ├── payments/            # Stripe, PayPal
│   ├── ai/                  # APIs de IA
│   └── cdn/                 # CDN integration
│
├── domain/                  # Lógica pura del negocio
│   └── user/                # Dominio de usuario
│       ├── entities/        # Entidades de dominio
│       ├── repositories/    # Interfaces de repositorios
│       └── services/        # Servicios de dominio
│
├── application/             # Casos de uso (CQRS)
│   └── user/
│       ├── commands/        # Comandos (escritura)
│       ├── queries/         # Consultas (lectura)
│       └── mappers/         # Mapeo de datos
│
├── interfaces/              # Adaptadores: controladores
│   └── rest/                # Controladores REST
│       ├── dto/             # DTOs para API
│       ├── user.controller.ts
│       ├── post.controller.ts
│       └── booking.controller.ts
│
└── modules/                 # Módulos organizados de NestJS
    ├── user/                # Módulo de usuario
    ├── post/                # Módulo de publicaciones
    ├── booking/             # Módulo de citas
    ├── payment/             # Módulo de pagos
    └── ai-design/           # Módulo de IA
```

## 🎯 Características Principales

### ✨ Arquitectura Hexagonal
- **Dominio**: Lógica de negocio pura, sin dependencias externas
- **Aplicación**: Casos de uso y orquestación
- **Infraestructura**: Acceso a datos y servicios externos
- **Interfaces**: Controladores REST, GraphQL, etc.

### 🔄 CQRS (Command Query Responsibility Segregation)
- **Commands**: Operaciones de escritura (crear, actualizar, eliminar)
- **Queries**: Operaciones de lectura (consultas, búsquedas)
- **Handlers**: Procesan commands y queries por separado

### 🛡️ Seguridad y Calidad
- **JWT Authentication** con guards personalizados
- **Validación de datos** con DTOs y class-validator
- **Filtros de errores** globales
- **Interceptores** para logging y transformación
- **Rate limiting** con Throttler

### 📊 Base de Datos
- **MySQL** como base de datos principal
- **TypeORM** para ORM
- **Migraciones** automáticas
- **Índices optimizados** para rendimiento

### 🚀 APIs y Integraciones
- **Swagger/OpenAPI** para documentación automática
- **AWS S3** / **Cloudflare R2** para almacenamiento
- **Redis** para cache
- **Elasticsearch/Meilisearch** para búsqueda
- **Stripe** para pagos
- **OpenAI** para IA

## 🏃‍♂️ Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp env.template .env
# Editar .env con tus configuraciones
```

### 3. Ejecutar la aplicación
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

### 4. Ver documentación API
```
http://localhost:3000/api/docs
```

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Servidor con hot reload
npm run start:debug        # Servidor en modo debug

# Build y producción
npm run build              # Compilar aplicación
npm run start:prod         # Ejecutar en producción

# Base de datos
npm run migration:generate # Generar migración
npm run migration:run      # Ejecutar migraciones
npm run migration:revert   # Revertir migración

# Testing
npm run test               # Tests unitarios
npm run test:e2e          # Tests end-to-end
npm run test:cov          # Coverage de tests

# Calidad de código
npm run lint              # Ejecutar linter
npm run format            # Formatear código
```

## 🎨 Flujo de Datos

### Escritura (Commands)
```
Controller → Command → CommandHandler → DomainService → Repository → Database
```

### Lectura (Queries)
```
Controller → Query → QueryHandler → Repository → Database
```

### Ejemplo: Crear Usuario
1. **Controller** recibe petición HTTP POST
2. **Command** encapsula datos de entrada
3. **CommandHandler** ejecuta lógica de negocio
4. **DomainService** valida reglas de negocio
5. **Repository** persiste en base de datos
6. **Mapper** convierte a DTO de respuesta

## 🔧 Configuración por Entornos

### Development
- Base de datos local
- Logs detallados
- Hot reload
- Swagger habilitado

### Production
- Base de datos en cloud
- Logs optimizados
- Rate limiting estricto
- Swagger deshabilitado

## 📈 Ventajas de esta Arquitectura

### 🎯 Mantenibilidad
- Código organizado por dominio
- Responsabilidades claras
- Fácil localización de bugs

### 🧪 Testabilidad
- Lógica de negocio aislada
- Mocks fáciles de crear
- Tests unitarios rápidos

### 🔄 Escalabilidad
- Microservicios preparados
- Cache en múltiples niveles
- Base de datos optimizada

### 🛠️ Flexibilidad
- Fácil cambio de tecnologías
- Nuevas interfaces sin impacto
- Integración de servicios externos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas:
- 📧 Email: tech@artenis.com
- 📱 Discord: [Artenis Community](https://discord.gg/artenis)
- 📚 Docs: [docs.artenis.com](https://docs.artenis.com)

---

**Desarrollado con ❤️ por el equipo de Artenis**
