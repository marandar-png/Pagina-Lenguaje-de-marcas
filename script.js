gsap.registerPlugin(ScrollTrigger);

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Hero text reveal with stagger
    tl.to(".reveal-text", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15
    }, 0)
    .to(".red-line", {
        width: "100%",
        duration: 1.2,
        ease: "power2.out"
    }, 0.3)
    .to(".description.fade-in", {
        opacity: 1,
        y: 0,
        duration: 1
    }, 0.5)
    .to(".carousel-items", {
        opacity: 1,
        scale: 1,
        duration: 1.2
    }, 0);
});

// ===== Menu Toggle =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuBackground = document.querySelector('.mobile-menu__bg');
const menuCover = document.getElementById('menuCover');
const menuContent = document.querySelector('.mobile-menu__content');
const menuLinks = Array.from(document.querySelectorAll('.mobile-menu a'));
const compactMenuMedia = window.matchMedia('(max-width: 768px), (pointer: coarse)');
let menuTimeline;
let isMenuOpen = false;
let isMenuAnimating = false;
let menuInteractionLockedUntil = 0;

function usesCompactMenuEffects() {
    return compactMenuMedia.matches;
}

function isMenuInteractionLocked() {
    return Date.now() < menuInteractionLockedUntil;
}

function lockMenuInteraction(duration = 450) {
    menuInteractionLockedUntil = Date.now() + duration;
}

function buildMenuCoverGrid() {
    if (!menuCover || menuCover.children.length > 0) return;

    const fragment = document.createDocumentFragment();
    const columns = usesCompactMenuEffects() ? 6 : 10;
    const rows = usesCompactMenuEffects() ? 9 : 15;

    for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < columns; col += 1) {
            const cell = document.createElement('span');
            cell.className = 'mobile-menu__cover-cell';
            cell.style.setProperty('--delay', `${usesCompactMenuEffects() ? 0.08 + row * 0.018 : 0.2 + row * 0.025}s`);
            fragment.appendChild(cell);
        }
    }

    menuCover.appendChild(fragment);
}

function wrapMenuLinkText() {
    menuLinks.forEach((link) => {
        const label = (link.dataset.label || link.textContent).trim();
        link.dataset.label = label;
        link.setAttribute('aria-label', label);
        link.innerHTML = '';

        const labelWrapper = document.createElement('span');
        labelWrapper.className = 'menu-link-label';

        [...label].forEach((char) => {
            const span = document.createElement('span');
            span.className = 'menu-link-char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            labelWrapper.appendChild(span);
        });

        link.appendChild(labelWrapper);
    });
}

function syncMenuButton() {
    menuBtn.textContent = isMenuOpen ? 'CLOSE' : 'MENU';
    menuBtn.setAttribute('aria-expanded', String(isMenuOpen));
    menuBtn.classList.toggle('is-active', isMenuOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isMenuOpen));
}

function resetMenuAnimatedState() {
    gsap.set(menuBackground, { clearProps: 'opacity' });
    gsap.set(menuContent, { clearProps: 'opacity,transform' });
    gsap.set('.mobile-menu a', { clearProps: 'opacity,transform' });
    gsap.set('.menu-link-char', { clearProps: 'opacity,transform' });
    gsap.set(mobileMenu, { clearProps: 'opacity,transform' });
}

