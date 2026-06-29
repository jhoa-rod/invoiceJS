# Gestión de facturas

Aplicación web en React, TypeScript y Tailwind CSS para crear, guardar, buscar, compartir y descargar facturas con cálculo automático de total bruto, IRPF y total neto.

## Funcionalidades

- Dashboard con resumen de facturación.
- Autenticación real con Supabase Auth usando email y contraseña.
- Registro, inicio de sesión y cierre de sesión con sesión persistente.
- Separación de facturas por usuario mediante Row Level Security.
- Crear y editar facturas con datos de emisor, cliente, número, fecha, período, estado e IRPF configurable.
- Añadir, modificar y eliminar líneas de servicios.
- Cálculo automático en formato español/europeo.
- Vista previa con diseño profesional tipo plantilla PDF/Excel.
- Archivo de facturas con búsqueda por cliente, número, fecha y rango de fechas.
- Enlace compartible con vista pública solo lectura.
- Exportación de factura individual a CSV.
- Exportación del archivo completo a CSV.
- Descarga PDF mediante la opción de impresión del navegador.
- Persistencia en Supabase, no en `localStorage`.
- Datos de ejemplo precargados con la factura `2/26`.
- Tema lavanda único.
- Inglés por defecto con selector para cambiar a español.

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

La app se sirve normalmente en:

```text
http://localhost:5173
```

## Variables de entorno

Configura estas variables en `.env` para desarrollo y también en Netlify para producción:

```text
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

## Base de datos Supabase

Ejecuta el script SQL de facturas en el SQL Editor de Supabase:

```text
supabase/invoices.sql
```

Ese script crea la tabla `public.invoices`, índices, trigger de `updated_at` y políticas RLS para que cada usuario autenticado solo pueda ver, crear, editar y eliminar sus propias facturas.

## Producción

```bash
npm run build
npm run preview
```

## Nota sobre el PDF

El botón `PDF` abre la versión imprimible de la factura. Desde el diálogo del navegador se puede guardar como PDF.
