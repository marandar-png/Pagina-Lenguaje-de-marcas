if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const detailApp = document.getElementById('characterDetailApp');
const detailCharacters = Array.isArray(window.charactersData) ? window.charactersData : [];

function buildDetailUrl(slug) {
    return `personaje.html?personaje=${encodeURIComponent(slug)}`;
}

function padDetailNumber(value) {
    return String(value).padStart(2, '0');
}

function buildHeroChips(profileItems) {
    return profileItems.slice(0, 3).map((item) => `
        <span class="detail-hero__chip">
            <strong>${item.label}</strong>
            <span>${item.value}</span>
        </span>
    `).join('');
}

function buildProfileItems(profileItems) {
    return profileItems.map((item) => `
        <div class="detail-profile-item">
            <dt>${item.label}</dt>
            <dd>${item.value}</dd>
        </div>
    `).join('');
}

function buildStats(stats) {
    return stats.map((stat) => `
        <li class="detail-stat">
            <div class="detail-stat__header">
                <span>${stat.label}</span>
                <span>${stat.value}</span>
            </div>
            <div class="detail-stat__track" aria-hidden="true">
                <span class="detail-stat__fill" style="--stat-value:${stat.value}%;"></span>
            </div>
        </li>
    `).join('');
}

function buildBulletItems(items) {
    return items.map((item) => `<li>${item}</li>`).join('');
}

function buildSwitcherCard(label, character) {
    return `
        <a class="detail-switcher__item" href="${buildDetailUrl(character.slug)}">
            <span class="detail-switcher__label">${label}</span>
            <strong class="detail-switcher__name">${character.name}</strong>
            <span class="detail-switcher__role">${character.role}</span>
        </a>
    `;
}

function buildRelatedCards(activeSlug) {
    return detailCharacters
        .filter((character) => character.slug !== activeSlug)
        .slice(0, 4)
        .map((character) => `
            <a
                class="detail-related__card"
                href="${buildDetailUrl(character.slug)}"
                style="--card-accent: linear-gradient(180deg, ${character.accent}, #08182f);"
            >
                <img src="${character.image}" alt="${character.name}" style="object-position:${character.visualPosition};">
                <div class="detail-related__copy">
                    <span>${character.role}</span>
                    <strong>${character.name}</strong>
                    <p>${character.tagline}</p>
                </div>
            </a>
        `).join('');
}

function renderEmptyState() {
    if (!detailApp) return;

    detailApp.innerHTML = `
        <section class="detail-empty">
            <h1>Character file unavailable</h1>
            <p>No he encontrado los datos del personaje. Puedes volver al roster principal y abrir otra ficha.</p>
            <a href="index.html#characters" class="menu-btn detail-back-link">VOLVER AL ROSTER</a>
        </section>
    `;
}

