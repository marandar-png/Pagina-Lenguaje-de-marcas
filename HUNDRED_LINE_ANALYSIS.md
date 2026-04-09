# Analisis tecnico de https://hundred-line.com/en/

Este documento resume como esta construida la pagina de referencia y que implicaciones tiene si luego queremos copiar funciones en este proyecto.

## 1. Stack real de la pagina

- HTML multi-seccion con muchisimo marcado decorativo y muchos `span` por letra.
- CSS muy pesado. Gran parte del efecto visual no vive en JS sino en clases de estado y `transition-delay` ya definidos en CSS.
- JS principal modular en `app.js` y utilidades en `util.js`.
- Librerias detectadas:
  - `jQuery 3.6.0`
  - `GSAP`
  - `ScrollTrigger`
  - `Lenis`
  - `Barba`
  - `PixiJS`
  - `pixi-filters`
  - `LazyLoad`
  - `js-modal-module`
  - `js-player-module-brightcove`
- Extras no esenciales para clonar funciones:
  - OneTrust cookies
  - Google Tag Manager
  - Typekit

## 2. Arquitectura general

La pagina no es una landing aislada. Comparte una arquitectura comun para varias rutas del sitio:

- `data-barba="wrapper"` y `data-barba="container"` para transiciones PJAX.
- `PAGE_FUNCTION.add(...)` registra modulos por pagina (`top`, `products`, `character`, etc.).
- `Barba` maneja `beforeLeave`, `leave`, `beforeEnter`, `enter`, `after`.
- `Lenis` se usa para smooth scroll y se sincroniza con `ScrollTrigger`.
- `LazyLoad` gestiona imagenes con `data-src`.

Conclusion importante:

- La sensacion de "pagina premium" sale de varias capas juntas, no de una sola funcion.
- Si luego quieres copiar algo "exactamente igual", muchas veces hara falta copiar HTML + CSS + JS, no solo JS.

## 3. Flujo de carga del top

### 3.1. En `document.ready`

- `Lazy.init()`
- `Scroll.init()`
- si la pagina es `top`:
  - `OP.init()`
  - `Scroll.stop()`

### 3.2. En `window.load`

- `MusicPlayer.init()`
- `Pjax.init()`
- `Bg.init()`
- `Menu.init()`
- `ModalModule.init()`
- `PAGE_FUNCTION.enter(...)`

### 3.3. Secuencia especial de entrada del top

El top tiene una intro propia llamada `OP`:

1. contador animado de 0 a 100 con GSAP
2. gate de fecha de nacimiento
3. gate de audio ON/OFF
4. se habilita el scroll
5. arranca el video de fondo
6. se destruye el overlay inicial
7. queda la pagina normal operativa

Esto no es un modal simple. Es un flujo de acceso completo.

## 4. Componentes clave de la pagina

### 4.1. Overlay inicial / age gate

Marcado principal:

- `.js-op`
- `.js-birth`
- `.js-birth_select`
- `.js-enter_btn_birth`
- `.js-enter_btn`
- `.js-op_counter`
- `.js-count-bar`

Comportamiento:

- genera un contador circular con GSAP
- guarda la fecha en `localStorage` con la clave `HUNDRED_LINE_BIRTH`
- bloquea acceso si el usuario no cumple edad minima
- despues muestra selector de audio ON/OFF

Detalle importante:

- el efecto visual del overlay usa una rejilla de celdas (`.l-op__cover-cell`) con delays definidos por CSS
- hay muchisimo trabajo visual ya "cocinado" en el HTML y en el CSS

### 4.2. Menu overlay

Marcado principal:

- `.js-menu`
- `.js-menu-close`
- `.l-nav`
- `.l-nav__cover-cell`
- `.l-nav__link-word`

Comportamiento:

- el JS realmente solo abre/cierra con clases de estado:
  - `is-menu-show`
  - `is-menu-open`
- los enlaces del menu ya vienen partidos letra por letra en el HTML
- el fondo del menu usa otra rejilla de celdas y delays CSS

Clave tecnica:

- el menu parece muy "animado", pero gran parte de esa animacion es CSS disparado por clases del `body`

### 4.3. Hero

Subpiezas:

- video de fondo independiente (`.js-bg_movie`)
- hero principal (`.js-hero`)
- tabs del hero (`.js-kv_nav`)
- visual arrastrable (`.js-hero_visual`)
- canvas encima del hero (`#hero_canvas`)

Comportamiento:

- los tabs cambian `data-kv` en el hero
- el CSS responde a `data-kv="1"`, `data-kv="2"`, `data-kv="3"`
- la imagen grande del hero se puede arrastrar horizontalmente

### 4.4. Canvas con Pixi y glitch

Este es uno de los puntos mas especiales.

Que hace:

- crea un canvas con `Pixi.Application`
- carga sprites del logo y del texto de release
- oculta las imagenes HTML originales
- aplica `GlitchFilter`
- activa/desactiva render segun si el hero esta visible con `ScrollTrigger`

Que significa para nosotros:

- este efecto NO es un simple `filter: glitch` de CSS
- para copiarlo de verdad hay que montar `Pixi`, sprites, resize, ticker y filtros
- es de las piezas mas caras de replicar 1:1

### 4.5. Sliders

La pagina usa `Swiper` importado dinamicamente.

Sliders detectados en `app.js`:

