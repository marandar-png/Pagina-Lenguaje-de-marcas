# The Hundred Line - Last Defense Academy

## Instalación y Configuración

### Requisitos
- Node.js instalado en tu máquina

### Pasos para ejecutar:

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Iniciar el servidor**
   ```bash
   npm start
   ```
   El servidor se ejecutará en `http://localhost:3000`

3. **Abrir la página**
   - Abre tu navegador y ve a `http://localhost:3000`
   - O simplemente abre el archivo `index.html` en tu navegador

## Sistema de Registro

El sitio incluye un sistema de registro de usuarios con las siguientes características:

- **Panel de Registro**: Disponible en la esquina superior derecha (botón con ícono de usuario)
- **Validación**: 
  - Todos los campos son requeridos
  - La edad mínima es 18 años
  - La contraseña se valida en el cliente y servidor
  - No se permiten correos duplicados

- **Base de Datos**: Los datos se guardan en el archivo `bd.json`

### Estructura de la base de datos

```json
{
  "users": [
    {
      "id": 1710852000000,
      "username": "ejemplo_usuario",
      "email": "usuario@ejemplo.com",
      "password": "contraseña",
      "age": 25,
      "registeredAt": "2026-03-19T14:00:00.000Z"
    }
  ]
}
```

## Archivos principales

- `index.html` - Estructura HTML con formulario de registro
- `styles.css` - Estilos incluyendo panel de registro
- `script.js` - Lógica de cliente para manejo del registro
- `server.js` - Servidor Express que maneja las solicitudes de registro
- `bd.json` - Base de datos JSON donde se almacenan los usuarios

## Funcionalidades adicionales

- Animaciones suaves con GSAP
- Verificación de edad
- Carrusel de imágenes
- Menú móvil responsive
- Panel de registro colapsable

---

**Nota**: Este proyecto usa un servidor local para guardar datos. No es adecuado para producción sin medidas de seguridad adicionales.