function renderCharacterDetail(character, index) {
    if (!detailApp) return;

    const previousCharacter = detailCharacters[(index - 1 + detailCharacters.length) % detailCharacters.length];
    const nextCharacter = detailCharacters[(index + 1) % detailCharacters.length];

    detailApp.innerHTML = `
        <section class="detail-hero">
            <div class="detail-hero__copy">
                <p class="detail-eyebrow">BLUE LOCK FILE ${padDetailNumber(index + 1)}</p>
                <span class="detail-role-pill">${character.role}</span>
                <h1 class="detail-title">${character.name}</h1>
                <p class="detail-tagline">${character.tagline}</p>
                <blockquote class="detail-quote">"${character.quote}"</blockquote>

                <div class="detail-actions">
                    <a href="index.html#characters" class="menu-btn detail-back-link">VOLVER A PERSONAJES</a>
                    <a href="#detailPanels" class="detail-text-link">SCROLL FILE</a>
                </div>

                <div class="detail-hero__chips">
                    ${buildHeroChips(character.profile)}
                </div>
            </div>

            <div class="detail-hero__visual">
                <figure class="detail-hero__portrait">
                    <img
                        src="${character.image}"
                        alt="${character.name}"
                        style="object-position:${character.visualPosition};"
                    >
                </figure>
                <div class="detail-hero__badge">
                    <span>${padDetailNumber(index + 1)}</span>
                    <small>BLUE LOCK</small>
                </div>
            </div>
        </section>

        <section class="detail-panels" id="detailPanels">
            <article class="detail-panel detail-panel--wide">
                <p class="detail-panel__eyebrow">Overview</p>
                <h2 class="detail-panel__title">Perfil general</h2>
                <div class="detail-copy">
                    ${character.synopsis.map((paragraph) => `<p>${paragraph}</p>`).join('')}
                </div>
            </article>

            <article class="detail-panel">
                <p class="detail-panel__eyebrow">Core data</p>
                <h2 class="detail-panel__title">Ficha rapida</h2>
                <dl class="detail-profile-list">
                    ${buildProfileItems(character.profile)}
                </dl>
            </article>

            <article class="detail-panel">
                <p class="detail-panel__eyebrow">Stats</p>
                <h2 class="detail-panel__title">Parametros</h2>
                <ul class="detail-stats">
                    ${buildStats(character.stats)}
                </ul>
            </article>

            <article class="detail-panel">
                <p class="detail-panel__eyebrow">Weapons</p>
                <h2 class="detail-panel__title">Armas principales</h2>
                <ul class="detail-bullet-list">
                    ${buildBulletItems(character.weapons)}
                </ul>
            </article>

            <article class="detail-panel">
                <p class="detail-panel__eyebrow">Moments</p>
                <h2 class="detail-panel__title">Momentos clave</h2>
                <ul class="detail-bullet-list">
                    ${buildBulletItems(character.moments)}
                </ul>
            </article>

            <section class="detail-panel detail-panel--wide">
                <p class="detail-panel__eyebrow">Navigation</p>
                <h2 class="detail-panel__title">Sigue explorando</h2>
                <div class="detail-switcher">
                    ${buildSwitcherCard('Anterior', previousCharacter)}
                    ${buildSwitcherCard('Siguiente', nextCharacter)}
                </div>
            </section>

            <section class="detail-panel detail-panel--wide">
                <div class="detail-related__header">
                    <div>
                        <p class="detail-panel__eyebrow">Roster</p>
                        <h2 class="detail-panel__title">Otros personajes</h2>
                    </div>
                    <a href="index.html#characters" class="detail-text-link">VOLVER AL CARRUSEL</a>
                </div>
                <div class="detail-related__grid">
                    ${buildRelatedCards(character.slug)}
                </div>
            </section>
        </section>
    `;
}

function runDetailAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.from('.detail-hero__copy > *', {
        opacity: 0,
        y: 26,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out'
    });

    gsap.from('.detail-hero__visual', {
        opacity: 0,
        y: 32,
        scale: 0.96,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.utils.toArray('.detail-panel').forEach((panel) => {
        gsap.from(panel, {
            scrollTrigger: {
                trigger: panel,
                start: 'top 82%'
            },
            opacity: 0,
            y: 34,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
}

function initDetailPage() {
    if (!detailApp || detailCharacters.length === 0) {
        renderEmptyState();
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const requestedSlug = params.get('personaje');
    const fallbackCharacter = detailCharacters[0];
    const selectedCharacter = (window.getCharacterBySlug && requestedSlug)
        ? window.getCharacterBySlug(requestedSlug)
        : fallbackCharacter;
    const character = selectedCharacter || fallbackCharacter;
    const characterIndex = detailCharacters.findIndex((item) => item.slug === character.slug);

    if (requestedSlug !== character.slug) {
        window.history.replaceState({}, '', buildDetailUrl(character.slug));
    }

    document.title = `${character.name} | Blue Lock`;
    document.body.style.setProperty('--detail-accent', character.accent || '#2f8fff');

    renderCharacterDetail(character, characterIndex);
    runDetailAnimations();
}

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar || typeof gsap === 'undefined') return;

    gsap.to(navbar, {
        borderBottomColor: window.scrollY > 50 ? 'var(--detail-accent)' : 'var(--accent-red)',
        duration: 0.25
    });
});

initDetailPage();
