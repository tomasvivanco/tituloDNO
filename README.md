# titulodno_2 (base local)

Esta versión toma la app original como base y aplica 4 fases de mejora en un MVP funcional local:

1. **Registro y acceso seguro**
   - Login y registro en español.
   - Registro solo mediante **token de invitación**.
   - Solo se permiten correos institucionales `@uc.cl`.
   - Contraseñas hasheadas con SHA-256 + salt (Web Crypto API).

2. **Datos y almacenamiento estructurado**
   - Modelo único en `localStorage` para usuarios, secciones, matrículas, invitaciones, recursos y archivos.

3. **Gestión de archivos**
   - Adjuntos por recurso con lectura local (Data URL) y descarga desde la interfaz.

4. **Usabilidad**
   - Flujo simple por rol (profesor / estudiante).
   - Mensajes de validación claros y UI compacta.

## Restricción institucional

- El acceso y las invitaciones aceptan únicamente correos que terminen en `@uc.cl`.

## Ejecutar

```bash
npm install
npm run dev
```

Demo:
- `profesora.demo@uc.cl` / `Demo2026!`
- `estudiante.demo@uc.cl` / `Demo2026!`
