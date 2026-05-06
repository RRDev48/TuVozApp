# TuVozApp

Proyecto mobile desarrollado con **Expo** y **Supabase**.

---

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación](#instalación)
3. [Configuración de Supabase](#configuración-de-supabase)
4. [Variables de Entorno](#variables-de-entorno)
5. [Ejecutar la App](#ejecutar-la-app)
6. [Funcionalidades](#funcionalidades)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Tech Stack](#tech-stack)
9. [Build para Producción](#build-para-producción)
10. [Troubleshooting](#troubleshooting)
11. [Contribuir](#contribuir)
12. [Licencia](#licencia)

---

## Requisitos Previos

- **Node.js** (versión 18.x LTS o superior)
- **npm** o **yarn**
- **Expo CLI** (se instala automáticamente)
- Cuenta en **Supabase** (para el backend)
- Para Android: **Android Studio** o un emulador configurado
- Para iOS: **Xcode** (solo macOS)

---

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd TuVozApp
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

---

## Configuración de Supabase

### Opción A: Usar un proyecto existente

Si ya tienes un proyecto Supabase configurado, puedes saltar este paso.

### Opción B: Crear base de datos desde cero

1. Crear un nuevo proyecto en [Supabase](https://supabase.com)
2. Abrir el **SQL Editor**
3. Ejecutar el archivo `supabase/bootstrap-minimo.sql`

Este script crea:
- Tablas principales
- Políticas RLS (Row Level Security)
- Buckets: `Avatar` y `Categorias`
- Función RPC: `public.create_user_with_profile`

---

## Variables de Entorno

1. Copiar el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Editar `.env` con los valores de tu proyecto Supabase:

```env
# Supabase (obligatorio)
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Opcional: APIs externas
# EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
# EXPO_PUBLIC_SENTRY_DSN=
```

**Dónde encontrar las credenciales de Supabase:**
- URL: Configuración → API → Project URL
- Anon Key: Configuración → API → Project API keys → `anon` key

---

## Ejecutar la App

### Desarrollo

```bash
npm run start
```

### Plataformas específicas

```bash
npm run android   # Android
npm run ios        # iOS (solo macOS)
npm run web        # Navegador web
```

### Verificación

Para confirmar que la app funciona correctamente:

1. La app inicia sin errores
2. La autenticación con Supabase funciona
3. Se crea usuario y perfil correctamente
4. Los módulos principales responden
5. Los assets cargan desde los buckets `Avatar` y `Categorias`

---

## Funcionalidades

### 🚀 Autenticación
- Registro e inicio de sesión
- Verificación de email
- Gestión de sesiones

### 📋 Perfil de Usuario
- Información personal
- Preferencias de tema (claro/oscuro)
- Configuración de idioma

### 📅 Rutinas
- Creación y gestión de rutinas semanales
- Seguimiento de tareas diarias
- Vista de calendario por día
- Modal para agregar/editar tareas
- Detalles de tareas con pasos
- Progreso del día

### 🚨 Emergencias
- Perfil de emergencia completo
- Contacto de emergencia
- Alertas médicas (alergias, medicamentos, tipo de sangre)
- Notas importantes
- **Envío de alertas por WhatsApp y SMS** al contacto de emergencia
- Botón de llamada al 911

### ⚙️ Ajustes
- Configuración de cuenta
- Preferencias de personalización
- Gestión de idioma

---

## Estructura del Proyecto

```
TuVozApp/
├── src/
│   ├── app/
│   │   ├── assets/           # Imágenes, iconos, fuentes
│   │   ├── contexts/         # Contextos de React
│   │   ├── design-system/    # Sistema de diseño
│   │   ├── feature/         # Módulos de la app
│   │   │   ├── ajustes/     # Configuración
│   │   │   ├── auth/        # Autenticación
│   │   │   ├── emergencias/ # Módulo de emergencias
│   │   │   ├── rutinas/     # Rutinas y tareas
│   │   │   └── ...
│   │   ├── hooks/           # Custom hooks
│   │   ├── navigation/      # Navegación
│   │   ├── services/        # Servicios/API
│   │   └── utils/           # Utilidades
│   └── ...
├── supabase/
│   └── bootstrap-minimo.sql  # Script de base de datos
├── package.json
└── README.md
```

---

## Tech Stack

| Tecnología | Descripción |
|------------|-------------|
| **Expo** | Framework para React Native |
| **React Native** | Biblioteca para interfaces móviles |
| **TypeScript** | Tipado estático |
| **Supabase** | Backend como servicio (Auth, DB, Storage) |
| **React Navigation** | Navegación de la app |
| **Zustand** | Gestión de estado global |
| **Expo Location** | Acceso a ubicación |
| **Expo Linking** | Deep linking y abrir apps externas |

---

## Build para Producción

### Android (APK)

1. Generar el build de Android:
   ```bash
   npx expo run:android --variant release
   ```

2. El APK se generará en:
   ```
   android/app/build/outputs/apk/release/
   ```

### iOS (IPA)

> Solo disponible en macOS con Xcode instalado

1. Generar el build de iOS:
   ```bash
   npx expo run:ios --configuration Release
   ```

2. El IPA se generará en:
   ```
   ios/build/Build/Products/Release-iphoneos/
   ```

### Prebuild (para builds nativos)

Si necesitas modificar código nativo:

```bash
npx expo prebuild
```

Esto generará las carpetas `android` e `ios` para desarrollo nativo.

---

## Troubleshooting

### Error: "Unable to resolve module"

```bash
# Limpiar caché y reinstalar
rm -rf node_modules
npm install
npx expo start --clear
```

### Error de conexión con Supabase

1. Verificar que las variables de entorno estén correctas en `.env`
2. Confirmar que el proyecto Supabase esté activo
3. Revisar las políticas RLS en Supabase

### La app no detecta cambios

```bash
npx expo start --clear
```

### Problemas con emulador Android

1. Verificar que Android Studio esté instalado
2. Asegurarse de tener un emulador configurado
3. Ejecutar:
   ```bash
   adb devices
   ```

### Error de TypeScript

```bash
# Verificar errores de tipo
npx tsc --noEmit
```

### Build falla en iOS

1. Actualizar CocoaPods:
   ```bash
   cd ios && pod install && cd ..
   ```
2. Verificar versión de Xcode

---

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run start` | Inicia el servidor de desarrollo |
| `npm run android` | Abre en emulador Android |
| `npm run ios` | Abre en simulador iOS |
| `npm run web` | Abre en navegador web |
| `npm run lint` | Ejecuta linter |
| `npm run reset-project` | Reinicia el proyecto Expo |

---

## Contribuir

1. Crear una rama: `git checkout -b feature/nueva-funcionalidad`
2. Hacer commit: `git commit -m "Agregar nueva funcionalidad"`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crear Pull Request

---

## Licencia

MIT License