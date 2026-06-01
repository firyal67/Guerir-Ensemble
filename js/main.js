// Main JavaScript - Gestion utilisateur et navigation

// Vérifier si l'utilisateur est connecté au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    checkUserLogin();
    initScrollAnimations();
    initStatsCounter();
});

// Vérifier l'état de connexion
function checkUserLogin() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        updateNavForLoggedInUser(userData);
    }
}

// Mettre à jour la navigation pour un utilisateur connecté
function updateNavForLoggedInUser(userData) {
    // Masquer les liens Inscription et Connexion
    const inscriptionLink = document.querySelector('a[href="inscription.html"]');
    const connexionLink = document.querySelector('a[href="connexion.html"]');
    
    if (inscriptionLink && inscriptionLink.parentElement) {
        inscriptionLink.parentElement.style.display = 'none';
    }
    if (connexionLink && connexionLink.parentElement) {
        connexionLink.parentElement.style.display = 'none';
    }
    
    // Afficher le menu utilisateur
    const userMenuContainer = document.getElementById('userMenuContainer');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if (userMenuContainer && userNameDisplay) {
        userMenuContainer.style.display = 'block';
        userNameDisplay.textContent = `${userData.prenom} ${userData.nom}`;
    }
    
    // Ajouter l'événement de déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Fonction de déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '/';
    }
}

// Animation au scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observer les éléments
    const elements = document.querySelectorAll('.mission-card, .center-card, .event-card, .video-card');
    elements.forEach(el => observer.observe(el));
}

// Compteur animé pour les statistiques
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Animation du compteur
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Formater le nombre selon le type
        const targetStr = element.getAttribute('data-target');
        if (targetStr.includes('%')) {
            element.textContent = Math.floor(current) + '%';
        } else if (targetStr.includes('/')) {
            element.textContent = targetStr;
        } else if (targetStr.includes('+')) {
            element.textContent = Math.floor(current) + '+';
        } else {
            element.textContent = Math.floor(current).toLocaleString('fr-FR');
        }
    }, 16);
}

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fermer le menu mobile après clic
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', function() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
        }
    });
});

// Fonction pour rechercher des centres (simulée)
function searchCenters() {
    const city = document.getElementById('citySearch').value.trim();
    const centersContainer = document.getElementById('centersContainer');
    
    if (!city) {
        alert('Veuillez entrer une ville');
        return;
    }
    
    // Simulation de recherche
    centersContainer.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Recherche en cours pour : ' + city + '...</p></div>';
    
    setTimeout(() => {
        centersContainer.innerHTML = `
            <div class="col-md-4 mb-4">
                <div class="center-card">
                    <h5>Centre de Dépistage ${city}</h5>
                    <p class="text-muted">📍 Adresse principale, ${city}</p>
                    <p>📞 01 23 45 67 89</p>
                    <button class="btn btn-sm btn-outline-primary">Prendre RDV</button>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="center-card">
                    <h5>Clinique ${city} Centre</h5>
                    <p class="text-muted">📍 Avenue centrale, ${city}</p>
                    <p>📞 01 98 76 54 32</p>
                    <button class="btn btn-sm btn-outline-primary">Prendre RDV</button>
                </div>
            </div>
        `;
    }, 1000);
}

// Effet parallaxe léger
window.addEventListener('scroll', function() {
    const ribbon = document.querySelector('.ribbon-animation');
    if (ribbon) {
        const scrolled = window.pageYOffset;
        ribbon.style.transform = `translateY(${scrolled * 0.1}px) rotate(${scrolled * 0.02}deg)`;
    }
});