- `BnrSlide`
- `NewsSlide`
- `CharaSlide`
- `TrailerSlide`
- `KeywordSlide`
- `ThumbSlide` en `products`
- `Nav` en `character`

Observacion:

- `NewsSlide` existe en JS, pero en el HTML actual del top en ingles no he visto el marcado correspondiente, asi que ese modulo parece generico o inactivo en esta version.

Patrones comunes:

- clases `js-...-slide`
- `wrapperClass`, `slideClass`, paginacion y botones prev/next
- algunas paginaciones son numericas custom

### 4.6. Trailers y modales

Marcado principal:

- cada trailer usa `data-modal="template"`
- `data-modal-category="youtube"`
- dentro lleva un `<template>` con un `iframe` de YouTube

Comportamiento:

- el modulo de modal crea un wrapper propio
- al abrir:
  - pausa BGM
  - para fondo
  - para canvases activos
  - bloquea scroll
- al cerrar:
  - reanuda BGM
  - reanuda fondo
  - reanuda canvases

Este patron es muy util para copiar porque esta bastante desacoplado.

### 4.7. Audio / BGM

No usan un `<audio>` simple.

Usan:

- `PLAYER_MODULE_BRIGHTCOVE`
- `mode: 'audio'`
- `videoid: '6354783000112'`
- `account: '4929511769001'`

Comportamiento:

- botones con `data-bgm-play`
- el estado se refleja en `body[data-sound="on"]` o `off`
- el modal pausa y luego reanuda el audio

Si queremos copiar solo la experiencia de activar/desactivar musica, en tu proyecto seria mucho mas simple usar un `<audio>` local normal.

### 4.8. Scroll reveals

Patron base:

- el JS recorre elementos con `[data-scrollpoint]`
- al entrar en viewport les añade `is-scroll-active`

Lo importante:

- despues el CSS hace casi todo
- muchas secciones revelan barras, lineas, fondos y texto segun `is-scroll-active`

### 4.9. Animacion letra por letra

Este es otro rasgo central de la pagina.

Como lo hacen:

- el HTML ya viene descompuesto en cientos de `span`
- ejemplos:
  - `.p-top:intro_lead__text-word`
  - `.p-top:chara_data__catch-word`
  - `.p-top:chara_data__title-word`
  - `.p-top:chara_data__cv-word`
  - `.p-top:staff_data__word`
- muchos nodos llevan `data-delay-pc` y `data-delay-sp`
- el CSS contiene enormes bloques de `transition-delay` por `nth-child`

Conclusion:

- el efecto exacto depende de un HTML extremadamente granular
- si queremos copiarlo 1:1, habra que generar ese marcado o reescribir contenido asi
- si queremos una version parecida, podemos simplificarlo mucho con JS dinamico

## 5. Comparativa con tu proyecto actual

Tu proyecto ya tiene varias cosas en una direccion parecida:

- GSAP y ScrollTrigger
- video de fondo fijo
- overlay/grano
- menu overlay animado
- carrusel de imagenes
- verificacion de edad
- panel de registro

Pero todavia hay diferencias importantes con la pagina de referencia:

- tu pagina es de una sola ruta; la referencia usa arquitectura multi-pagina con `Barba`
- tu scroll es normal; la referencia usa `Lenis`
- tu menu es mas ligero; el suyo depende mucho mas del CSS y de un marcado mas decorativo
- tu carrusel es manual con GSAP; ellos usan `Swiper` en casi todo
- tu hero no tiene canvas `Pixi` ni efecto glitch
- tu texto aun no usa marcado letra por letra masivo
- tu modal/registro no sigue el patron de modales del sitio de referencia
- tu audio no replica el flujo de ON/OFF del acceso inicial

## 6. Que piezas podremos copiar mas facil

### Facil o media

- estructura general de overlay de menu
- sliders con `Swiper`
- modales de trailers
- smooth scroll con `Lenis`
- sistema de tabs del hero con `data-kv`
- scroll reveals por seccion con `is-scroll-active`

### Media/alta

- age gate de fecha de nacimiento como el original
- audio ON/OFF integrado con el acceso inicial
- animaciones de texto por letras si generamos el marcado automaticamente

### Alta / costosa si quieres clon exacto

- glitch del hero con `Pixi`
- mismos delays por letra que el original
- mismo nivel de detalle decorativo en HTML/CSS
- misma arquitectura completa con `Barba` si tu web sigue siendo una sola pagina

## 7. Recomendacion para las siguientes peticiones

Cuando me pidas copiar una funcion, lo mas eficiente sera que me la pidas por componente, por ejemplo:

- "haz el menu como el de Hundred Line"
- "haz el age gate inicial con fecha de nacimiento"
- "haz el slider de trailers con modal"
- "haz el hero con tabs"
- "haz el reveal letra por letra"

Asi podre decidir si:

- la copiamos 1:1
- la copiamos visualmente pero simplificada
- o la adaptamos a tu arquitectura actual

## 8. Fuentes inspeccionadas

- https://hundred-line.com/en/
- https://hundred-line.com/assets/js/app.js
- https://hundred-line.com/assets/js/util.js
- https://hundred-line.com/assets/css/style.css
- https://hundred-line.com/assets/css/style.add.css
- https://hundred-line.com/assets/js/vender/js-modal-module.js
- https://hundred-line.com/assets/js/vender/js-player-module-brightcove.js
