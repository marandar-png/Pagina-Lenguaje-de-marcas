# Documentación Técnica – Pagina-Lenguaje-de-marcas

Repositorio original: [Pagina-Lenguaje-de-marcas](https://github.com/marandar-png/Pagina-Lenguaje-de-marcas?utm_source=chatgpt.com)

---

# 1. Instrucciones de inicio / ejecución de la web

## Requisitos previos

* Tener instalado Node.js.
* Tener instalado npm.
* Tener Git instalado.

## Clonar el repositorio

```bash
git clone https://github.com/marandar-png/Pagina-Lenguaje-de-marcas.git
```

## Entrar en el proyecto

```bash
cd Pagina-Lenguaje-de-marcas
```

## Instalar dependencias

```bash
npm install
```

## Ejecutar el servidor

```bash
node server.js
```

## Abrir en navegador

Abrir la dirección:

```txt
http://localhost:3000
```

---

# 2. Funcionalidades principales implementadas

1. Visualización dinámica de personajes.
2. Página de detalle individual de personajes.
3. Carga de datos desde archivo JSON.
4. Sistema de navegación entre páginas HTML.
5. Diseño responsive mediante CSS.

---

# 3. Funcionalidad 1 – Visualización dinámica de personajes

## 3.1 ¿Qué hace?

La página principal muestra dinámicamente una colección de personajes utilizando datos almacenados en archivos JavaScript y JSON. Cada personaje aparece con su imagen, nombre y descripción.

## 3.2 ¿Cómo funciona?

El archivo `script.js` se encarga de recorrer la información de personajes y generar automáticamente elementos HTML utilizando JavaScript.

El sistema utiliza:

* `characters-data.js` para almacenar información.
* `script.js` para renderizar contenido.
* `index.html` como estructura principal.

El DOM se modifica dinámicamente utilizando métodos de JavaScript.

## 3.3 Fragmentos relevantes

### Archivo relacionado

```txt
script.js
```

### Ejemplo de lógica utilizada

```javascript
characters.forEach(character => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <img src="${character.image}">
        <h2>${character.name}</h2>
    `;
    container.appendChild(card);
});
```

### Explicación

* `forEach()` recorre todos los personajes.
* `document.createElement()` crea elementos HTML dinámicamente.
* `classList.add()` añade estilos CSS.
* `innerHTML` inserta contenido HTML.
* `appendChild()` añade el elemento al contenedor principal.

Este código se relaciona directamente con:

* `styles.css`
* `characters-data.js`
* `index.html`

---

# 4. Funcionalidad 2 – Página de detalle de personajes

## 4.1 ¿Qué hace?

Permite acceder a una página individual con información detallada de cada personaje.

## 4.2 ¿Cómo funciona?

El archivo `character-detail.js` obtiene parámetros desde la URL y carga automáticamente los datos correspondientes del personaje seleccionado.

La información se muestra dentro de `personaje.html`.

## 4.3 Fragmentos relevantes

### Archivo relacionado

```txt
character-detail.js
```

### Ejemplo de lógica utilizada

```javascript
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
```

### Explicación

* `URLSearchParams` permite leer parámetros enviados en la URL.
* `window.location.search` obtiene la cadena de búsqueda.
* `params.get('id')` obtiene el identificador del personaje.

Posteriormente se filtra la información y se inserta en el HTML.

Este código se relaciona con:

* `personaje.html`
* `characters-data.js`

---

# 5. Funcionalidad 3 – Carga de datos desde JSON

## 5.1 ¿Qué hace?

La aplicación utiliza un archivo JSON para almacenar información estructurada sobre personajes y contenido de la página.

## 5.2 ¿Cómo funciona?

El archivo `bd.json` actúa como base de datos local.

JavaScript accede a los datos y los convierte en elementos visuales dentro de la web.

## 5.3 Fragmentos relevantes

### Archivo relacionado

```txt
bd.json
```

### Ejemplo de estructura

```json
{
  "name": "Personaje",
  "description": "Descripción del personaje"
}
```

### Explicación

* Los datos se almacenan en formato clave-valor.
* JSON permite separar la lógica de la información.
* Facilita la escalabilidad del proyecto.

Este archivo se relaciona con:

* `script.js`
* `character-detail.js`

---

# 6. Funcionalidad 4 – Navegación entre páginas

## 6.1 ¿Qué hace?

Permite al usuario moverse entre diferentes páginas de la web.

## 6.2 ¿Cómo funciona?

La navegación se realiza mediante enlaces HTML y redirecciones JavaScript.

Las páginas principales del proyecto son:

* `index.html`
* `personaje.html`
* `transicion.html`

## 6.3 Fragmentos relevantes

### Ejemplo de navegación

```html
<a href="personaje.html?id=1">Ver personaje</a>
```

### Explicación

* `href` define la página destino.
* El parámetro `id` se utiliza para identificar contenido dinámico.
* El navegador carga automáticamente la nueva página.

Relacionado con:

* `character-detail.js`
* `index.html`

---

# 7. Funcionalidad 5 – Diseño responsive

## 7.1 ¿Qué hace?

La web adapta automáticamente su diseño a móviles, tablets y ordenadores.

## 7.2 ¿Cómo funciona?

Se utilizan media queries y diseño flexible mediante CSS.

El archivo principal encargado de la apariencia es `styles.css`.

## 7.3 Fragmentos relevantes

### Archivo relacionado

```txt
styles.css
```

### Ejemplo de media query

```css
@media (max-width: 768px) {
    .container {
        flex-direction: column;
    }
}
```

### Explicación

* `@media` aplica estilos según el tamaño de pantalla.
* `max-width: 768px` detecta dispositivos móviles.
* `flex-direction: column` reorganiza los elementos verticalmente.

Relacionado con:

* `index.html`
* `personaje.html`

---

# 8. Funcionalidades adicionales

## 8.1 Transiciones visuales

La web incorpora una página de transición (`transicion.html`) para mejorar la experiencia del usuario.

## 8.2 Funcionamiento

Se utilizan animaciones CSS y cambios automáticos entre páginas.

## 8.3 Fragmentos relevantes

```css
transition: all 0.3s ease;
```

### Explicación

* `transition` permite animaciones suaves.
* `ease` mejora la naturalidad de la animación.

Relacionado con:

* `styles.css`
* `transicion.html`

---

# 9. Funcionalidad Backend

## 9.1 ¿Qué hace?

El backend sirve los archivos de la página web utilizando Node.js.

## 9.2 ¿Cómo funciona?

El archivo `server.js` crea un servidor local encargado de entregar los archivos HTML, CSS y JavaScript al navegador.

## 9.3 Fragmentos relevantes

### Archivo relacionado

```txt
server.js
```

### Ejemplo de lógica

```javascript
const http = require('http');
```

### Explicación

* `require('http')` importa el módulo HTTP de Node.js.
* El servidor escucha peticiones del navegador.
* Devuelve archivos estáticos al cliente.

Relacionado con:

* `index.html`
* `styles.css`
* `script.js`

---

# 10. Responsividad

## 10.1 ¿Qué hace?

Garantiza que la interfaz pueda visualizarse correctamente en diferentes tamaños de pantalla.

## 10.2 ¿Cómo funciona?

Se utilizan:

* Flexbox.
* Media queries.
* Tamaños relativos.
* Distribución adaptable.

## 10.3 Fragmentos relevantes

### Ejemplo

```css
.container {
    display: flex;
    flex-wrap: wrap;
}
```

### Explicación

* `display: flex` crea un contenedor flexible.
* `flex-wrap: wrap` permite reorganizar elementos automáticamente.
* Mejora la adaptabilidad en dispositivos pequeños.

Relacionado con:

* `styles.css`
* Todas las páginas HTML.

---

# Archivos principales del proyecto

| Archivo             | Función                  |
| ------------------- | ------------------------ |
| index.html          | Página principal         |
| personaje.html      | Página de detalle        |
| transicion.html     | Página de transición     |
| styles.css          | Estilos visuales         |
| script.js           | Lógica principal         |
| character-detail.js | Lógica de detalle        |
| characters-data.js  | Datos de personajes      |
| bd.json             | Base de datos local      |
| server.js           | Servidor backend         |
| package.json        | Configuración de Node.js |
| README.md           | Información del proyecto |
| SETUP.md            | Guía de instalación      |

---

# Conclusión

El proyecto "Pagina-Lenguaje-de-marcas" es una página web dinámica desarrollada con HTML, CSS, JavaScript y Node.js. La aplicación utiliza renderizado dinámico de contenido, navegación entre páginas y diseño responsive para ofrecer una experiencia visual moderna y adaptable.