function createMenuTransition(isOpening) {
    if (menuTimeline) menuTimeline.kill();
    gsap.killTweensOf([mobileMenu, menuBackground, menuContent, '.mobile-menu a', '.menu-link-char', menuBtn]);

    const compactEffects = usesCompactMenuEffects();

    if (isOpening) {
        document.body.classList.add('menu-open');
        mobileMenu.classList.add('is-visible');
        mobileMenu.classList.remove('is-open');
        mobileMenu.classList.toggle('is-compact', compactEffects);

        gsap.set(mobileMenu, {
            yPercent: 0,
            opacity: 1
        });
        gsap.set(menuBackground, { opacity: 0 });
        gsap.set(menuContent, {
            opacity: 1,
            yPercent: compactEffects ? -1.5 : -2.5
        });
        gsap.set('.mobile-menu a', { opacity: 0, x: compactEffects ? 16 : 24 });
        gsap.set('.menu-link-char', { opacity: 0, y: compactEffects ? 10 : 16 });

        menuTimeline = gsap.timeline({
            defaults: { ease: 'power3.out' },
            onComplete: () => {
                isMenuAnimating = false;
            }
        });

        menuTimeline
            .to(menuBtn, {
                letterSpacing: compactEffects ? '3px' : '4px',
                duration: compactEffects ? 0.2 : 0.28
            }, 0)
            .call(() => {
                mobileMenu.classList.add('is-open');
            }, [], 0.02)
            .to(menuBackground, {
                opacity: 1,
                duration: compactEffects ? 0.24 : 0.34,
                ease: 'power2.out'
            }, 0)
            .to(menuContent, {
                yPercent: 0,
                duration: compactEffects ? 0.24 : 0.34,
                ease: compactEffects ? 'power2.out' : 'expo.out'
            }, 0)
            .fromTo('.mobile-menu a', {
                opacity: 0,
                x: compactEffects ? 16 : 24
            }, {
                opacity: 1,
                x: 0,
                stagger: compactEffects ? 0.035 : 0.05,
                duration: compactEffects ? 0.26 : 0.34,
                ease: 'power3.out'
            }, compactEffects ? 0.05 : 0.1)
            .to('.menu-link-char', {
                opacity: 1,
                y: 0,
                stagger: compactEffects ? 0.008 : 0.012,
                duration: compactEffects ? 0.2 : 0.26,
                ease: 'power3.out'
            }, compactEffects ? 0.08 : 0.12);

        return;
    }

    menuTimeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onComplete: () => {
            mobileMenu.classList.remove('is-open');
            mobileMenu.classList.remove('is-visible');
            document.body.classList.remove('menu-open');
            resetMenuAnimatedState();
            isMenuAnimating = false;
        }
    });

    menuTimeline
        .to('.menu-link-char', {
            opacity: 0,
            y: 12,
            stagger: {
                each: compactEffects ? 0.004 : 0.006,
                from: 'end'
            },
            duration: compactEffects ? 0.12 : 0.18
        }, 0)
        .to('.mobile-menu a', {
            opacity: 0,
            x: compactEffects ? 14 : 20,
            stagger: {
                each: compactEffects ? 0.02 : 0.03,
                from: 'end'
            },
            duration: compactEffects ? 0.12 : 0.18
        }, 0)
        .to(menuContent, {
            yPercent: compactEffects ? -1.5 : -2.5,
            duration: compactEffects ? 0.2 : 0.3,
            ease: compactEffects ? 'power2.in' : 'expo.in'
        }, 0.03)
        .to(menuBtn, {
            letterSpacing: '1px',
            duration: compactEffects ? 0.18 : 0.25
        }, 0)
        .to(menuBackground, {
            opacity: 0,
            duration: compactEffects ? 0.2 : 0.3,
            ease: compactEffects ? 'power2.in' : 'expo.in'
        }, 0.03)
        .to(mobileMenu, {
            opacity: 0,
            duration: compactEffects ? 0.18 : 0.26,
            ease: 'power2.in'
        }, 0.03);
}

function openMenu() {
    if (isMenuOpen || isMenuAnimating || isMenuInteractionLocked()) return;

    lockMenuInteraction();
    isMenuAnimating = true;
    isMenuOpen = true;
    syncMenuButton();
    createMenuTransition(true);
}

function closeMenu() {
    if (!isMenuOpen || isMenuAnimating || isMenuInteractionLocked()) return;

    lockMenuInteraction();
    isMenuAnimating = true;
    isMenuOpen = false;
    syncMenuButton();
    createMenuTransition(false);
}

function toggleMenu() {
    if (isMenuInteractionLocked()) return;

    if (isMenuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

buildMenuCoverGrid();
wrapMenuLinkText();
syncMenuButton();

function handleMenuButtonPress(e) {
    e.preventDefault();
    e.stopPropagation();

    if (isMenuInteractionLocked()) return;

    if (isMenuOpen) {
        closeMenu();
        return;
    }

    openMenu();
}

menuBtn.addEventListener('pointerdown', handleMenuButtonPress);
menuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMenu();
    }
});

