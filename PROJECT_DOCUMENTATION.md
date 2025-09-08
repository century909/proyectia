# Seiki Chat App - Documentación Técnica

**⚠️ FASE DE DESARROLLO - NO LISTO PARA PRODUCCIÓN ⚠️**

## Descripción General

Seiki Chat es una aplicación de chat con personajes de IA que permite a los usuarios crear y conversar con personajes personalizados. La aplicación utiliza un sistema de tokens para monetizar las interacciones entre usuarios y personajes.

## Tecnologías Utilizadas

### Backend
- **Node.js** con **Express.js** para el servidor API
- **JSON Web Tokens (JWT)** para autenticación
- **bcryptjs** para hashing de contraseñas
- **Socket.IO** para comunicación en tiempo real (implementación planificada)
- Almacenamiento en memoria (datos no persistentes - para desarrollo)

### Frontend
- **React** para la interfaz de usuario
- **React Router** para navegación
- **SCSS** para estilos (aunque TailwindCSS está en dependencias, no está siendo utilizado)
- **Vite** como bundler de desarrollo
- **Socket.IO Client** para comunicación en tiempo real (implementación planificada)

### Base de Datos
- La documentación menciona **PostgreSQL** pero la implementación actual utiliza almacenamiento en memoria
- El esquema de base de datos está definido en `database/schema.sql`

## Arquitectura del Proyecto

```
tipsy-chat/
├── backend/
│   ├── src/
│   │   └── server.js    # Servidor Express con todos los endpoints
│   ├── API.md           # Documentación de la API
│   ├── REALTIME_CHAT.md # Documentación de chat en tiempo real (planificado)
│   └── package.json     # Dependencias del backend
├── frontend/
│   ├── src/             # Código fuente de React
│   └── package.json     # Dependencias del frontend
└── database/
    └── schema.sql       # Esquema de base de datos PostgreSQL
```

## Funcionalidades Principales

### 1. Sistema de Autenticación
- Registro de usuarios con email, nombre de usuario y contraseña
- Inicio de sesión con JWT
- Protección de rutas mediante middleware de autenticación

### 2. Gestión de Personajes
- Creación de personajes con nombre, descripción y personalidad
- Visualización de personajes creados por el usuario
- Cada personaje pertenece a un usuario específico

### 3. Sistema de Conversaciones
- Creación de conversaciones con personajes
- Visualización del historial de conversaciones
- Las conversaciones están vinculadas a un usuario y un personaje

### 4. Mensajería
- Envío de mensajes a personajes
- Recepción de respuestas simuladas de los personajes
- Visualización del historial de mensajes por conversación

### 5. Sistema de Tokens
- Cada usuario comienza con 100 tokens
- Cada mensaje enviado consume 1 token
- Compra de tokens adicionales
- Visualización del saldo de tokens

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de nuevo usuario
- `POST /api/auth/login` - Inicio de sesión

### Personajes
- `POST /api/characters` - Crear un nuevo personaje
- `GET /api/characters` - Obtener personajes del usuario

### Conversaciones
- `POST /api/conversations` - Iniciar una nueva conversación
- `GET /api/conversations` - Obtener conversaciones del usuario

### Mensajes
- `POST /api/messages` - Enviar un mensaje
- `GET /api/messages` - Obtener mensajes de una conversación

### Tokens
- `GET /api/users/tokens` - Obtener saldo de tokens
- `POST /api/users/tokens/purchase` - Comprar tokens

## Estado Actual del Proyecto

### ⚠️ IMPORTANTE - LIMITACIONES DEL DESARROLLO

1. **Datos No Persistentes**: 
   - Todos los datos (usuarios, personajes, conversaciones, mensajes) se almacenan en memoria
   - Los datos se pierden al reiniciar el servidor
   - No hay conexión real a base de datos implementada

2. **Respuestas de Personajes Simuladas**:
   - Las respuestas de los personajes son generadas mediante plantillas simples
   - No hay integración con modelos de lenguaje de IA reales
   - Las respuestas no son personalizadas según la personalidad del personaje

3. **Chat en Tiempo Real No Implementado**:
   - Socket.IO está incluido en las dependencias pero no está implementado
   - La documentación en `REALTIME_CHAT.md` describe la implementación planificada
   - Actualmente se utiliza una arquitectura RESTful

4. **Frontend Parcialmente Implementado**:
   - Estructura básica del proyecto React establecida
   - Componentes y rutas definidos pero sin implementación completa
   - Aunque el README menciona TailwindCSS y está en las dependencias, el proyecto utiliza SCSS para los estilos

5. **Inconsistencias en la Documentación**:
   - El frontend README menciona TailwindCSS pero el código utiliza SCSS
   - Hay dependencias instaladas que no están siendo utilizadas

## Futuras Mejoras Planificadas

1. **Integración con Base de Datos Real**:
   - Implementar conexión con PostgreSQL según el esquema definido
   - Reemplazar almacenamiento en memoria con operaciones reales en base de datos

2. **Integración con Modelos de IA**:
   - Conectar con modelos de lenguaje para respuestas de personajes realistas
   - Personalizar respuestas según la personalidad definida de cada personaje

3. **Implementación de Chat en Tiempo Real**:
   - Completar la implementación de Socket.IO en backend y frontend
   - Mejorar la experiencia de chat con indicadores de presencia y escritura

4. **Generación de Imágenes para Avatares**:
   - Implementar generación de avatares de personajes
   - Permitir personalización visual de los personajes

5. **Panel de Administración**:
   - Interfaz para gestión de usuarios y personajes
   - Herramientas de moderación y análisis

## Instrucciones de Configuración

### Requisitos Previos
- Node.js (v14 o superior)
- npm o yarn

### Configuración del Backend
1. Navegar al directorio backend: `cd backend`
2. Instalar dependencias: `npm install`
3. Crear archivo `.env` con configuración (ver ejemplo en README)
4. Iniciar el servidor: `npm run dev`

### Configuración del Frontend
1. Navegar al directorio frontend: `cd frontend`
2. Instalar dependencias: `npm install`
3. Iniciar servidor de desarrollo: `npm run dev`

## Consideraciones de Seguridad

- Las contraseñas se hashean con bcrypt antes de almacenarse
- Los tokens JWT se utilizan para autenticar solicitudes de API
- CORS está habilitado para desarrollo (requiere configuración para producción)

## Notas de Desarrollo

Este proyecto se encuentra actualmente en una fase muy temprana de desarrollo. No está listo para ser desplegado en un entorno de producción debido a las siguientes limitaciones:

1. Falta de persistencia de datos
2. Respuestas de personajes no realistas
3. Funcionalidades críticas no implementadas (chat en tiempo real)
4. Falta de pruebas automatizadas
5. Posibles problemas de seguridad en la implementación actual

Se recomienda completar las siguientes tareas antes de considerar el proyecto para producción:
- Implementar conexión con base de datos PostgreSQL
- Integrar con modelos de lenguaje de IA
- Completar la implementación de chat en tiempo real
- Agregar pruebas unitarias y de integración
- Realizar auditoría de seguridad