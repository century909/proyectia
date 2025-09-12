# 🚀 Seiki Chat - Guía de Instalación

## 📋 Requisitos del Sistema

### Mínimos:
- **RAM**: 4GB (recomendado 8GB)
- **Node.js**: v14 o superior
- **PostgreSQL**: v12 o superior
- **Sistema Operativo**: Linux, macOS, o Windows

### Para sistemas con poca RAM (3-4GB):
- Usar el modo ligero del frontend
- Cerrar aplicaciones innecesarias
- Aumentar swap si es necesario

## 🛠️ Instalación Paso a Paso

### 1. Clonar el Repositorio
```bash
git clone https://github.com/century909/proyectia.git
cd proyectia
```

### 2. Configurar la Base de Datos

#### Crear la base de datos:
```sql
CREATE DATABASE seiki;
```

#### Ejecutar el esquema:
```bash
psql -d seiki -f database/schema.sql
```

### 3. Configurar el Backend

```bash
cd backend
npm install
```

#### Crear archivo de configuración:
```bash
cp .env.example .env
```

#### Editar `.env`:
```env
PORT=5000
JWT_SECRET=tu_clave_secreta_aqui
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/seiki
FRONTEND_URL=http://localhost:5173
```

#### Iniciar el backend:
```bash
npm run dev
```

### 4. Configurar el Frontend

```bash
cd frontend
npm install
```

#### Crear archivo de configuración:
```bash
cp env.example .env
```

#### Editar `.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=Seiki Chat
VITE_TOKEN_PRICE=0.01
```

#### Iniciar el frontend:

**Para sistemas con poca RAM:**
```bash
npm run dev:light
```

**Para sistemas normales:**
```bash
npm run dev
```

**Modo seguro (alternativo):**
```bash
npm run dev:safe
```

## 🌐 Acceso a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Documentación API**: http://localhost:5000/api

## ✨ Características Implementadas

### 🎭 Gestión de Personajes
- ✅ Crear personajes con personalidad
- ✅ Actualizar avatares de personajes
- ✅ Eliminar personajes
- ✅ Respuestas de IA basadas en personalidad

### 💬 Chat en Tiempo Real
- ✅ Mensajería instantánea
- ✅ Indicadores de escritura
- ✅ Historial de conversaciones
- ✅ Eliminación de conversaciones

### 💰 Sistema de Tokens
- ✅ Compra de tokens
- ✅ Consumo automático por mensaje
- ✅ Visualización de saldo

### 🔒 Seguridad
- ✅ Autenticación JWT
- ✅ Validación de entrada
- ✅ Sanitización de datos
- ✅ Manejo de errores robusto

## 🐛 Solución de Problemas

### Problema: La computadora se reinicia al abrir el frontend
**Solución**: Usar el modo ligero
```bash
cd frontend
npm run dev:light
```

### Problema: Error de conexión a la base de datos
**Solución**: Verificar que PostgreSQL esté ejecutándose
```bash
sudo systemctl start postgresql
```

### Problema: Puerto ya en uso
**Solución**: Cambiar puertos en los archivos `.env`

### Problema: Memoria insuficiente
**Solución**: 
1. Cerrar aplicaciones innecesarias
2. Usar `npm run dev:light`
3. Aumentar swap: `sudo fallocate -l 2G /swapfile`

## 📱 Uso de la Aplicación

1. **Registrarse**: Crear una cuenta nueva
2. **Crear Personaje**: Definir nombre, descripción y personalidad
3. **Configurar Avatar**: Subir imagen del personaje
4. **Iniciar Chat**: Comenzar conversación con el personaje
5. **Comprar Tokens**: Adquirir tokens para más mensajes

## 🔧 Comandos Útiles

### Backend:
```bash
npm run dev          # Modo desarrollo
npm start            # Modo producción
```

### Frontend:
```bash
npm run dev          # Modo desarrollo normal
npm run dev:light    # Modo ligero (poca RAM)
npm run dev:safe     # Modo seguro
npm run build        # Construir para producción
npm run preview      # Vista previa de producción
```

## 📞 Soporte

Si encuentras problemas:
1. Verificar los logs del servidor
2. Comprobar la conexión a la base de datos
3. Revisar el uso de memoria del sistema
4. Usar el modo ligero si tienes poca RAM

## 🎯 Próximas Mejoras

- [ ] Integración con modelos de IA reales
- [ ] Generación automática de avatares
- [ ] Notificaciones push
- [ ] Panel de administración
- [ ] Análisis de conversaciones