document.addEventListener('click', (e) => {
    if (!isMenuOpen || isMenuAnimating || isMenuInteractionLocked()) return;

    const clickedInsideMenu = e.target.closest('#mobileMenu');
    const clickedMenuButton = e.target.closest('#menuBtn');

    if (!clickedInsideMenu && !clickedMenuButton) {
        closeMenu();
    }
});

// ===== Carousel Functionality with Animations =====
const carouselImages = document.querySelectorAll('.carousel-img');
const carouselThumbs = document.querySelectorAll('.thumb');
let currentImageIndex = 0;
const autoPlayInterval = 5000; // 5 seconds
let carouselTimeline;

function showImage(index) {
    // Kill previous animation
    if (carouselTimeline) carouselTimeline.kill();
    carouselTimeline = gsap.timeline();

    // Fade out current image with scale
    carouselTimeline.to('.carousel-img.active', {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: "power2.inOut"
    }, 0);

    // Update active classes
    carouselImages.forEach(img => img.classList.remove('active'));
    carouselThumbs.forEach(thumb => thumb.classList.remove('active'));
    carouselImages[index].classList.add('active');
    carouselThumbs[index].classList.add('active');

    // Fade in new image with scale
    carouselTimeline.to(carouselImages[index], {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.inOut"
    }, 0);

    // Animate thumbnail bar
    carouselTimeline.to('.thumb.active', {
        width: 80,
        duration: 0.6,
        ease: "power3.out"
    }, 0.1);

    currentImageIndex = index;
}

// Thumbnail click handlers with animation
carouselThumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
        const index = parseInt(thumb.dataset.index);
        if (index !== currentImageIndex) {
            showImage(index);
        }
    });
    
    // Hover animation
    thumb.addEventListener('mouseenter', () => {
        gsap.to(thumb, {
            backgroundColor: 'var(--accent-red)',
            duration: 0.3
        });
    });
    
    thumb.addEventListener('mouseleave', () => {
        if (!thumb.classList.contains('active')) {
            gsap.to(thumb, {
                backgroundColor: 'var(--border-color)',
                duration: 0.3
            });
        }
    });
});

// Auto-play carousel
setInterval(() => {
    const nextIndex = (currentImageIndex + 1) % carouselImages.length;
    showImage(nextIndex);
}, autoPlayInterval);

// ===== Characters Section =====
const charactersTrack = document.getElementById('charactersTrack');
const charactersSwiperElement = document.getElementById('charactersSwiper');
const charactersStage = document.getElementById('charactersStage');
const characterPrev = document.getElementById('characterPrev');
const characterNext = document.getElementById('characterNext');
const charactersPagination = document.getElementById('charactersPagination');
const charactersData = Array.isArray(window.charactersData) ? window.charactersData : [];

let charactersSwiperInstance;

function padCharacterNumber(value) {
    return String(value).padStart(2, '0');
}

function buildAnimatedCharacters(text, className) {
    return [...text].map((char, index) => {
        const isSpace = char === ' ';
        const classes = [className];

        if (isSpace) {
            classes.push('character-slide__space');
        }

        return `<span class="${classes.join(' ')}" style="--char-delay:${index};">${isSpace ? '&nbsp;' : char}</span>`;
    }).join('');
}

function buildAnimatedLines(lines, lineClass, wordClass) {
    return lines.map((line) => `
        <span class="${lineClass}">
            ${buildAnimatedCharacters(line, wordClass)}
        </span>
    `).join('');
}

function buildCharacterDetailUrl(character) {
    return `personaje.html?personaje=${encodeURIComponent(character.slug)}`;
}

