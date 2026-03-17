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

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    menuBtn.textContent = mobileMenu.classList.contains('active') ? 'CLOSE' : 'MENU';
    
    if (mobileMenu.classList.contains('active')) {
        // Menu is opening
        gsap.to('.mobile-menu a', {
            opacity: 1,
            x: 0,
            stagger: 0.05,
            duration: 0.4,
            delay: 0.1
        });
    } else {
        // Menu is closing
        gsap.killTweensOf('.mobile-menu a');
    }
});

// Close menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuBtn.textContent = 'MENU';
    });
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

document.addEventListener('mousemove', (e) => {
    const heroSection = document.querySelector('.hero');
    const rect = heroSection.getBoundingClientRect();
    
    if (e.clientY > rect.top && e.clientY < rect.bottom) {
        targetX = (e.clientX / window.innerWidth - 0.5) * 25;
        targetY = (e.clientY / window.innerHeight - 0.5) * 25;
    }
});

setInterval(() => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    
    gsap.set('.carousel-items', {
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
    gsap.to(menuBtn, {
        letterSpacing: '3px',
        duration: 0.3
    });
});

menuBtn.addEventListener('mouseleave', () => {
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