// Gestion de l'inscription

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Validation en temps réel
    form.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
                validateField(this);
            }
        });
        
        field.addEventListener('change', function() {
            if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
                validateField(this);
            }
        });
    });
    
    // Indicateur de force du mot de passe
    passwordInput.addEventListener('input', function() {
        updatePasswordStrength(this.value);
    });
    
    // Vérification de la confirmation du mot de passe
    confirmPasswordInput.addEventListener('input', function() {
        validatePasswordMatch();
    });
    
    // Soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Valider tous les champs
        let isValid = true;
        form.querySelectorAll('input[required], select[required]').forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        

        
        if (!isValid) {
            // Afficher un message d'erreur plus détaillé
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger mt-3';
            errorMessage.innerHTML = '<strong>⚠️ Erreurs dans le formulaire :</strong><br>';
            
            const errors = [];
            form.querySelectorAll('input[required], select[required]').forEach(field => {
                if (!field.value.trim() || field.classList.contains('is-invalid')) {
                    const label = form.querySelector(`label[for="${field.id}"]`).textContent;
                    errors.push(`• ${label.replace(' *', '')} est requis`);
                }
            });
            

            
            errorMessage.innerHTML += errors.join('<br>');
            
            // Supprimer l'ancien message d'erreur s'il existe
            const oldError = form.querySelector('.alert-danger');
            if (oldError) oldError.remove();
            
            // Ajouter le nouveau message
            form.appendChild(errorMessage);
            
            // Faire défiler vers le premier champ en erreur
            const firstError = form.querySelector('.is-invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            
            return;
        }
        
        // Récupérer les données
        const userData = {
            nom: document.getElementById('nom').value.trim(),
            prenom: document.getElementById('prenom').value.trim(),
            email: document.getElementById('email').value.trim().toLowerCase(),
            telephone: document.getElementById('telephone').value.trim(),
            password: document.getElementById('password').value,
            age: document.getElementById('age').value,
            newsletter: false,
            dateInscription: new Date().toISOString()
        };
        
        // Vérifier si l'email existe déjà
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const emailExists = users.some(user => user.email === userData.email);
        
        if (emailExists) {
            alert('❌ Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.');
            return;
        }
        
        // Enregistrer l'utilisateur
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Afficher le message de succès
        const successMessage = document.getElementById('successMessage');
        successMessage.style.display = 'block';
        successMessage.innerHTML = `
            <strong>✓ Inscription réussie !</strong><br>
            Bienvenue ${userData.prenom} ${userData.nom} !<br>
            Vous allez être redirigé vers la page de connexion...
        `;
        
        // Désactiver le formulaire
        form.querySelectorAll('input, button').forEach(el => el.disabled = true);
        
        // Rediriger vers la page de connexion
        setTimeout(() => {
            window.location.href = 'connexion.html';
        }, 2500);
    });
});

// Validation d'un champ
function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    let isValid = true;
    
    // Réinitialiser les classes
    field.classList.remove('is-valid', 'is-invalid');
    
    switch(fieldId) {
        case 'nom':
        case 'prenom':
            isValid = validateName(value);
            break;
            
        case 'email':
            isValid = validateEmail(value);
            break;
            
        case 'telephone':
            isValid = validatePhone(value);
            break;
            
        case 'password':
            isValid = validatePassword(value);
            break;
            
        case 'confirmPassword':
            isValid = validatePasswordMatch();
            break;
            
        case 'age':
            isValid = validateAge(value);
            break;
    }
    
    // Vérifier si le champ requis est vide
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    // Validation supplémentaire pour les champs requis
    if (field.hasAttribute('required') && value && !isValid) {
        // Le champ est rempli mais invalide
        isValid = false;
    }
    
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    return isValid;
}

// Validation du nom/prénom
function validateName(name) {
    const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,}$/;
    return nameRegex.test(name);
}

// Validation de l'email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validation du téléphone
function validatePhone(phone) {
    const phoneRegex = /^[0-9]{8}$/;
    const cleanPhone = phone.replace(/[\s\-\.]/g, '');
    return phoneRegex.test(cleanPhone);
}

// Validation du mot de passe
function validatePassword(password) {
    return password.length >= 8;
}

// Validation de l'âge
function validateAge(age) {
    return age && age.trim() !== '';
}

// Vérification de la correspondance des mots de passe
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmField = document.getElementById('confirmPassword');
    
    if (!confirmPassword) {
        return false;
    }
    
    const isMatch = password === confirmPassword;
    confirmField.classList.remove('is-valid', 'is-invalid');
    confirmField.classList.add(isMatch ? 'is-valid' : 'is-invalid');
    
    return isMatch;
}

// Mise à jour de l'indicateur de force du mot de passe
function updatePasswordStrength(password) {
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (!password) {
        strengthIndicator.className = 'password-strength';
        return;
    }
    
    let strength = 0;
    
    // Critères de force
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    // Appliquer la classe appropriée
    strengthIndicator.className = 'password-strength';
    
    if (strength <= 2) {
        strengthIndicator.classList.add('weak');
    } else if (strength <= 3) {
        strengthIndicator.classList.add('medium');
    } else {
        strengthIndicator.classList.add('strong');
    }
}