function buildCharacterSlide(character, index) {
    const nameLines = character.name.toUpperCase().split(' ');
    const accent = character.accent || '#2f8fff';
    const detailUrl = buildCharacterDetailUrl(character);

    return `
        <div class="swiper-slide" data-character-index="${index}">
            <article class="character-slide" aria-label="${character.name}" style="--character-accent:${accent};">
                <div class="character-slide__base-shell">
                    <span class="character-slide__frame" aria-hidden="true"></span>
                    <div class="character-slide__base">
                        <img
                            src="${character.image}"
                            alt=""
                            class="character-slide__base-img"
                            style="object-position:${character.basePosition};"
                        >
                    </div>
                </div>

                <div class="character-slide__visual" aria-hidden="true">
                    <figure class="character-slide__visual-img">
                        <img
                            src="${character.image}"
                            alt=""
                            style="object-position:${character.visualPosition};"
                        >
                    </figure>
                </div>

                <div class="character-slide__content">
                    <div class="character-slide__inner">
                        <span class="character-slide__meta">${character.role}</span>
                        <p class="character-slide__catch">
                            ${buildAnimatedLines(
                                character.catchLines,
                                'character-slide__catch-text',
                                'character-slide__catch-word'
                            )}
                        </p>
                        <h4 class="character-slide__title">
                            ${buildAnimatedLines(
                                nameLines,
                                'character-slide__title-line',
                                'character-slide__title-word'
                            )}
                        </h4>
                        <p class="character-slide__voice">
                            ${buildAnimatedCharacters(character.voice.toUpperCase(), 'character-slide__voice-word')}
                        </p>
                        <span class="character-slide__cta">OPEN FILE</span>
                    </div>
                </div>
                <a class="character-slide__link" href="${detailUrl}" aria-label="Abrir la ficha de ${character.name}"></a>
            </article>
        </div>
    `;
}

function updateCharactersPagination(index) {
    if (!charactersPagination) return;

    charactersPagination.innerHTML = `
        <span class="characters-pagination__text characters-pagination__text--current">${padCharacterNumber(index + 1)}</span>
        <span class="characters-pagination__divider">/</span>
        <span class="characters-pagination__text">${padCharacterNumber(charactersData.length)}</span>
    `;
}

function toggleCharactersStageActive(isActive) {
    if (!charactersStage) return;
    charactersStage.classList.toggle('is-scroll-active', isActive);
}

function syncCharactersState(swiper) {
    if (!swiper) return;
    updateCharactersPagination(swiper.realIndex);
}

function clearCharacterTargetState(swiper) {
    if (!swiper || !swiper.slides) return;

    Array.from(swiper.slides).forEach((slide) => {
        slide.classList.remove('is-target');
    });
}

function clearCharacterEnteringState(swiper) {
    if (!swiper || !swiper.slides) return;

    Array.from(swiper.slides).forEach((slide) => {
        slide.classList.remove('is-entering-target');
    });
}

function setCharacterTargetState(swiper) {
    if (!swiper || !swiper.slides) return;

    clearCharacterTargetState(swiper);

    const targetSlide = swiper.slides[swiper.activeIndex];
    if (targetSlide) {
        targetSlide.classList.add('is-target');
    }
}

function setCharacterEnteringState(swiper) {
    if (!swiper || !swiper.slides) return;

    clearCharacterEnteringState(swiper);

    const enteringSlide = swiper.slides[swiper.activeIndex];
    if (enteringSlide) {
        enteringSlide.classList.add('is-entering-target');
    }
}

