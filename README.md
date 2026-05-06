# TuVozApp

[![Version](https://img.shields.io/badge/v1.0.0-3178c6?style=flat-square)](https://github.com/rrdev/TuVozApp)
[![Expo](https://img.shields.io/badge/Expo-54.0-black?style=flat-square)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-3-3ecf8e?style=flat-square)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-3ecf8e?style=flat-square)](LICENSE)

**Proyecto mobile desarrollado con Expo y Supabase**
---
## Tabla de Contenidos

| # | Sección | Descripción |
|---|---------|-------------|
| 1 | [📋 Requisitos Previos](#requisitos-previos) | Herramientas necesarias |
| 2 | [💾 Instalación](#instalación) | Cómo clonar e instalar |
| 3 | [🗄️ Configuración de Supabase](#configuración-de-supabase) | Setup de base de datos |
| 4 | [🔐 Variables de Entorno](#variables-de-entorno) | Configuración de credenciales |
| 5 | [▶️ Ejecutar la App](#ejecutar-la-app) | Comandos de ejecución |
| 6 | [⚡ Funcionalidades](#funcionalidades) | Características de la app |
| 7 | [📁 Estructura del Proyecto](#estructura-del-proyecto) | Organización de archivos |
| 8 | [🛠️ Tech Stack](#tech-stack) | Tecnologías utilizadas |
| 9 | [📦 Build para Producción](#build-para-producción) | Generar APK/IPA |
| 10 | [🔧 Troubleshooting](#troubleshooting) | Solución de problemas |
| 11 | [❓ FAQ](#faq) | Preguntas frecuentes |
| 12 | [👤 Créditos](#créditos) | Información del desarrollador |
| 13 | [📜 Licencia](#licencia) | Términos de uso |
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
2. Instalar dependencias:
      npm install
   
---
3. Configuración de Supabase
Opción A: Usar un proyecto existente
Si ya tienes un proyecto Supabase configurado, puedes saltar este paso.
Opción B: Crear base de datos desde cero
1. Crear un nuevo proyecto en Supabase (https://supabase.com)
2. Abrir el SQL Editor
3. Ejecutar el archivo supabase/bootstrap-minimo.sql
Este script crea:
- Tablas principales
- Políticas RLS (Row Level Security)
- Buckets: Avatar y Categorias
- Función RPC: public.create_user_with_profile
---
4. Variables de Entorno
1. Copiar el archivo de ejemplo:
      cp .env.example .env
   
2. Editar .env con los valores de tu proyecto Supabase:
# Supabase (obligatorio)
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
# Opcional: APIs externas
# EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
# EXPO_PUBLIC_SENTRY_DSN=
Dónde encontrar las credenciales de Supabase:
- URL: Configuración → API → Project URL
- Anon Key: Configuración → API → Project API keys → anon key
---
5. Ejecutar la App
Desarrollo
npm run start
Plataformas específicas
npm run android   # Android
npm run ios        # iOS (solo macOS)
npm run web        # Navegador web
Verificación
Para confirmar que la app funciona correctamente:
1. La app inicia sin errores
2. La autenticación con Supabase funciona
3. Se crea usuario y perfil correctamente
4. Los módulos principales responden
5. Los assets cargan desde los buckets Avatar y Categorias
---
6. Funcionalidades
🚀 Autenticación
- Registro e inicio de sesión
- Verificación de email
- Gestión de sesiones
📋 Perfil de Usuario
- Información personal
- Preferencias de tema (claro/oscuro)
- Configuración de idioma
📅 Rutinas
- Creación y gestión de rutinas semanales
- Seguimiento de tareas diarias
- Vista de calendario por día
- Modal para agregar/editar tareas
- Detalles de tareas con pasos
- Progreso del día
🚨 Emergencias
- Perfil de emergencia completo
- Contacto de emergencia
- Alertas médicas (alergias, medicamentos, tipo de sangre)
- Notas importantes
- Envío de alertas por WhatsApp y SMS al contacto de emergencia
- Botón de llamada al 911
⚙️ Ajustes
- Configuración de cuenta
- Preferencias de personalización
- Gestión de idioma
---
7. Estructura del Proyecto
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
---
8. Tech Stack
Tecnología
Expo
React Native
TypeScript
Supabase
React Navigation
Zustand
Expo Location
Expo Linking
---
9. Build para Producción
Android (APK)
1. Generar el build de Android:
      npx expo run:android --variant release
   
2. El APK se generará en:
      android/app/build/outputs/apk/release/
   
iOS (IPA)
> Solo disponible en macOS con Xcode instalado
1. Generar el build de iOS:
      npx expo run:ios --configuration Release
   
2. El IPA se generará en:
      ios/build/Build/Products/Release-iphoneos/
   
Prebuild (para builds nativos)
Si necesitas modificar código nativo:
npx expo prebuild
Esto generará las carpetas android e ios para desarrollo nativo.
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
      adb devices
   
Error de TypeScript
# Verificar errores de tipo
npx tsc --noEmit
Build falla en iOS
1. Actualizar CocoaPods:
      cd ios && pod install && cd ..
   2. Verificar versión de Xcode
---

## FAQ

### ¿Cómo ejecutar la app en mi celular?

1. Escanea el código QR que aparece al ejecutar `npm run start`
2. O conecta tu dispositivo por USB y ejecuta `npm run android`

### ¿Necesito cuenta de Supabase?

Sí, la app requiere un proyecto de Supabase para funcionar. Puedes crear uno gratis en [supabase.com](https://supabase.com).

### ¿La app funciona sin internet?

Algunas funciones requieren conexión (autenticación, cargar datos), pero la app está diseñada para funcionar offline cuando sea posible.

### ¿Cómo contacto al desarrollador?

Para reportar bugs o sugerencias, puedes crear un issue en el repositorio o contactar directamente.

### ¿Puedo contribuir al proyecto?

Sí, puedes crear un fork y enviar pull requests. Ver sección [Contribuir](#contribuir).

---

## Créditos
| Campo | Información |
|:------|:------------|
| **Desarrollador** | RRDev |
| **Año** | 2026 |
| **Tech Stack** | Expo + React Native + TypeScript |
| **Backend** | Supabase |

---

## Licencia

MIT License

---

## Scripts Disponibles
Script
npm run start
npm run android
npm run ios
npm run web
npm run lint
npm run reset-project
---

## Contribuir

1. Crear una rama: `git checkout -b feature/nueva-funcionalidad`
2. Hacer commit: `git commit -m "Agregar nueva funcionalidad"`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crear Pull Request
