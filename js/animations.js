// Animations et effets visuels supplémentaires

document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initHoverEffects();
    initNavbarScroll();
});

// Animation de révélation au scroll
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Éléments à animer
    const elements = document.querySelectorAll(`
        .mission-card,
        .timeline-item,
        .center-card,
        .infographic-card,
        .video-card,
        .event-card,
        .testimonial-card,
        .gallery-item
    `);
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Effets hover améliorés
function initHoverEffects() {
    // Cartes avec effet de levée
    const cards = document.querySelectorAll(`
        .mission-card,
        .center-card,
        .event-card,
        .video-card,
        .info-box
    `);
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Boutons avec effet de pulsation
    const buttons = document.querySelectorAll('.btn-primary, .btn-outline-primary');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.5s ease';
        });
        
        button.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
}

// Navbar avec effet au scroll
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            navbar.style.background = '#ffffff';
        }
        
        lastScroll = currentScroll;
    });
}

// Animation de pulsation pour les boutons
const pulseAnimation = document.createElement('style');
pulseAnimation.textContent = `
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(pulseAnimation);

// Effet de particules sur le hero (optionnel)
function createParticles() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    
    const particlesCount = 20;
    
    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: rgba(232, 62, 140, ${Math.random() * 0.3 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-particle ${Math.random() * 10 + 10}s infinite ease-in-out;
            pointer-events: none;
        `;
        hero.appendChild(particle);
    }
}

// Animation des particules
const particleAnimation = document.createElement('style');
particleAnimation.textContent = `
    @keyframes float-particle {
        0%, 100% {
            transform: translate(0, 0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        50% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
        }
    }
`;
document.head.appendChild(particleAnimation);

// Effet de typing pour les titres (optionnel)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Compteur animé pour les statistiques d'impact
function animateImpactStats() {
    const impactNumbers = document.querySelectorAll('.impact-number');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateNumber(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    impactNumbers.forEach(num => observer.observe(num));
}

function animateNumber(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const hasEuro = text.includes('€');
    const hasK = text.includes('K');
    const hasM = text.includes('M');
    
    let target = parseInt(text.replace(/[^0-9]/g, ''));
    
    if (hasK) target *= 1000;
    if (hasM) target *= 1000000;
    
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        
        if (hasK) {
            displayValue = Math.floor(current / 1000) + 'K';
        } else if (hasM) {
            displayValue = (current / 1000000).toFixed(1) + 'M';
        } else if (hasEuro) {
            displayValue = Math.floor(current / 1000000) + 'M';
        }
        
        element.textContent = displayValue + (hasPlus ? '+' : '') + (hasPercent ? '%' : '') + (hasEuro ? '€' : '');
    }, 16);
}

// Initialiser les animations d'impact
setTimeout(animateImpactStats, 500);

// Effet de parallaxe sur les sections
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    
    // Parallaxe sur le hero
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    // Parallaxe sur les cartes
    const cards = document.querySelectorAll('.mission-card, .event-card');
    cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const offset = (window.innerHeight - rect.top) * 0.05;
            card.style.transform = `translateY(${offset}px)`;
        }
    });
});