function renderCharactersSection() {
    if (
        !charactersTrack ||
        !charactersSwiperElement ||
        !characterPrev ||
        !characterNext ||
        charactersData.length === 0 ||
        typeof Swiper === 'undefined'
    ) {
        return;
    }

    charactersTrack.innerHTML = charactersData.map(buildCharacterSlide).join('');

    charactersSwiperInstance = new Swiper(charactersSwiperElement, {
        speed: 350,
        slidesPerView: 2,
        spaceBetween: 0,
        loop: charactersData.length > 1,
        centeredSlides: true,
        followFinger: false,
        preloadImages: false,
        watchSlidesProgress: true,
        slideActiveClass: 'is-current',
        slideDuplicateActiveClass: 'is-current is-clone',
        slideNextClass: 'is-next',
        slideDuplicateNextClass: 'is-clone',
        slidePrevClass: 'is-prev',
        slideDuplicatePrevClass: 'is-clone',
        navigation: {
            nextEl: characterNext,
            prevEl: characterPrev
        },
        breakpoints: {
            961: {
                slidesPerView: 3.15
            }
        },
        on: {
            init(swiper) {
                syncCharactersState(swiper);
                setCharacterTargetState(swiper);
            },
            slideChangeTransitionStart(swiper) {
                syncCharactersState(swiper);
                clearCharacterTargetState(swiper);
                setCharacterEnteringState(swiper);
            },
            slideChangeTransitionEnd(swiper) {
                clearCharacterEnteringState(swiper);
                setCharacterTargetState(swiper);
            }
        }
    });

    if (charactersStage) {
        ScrollTrigger.create({
            trigger: charactersStage,
            start: 'top 78%',
            onEnter: () => toggleCharactersStageActive(true),
            onEnterBack: () => toggleCharactersStageActive(true)
        });
    }

    gsap.from('.characters-header > *', {
        scrollTrigger: {
            trigger: '.characters-section',
            start: 'top 78%'
        },
        opacity: 0,
        y: 28,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out'
    });

    gsap.from('.characters-swiper .swiper-slide', {
        scrollTrigger: {
            trigger: '.characters-stage',
            start: 'top 82%'
        },
        opacity: 0,
        y: 46,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
    });
}

renderCharactersSection();

// ===== Age Verification =====
const ageModal = document.getElementById('ageModal');
const ageInput = document.getElementById('ageInput');
const ageConfirm = document.getElementById('ageConfirm');
const minAge = 13;

function checkAge() {
    const age = parseInt(ageInput.value);
    
    if (isNaN(age) || age < 0 || age > 150) {
        alert('Please enter a valid age');
        return;
    }
    
    if (age >= minAge) {
        gsap.to('.age-check-content', {
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
            onComplete: () => {
                localStorage.setItem('ageVerified', 'true');
                ageModal.classList.remove('active');
            }
        });
    } else {
        alert(`You must be at least ${minAge} years old to access this content.`);
    }
}

ageConfirm.addEventListener('click', checkAge);
ageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAge();
});

// Show age verification on first visit with animation
if (!localStorage.getItem('ageVerified')) {
    ageModal.classList.add('active');
    gsap.from('.age-check-content', {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: "back.out"
    });
}

// ===== Scroll Animations =====
// Spec items animation with alternating direction
gsap.utils.toArray(".spec-item").forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "top 60%",
            scrub: 0.5
        },
        opacity: 0,
        y: 50,
        x: index % 2 === 0 ? -30 : 30,
        duration: 1
    });
});

// Section fade-in on scroll
gsap.utils.toArray(".platforms-section, .social-section").forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%"
        },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out"
    });
});

// Platform buttons stagger animation
gsap.from(".platform-btn", {
    scrollTrigger: {
        trigger: ".platforms-section",
        start: "top 70%"
    },
    opacity: 0,
    y: 20,
    stagger: 0.2,
    duration: 0.8
});

// Social buttons animation
gsap.from(".social-btn", {
    scrollTrigger: {
        trigger: ".social-section",
        start: "top 75%"
    },
    opacity: 0,
    scale: 0.8,
    stagger: 0.15,
    duration: 0.8,
    ease: "back.out"
});

// ===== Mouse Parallax Effect =====
let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
const heroSection = document.querySelector('.hero');
const carouselContainer = document.querySelector('.carousel-container');
const mobileParallaxMedia = window.matchMedia('(max-width: 768px)');

function resetCarouselParallax() {
    targetX = 0;
    targetY = 0;
    currentX = 0;
    currentY = 0;

    if (carouselContainer) {
        gsap.set(carouselContainer, { x: 0, y: 0 });
    }
}

