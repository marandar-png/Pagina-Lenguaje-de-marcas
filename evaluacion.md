**Evaluación: Miguel Aranda / Pagina-Lenguaje-de-marcas**

**Estado:** Evaluable

**Nota:** 8.50/10

**Desglose:**
- Ejecución y estabilidad: 18/20
- Front-end: 14/15
- Back-end: 13/15
- Funcionalidades: 17/20
- Responsive: 8/10
- Tipografías: 4/5
- Animación: 5/5
- Documentación: 4/10
- Repositorio: 2/5
**Funcionalidades indicadas:**
- landing temática de Blue Lock con vídeo de fondo.
- Animaciones de entrada con GSAP.
- Menú móvil animado con transición por caracteres.
- Carrusel hero con miniaturas.
- Carrusel de personajes con Swiper.
- Página individual de detalle de personaje por parámetro URL.
- Formularios de registro y login.
- Backend Express con `/api/register`, `/api/login` y `/api/users`.
- Hash de contraseña con PBKDF2 y salt.
- Persistencia de usuarios en `bd.json`.

**Resumen técnico:**
La web carga correctamente en local. También funcionan `script.js`, las páginas de detalle y el backend. Probé `/api/users`, registro y login; el flujo respondió correctamente y después restauré `bd.json` para no dejar datos de prueba. La URL pública probable `https://marandar-png.github.io/Pagina-Lenguaje-de-marcas/` devuelve 404.

El frontend tiene bastante trabajo visual: vídeo de fondo, GSAP, Swiper, menú móvil muy elaborado, carrusel de personajes y fichas individuales. Enhorabuena por la ambición visual, porque se nota intención de crear una experiencia más cercana a una web promocional que a una landing simple.

El backend está bien para el nivel: registra usuarios, valida campos, impide menores de 18, evita correos duplicados y guarda contraseñas con hash y salt. Como mejora, `/api/users` queda público y expone emails, aunque no expone hashes.

**Puntos fuertes:**
Muy buen esfuerzo en animaciones, presentación de personajes y backend propio. La base técnica del login está bastante bien planteada.

**Aspectos a mejorar:**
No subir `node_modules`, logs ni archivos pesados innecesarios. La documentación se queda corta y no explica bien el backend real, que es una de las mejores partes del trabajo.

**Retroalimentación:**
Buen trabajo. La web tiene mucha energía visual y el backend demuestra más esfuerzo del que parece a primera vista. Con una documentación más fiel y un repo más limpio, la entrega ganaría bastante.
