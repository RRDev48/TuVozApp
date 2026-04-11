# TuVozApp

Proyecto mobile desarrollado con Expo y Supabase.

## Levantar el proyecto

### 1. Instalar dependencias

Desde la raiz del proyecto:

```bash
npm install
```

### 2. Preparar Supabase

Si ya existe un proyecto Supabase configurado para la app, este paso se puede saltear.

Si se necesita crear la base desde cero:

1. Crear un proyecto nuevo en Supabase.
2. Abrir el SQL Editor.
3. Ejecutar el archivo `supabase/bootstrap-minimo.sql`.

Ese script crea lo necesario para correr la app:

- tablas principales
- RLS
- buckets `Avatar` y `Categorias`
- RPC `public.create_user_with_profile`

### 3. Configurar variables de entorno

Crear `.env` a partir de `.env.example`:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Usar la URL del proyecto Supabase y la anon key.

### 4. Iniciar la app

```bash
npm run start
```

Opciones disponibles:

- `npm run android`
- `npm run web`

### 5. Verificar que quedo funcionando

Para validar el proyecto alcanza con comprobar:

1. inicia la app
2. funciona autenticacion con Supabase
3. se crea usuario y perfil
4. responden los modulos principales
5. cargan assets desde `Avatar` y `Categorias`