document.addEventListener('mousemove', (e) => {
    if (!heroSection || !carouselContainer || mobileParallaxMedia.matches) return;

    const rect = heroSection.getBoundingClientRect();
    const isPointerInsideHero = e.clientY > rect.top && e.clientY < rect.bottom;

    if (isPointerInsideHero) {
        targetX = (e.clientX / window.innerWidth - 0.5) * 25;
        targetY = (e.clientY / window.innerHeight - 0.5) * 25;
    } else {
        targetX = 0;
        targetY = 0;
    }
});

mobileParallaxMedia.addEventListener('change', () => {
    if (mobileParallaxMedia.matches) {
        resetCarouselParallax();
    }
});

setInterval(() => {
    if (!carouselContainer) return;

    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    gsap.set(carouselContainer, {
        x: currentX,
        y: currentY,
        duration: 0.05
    });
}, 30);

// ===== Button Animations =====
// Platform button hover effects
document.querySelectorAll('.platform-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            x: -5,
            boxShadow: '0 0 30px rgba(255, 0, 68, 0.5)',
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            boxShadow: '0 0 0px rgba(255, 0, 68, 0)',
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Social button animations
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            scale: 1.2,
            duration: 0.3,
            ease: "back.out"
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            scale: 1,
            duration: 0.3,
            ease: "back.out"
        });
    });
});

// Menu button animation
menuBtn.addEventListener('mouseenter', () => {
    if (isMenuOpen) return;
    gsap.to(menuBtn, {
        letterSpacing: '3px',
        duration: 0.3
    });
});

menuBtn.addEventListener('mouseleave', () => {
    if (isMenuOpen) return;
    gsap.to(menuBtn, {
        letterSpacing: '1px',
        duration: 0.3
    });
});

// ===== Scroll Navbar Background =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        gsap.to(navbar, {
            borderBottomColor: 'var(--accent-red)',
            duration: 0.3
        });
    } else {
        gsap.to(navbar, {
            borderBottomColor: 'var(--border-color)',
            duration: 0.3
        });
    }
});

// ===== User Registration System =====
const registrationPanel = document.getElementById('registrationPanel');
const registrationToggle = document.getElementById('registrationToggle');
const registrationForm = document.getElementById('registrationForm');
const registrationMessage = document.getElementById('registrationMessage');
const registerMenuLink = document.getElementById('registerMenuLink');

// Open Registration Panel from Menu
registerMenuLink.addEventListener('click', (e) => {
    e.preventDefault();
    closeMenu();
    registrationPanel.classList.add('active');
    gsap.from(registrationPanel, {
        x: 350,
        opacity: 0,
        duration: 0.4,
        ease: "power3.out"
    });
    document.getElementById('username').focus();
});

registrationToggle.addEventListener('click', () => {
    gsap.to(registrationPanel, {
        x: 350,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => {
            registrationPanel.classList.remove('active');
        }
    });
});

// Handle Registration Form Submission
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const age = parseInt(document.getElementById('age').value);

    // Validación del lado del cliente
    if (!username || !email || !password || !age) {
        showRegistrationMessage('Por favor, completa todos los campos', 'error');
        return;
    }

    if (age < 18) {
        showRegistrationMessage('Debes tener 18 años o más', 'error');
        return;
    }

    // Intentar registrar al usuario
    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
                age
            })
        });

        const data = await response.json();

        if (data.success) {
            showRegistrationMessage('¡Registrado exitosamente! 🎉', 'success');
            
            // Limpiar formulario
            registrationForm.reset();
            
            // Cerrar panel después de 2 segundos
            setTimeout(() => {
                gsap.to(registrationPanel, {
                    x: 350,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power3.in",
                    onComplete: () => {
                        registrationPanel.classList.remove('active');
                        registrationMessage.classList.remove('success');
                    }
                });
            }, 2000);
        } else {
            showRegistrationMessage(data.message || 'Error en el registro', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showRegistrationMessage('Error de conexión. Asegúrate de que el servidor está ejecutándose.', 'error');
    }
});

function showRegistrationMessage(message, type) {
    registrationMessage.textContent = message;
    registrationMessage.className = `registration-message ${type}`;
    
    gsap.from(registrationMessage, {
        opacity: 0,
        y: -10,
        duration: 0.3
    });
}
