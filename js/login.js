// Gestion de la connexion

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    const loginError = document.getElementById('loginError');
    const loginSuccess = document.getElementById('loginSuccess');
    
    // Vérifier si l'utilisateur est déjà connecté
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        showWelcomeMessage(userData);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    

    
    // Validation en temps réel
    emailInput.addEventListener('blur', function() {
        validateEmailField(this);
    });
    
    passwordInput.addEventListener('blur', function() {
        validatePasswordField(this);
    });
    
    // Soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Masquer les messages précédents
        loginError.style.display = 'none';
        loginSuccess.style.display = 'none';
        
        // Valider les champs
        const emailValid = validateEmailField(emailInput);
        const passwordValid = validatePasswordField(passwordInput);
        
        if (!emailValid || !passwordValid) {
            loginError.style.display = 'block';
            
            const errors = [];
            if (!emailValid) errors.push('• Email invalide ou manquant');
            if (!passwordValid) errors.push('• Mot de passe requis');
            
            loginError.innerHTML = '<strong>✗ Erreurs dans le formulaire :</strong><br>' + errors.join('<br>');
            
            // Faire défiler vers le premier champ en erreur
            const firstError = form.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            
            return;
        }
        
        // Récupérer les données
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;
        
        // Vérifier les identifiants
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            loginError.style.display = 'block';
            loginError.innerHTML = '<strong>✗ Erreur de connexion</strong><br>Email ou mot de passe incorrect.';
            
            // Ajouter une animation d'erreur
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
            return;
        }
        
        // Connexion réussie
        // Sauvegarder l'utilisateur connecté
        const userSession = {
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            age: user.age,
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        

        
        // Afficher le message de succès
        showWelcomeMessage(userSession);
        
        // Désactiver le formulaire
        form.querySelectorAll('input, button').forEach(el => el.disabled = true);
        
        // Rediriger vers la page d'accueil
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
});

// Validation du champ email
function validateEmailField(field) {
    const email = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    field.classList.remove('is-valid', 'is-invalid');
    if (email) {
        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    }
    
    return isValid;
}

// Validation du champ mot de passe
function validatePasswordField(field) {
    const password = field.value;
    const isValid = password.length > 0;
    
    field.classList.remove('is-valid', 'is-invalid');
    if (password) {
        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    }
    
    return isValid;
}

// Afficher le message de bienvenue
function showWelcomeMessage(user) {
    const loginSuccess = document.getElementById('loginSuccess');
    const welcomeName = document.getElementById('welcomeName');
    
    welcomeName.textContent = `${user.prenom} ${user.nom}`;
    loginSuccess.style.display = 'block';
    
    // Animation de succès
    loginSuccess.classList.add('animate-fade-in');
}

// Animation shake pour les erreurs
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    .shake {
        animation: shake 0.5s;
    }
`;
document.head.appendChild(style);
