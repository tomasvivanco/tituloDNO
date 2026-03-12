# titulodno_2 (MVP para lanzamiento rápido)

Esta versión toma la app original y deja un flujo funcional para pilotos con usuarios reales en GitHub Pages.

## Qué quedó implementado

1. **Registro y acceso seguro (cliente)**
   - Login y registro en español.
   - Registro solo mediante token de invitación.
   - Restricción de correos institucionales `@uc.cl`.
   - Contraseñas hasheadas con SHA-256 + salt (Web Crypto API).

2. **Datos estructurados**
   - Modelo único en `localStorage` para: usuarios, secciones, matrículas, invitaciones, recursos y archivos.

3. **Gestión de archivos**
   - Adjuntos en recursos (almacenados localmente en Data URL) con descarga directa desde la interfaz.

4. **Usabilidad**
   - Flujo por rol (profesor / estudiante).
   - Mensajes de validación y estado.
   - Interfaz compacta para ejecución rápida.

## Restricción institucional

- El acceso y las invitaciones aceptan únicamente correos que terminen en `@uc.cl`.

## Ejecutar local

```bash
npm install
npm run dev
```

## Deploy en GitHub Pages

El proyecto ya incluye scripts de deploy con `gh-pages` y `base: '/tituloDNO/'` en Vite.

```bash
npm run build
npm run deploy
```

> Si tu repositorio se llama distinto a `tituloDNO`, actualiza `base` en `vite.config.js`.

## Usuarios demo

- `profesora.demo@uc.cl` / `Demo2026!`
- `estudiante.demo@uc.cl` / `Demo2026!`
