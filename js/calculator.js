// Calculateur de rappel de dépistage
document.addEventListener('DOMContentLoaded', function() {
    const calculatorForm = document.getElementById('screeningCalculator');
    
    if (calculatorForm) {
        // Validation en temps réel
        calculatorForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('blur', function() {
                validateCalculatorField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
                    validateCalculatorField(this);
                }
            });
        });
        
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Valider tous les champs
            let isValid = true;
            const errorDiv = document.getElementById('calculatorError');
            const errorList = document.getElementById('calculatorErrorList');
            const errors = [];
            
            calculatorForm.querySelectorAll('input[required]').forEach(input => {
                if (!validateCalculatorField(input)) {
                    isValid = false;
                    const label = calculatorForm.querySelector(`label[for="${input.id}"]`).textContent;
                    errors.push(`• ${label.replace(' *', '')} est requis`);
                }
            });
            
            if (!isValid) {
                errorList.innerHTML = errors.join('<br>');
                errorDiv.style.display = 'block';
                
                // Faire défiler vers le premier champ en erreur
                const firstError = calculatorForm.querySelector('.is-invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
                return;
            }
            // Masquer les erreurs et calculer
            errorDiv.style.display = 'none';
            calculateScreeningRecommendation();
        });
    }
});

function calculateScreeningRecommendation() {
    const birthYear = parseInt(document.getElementById('birthYear').value);
    const lastScreeningDate = document.getElementById('lastScreening').value;
    const resultDiv = document.getElementById('calculatorResult');
    const recommendationText = document.getElementById('recommendationText');
    
    // Calculer l'âge actuel
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    
    if (age < 0 || age > 120) {
        alert('Veuillez entrer une année de naissance valide');
        return;
    }
    
    let recommendation = '';
    let urgency = 'info';
    // Déterminer la recommandation selon l'âge
    if (age < 25) {
        recommendation = `
            <strong>Âge : ${age} ans</strong><br><br>
            À votre âge, le dépistage systématique n'est généralement pas recommandé.<br><br>
            <strong>Recommandations :</strong><br>
            • Effectuez un auto-examen mensuel<br>
            • Consultez votre médecin en cas d'anomalie<br>
            • Informez-vous sur les facteurs de risque
        `;
    } else if (age < 40) {
        recommendation = `
            <strong>Âge : ${age} ans</strong><br><br>
            Le dépistage systématique n'est pas encore recommandé, sauf facteurs de risque particuliers.<br><br>
            <strong>Recommandations :</strong><br>
            • Auto-examen mensuel<br>
            • Consultation médicale annuelle<br>
            • Discutez avec votre médecin si vous avez des antécédents familiaux
        `;
    } else if (age < 50) {
        recommendation = `
            <strong>Âge : ${age} ans</strong><br><br>
            Vous approchez de l'âge recommandé pour le dépistage systématique.<br><br>
            <strong>Recommandations :</strong><br>
            • Auto-examen mensuel<br>
            • Consultation médicale annuelle avec examen clinique<br>
            • Préparez-vous au dépistage systématique à partir de 50 ans<br>
            • Parlez à votre médecin si vous avez des facteurs de risque
        `;
        urgency = 'warning';
    } else if (age <= 74) {
        // Vérifier la date du dernier dépistage
        if (lastScreeningDate) {
            const lastScreening = new Date(lastScreeningDate);
            const today = new Date();
            const monthsSinceScreening = Math.floor((today - lastScreening) / (1000 * 60 * 60 * 24 * 30));
            
            if (monthsSinceScreening < 24) {
                recommendation = `
                    <strong>Âge : ${age} ans</strong><br><br>
                    Votre dernier dépistage date de ${monthsSinceScreening} mois.<br><br>
                    <strong>Statut :</strong> ✓ Vous êtes à jour !<br><br>
                    <strong>Prochain dépistage recommandé :</strong><br>
                    Dans ${24 - monthsSinceScreening} mois (${getNextScreeningDate(lastScreening)})<br><br>
                    Continuez l'auto-examen mensuel.
                `;
                urgency = 'success';
            } else {
                recommendation = `
                    <strong>Âge : ${age} ans</strong><br><br>
                    ⚠️ Votre dernier dépistage date de ${monthsSinceScreening} mois.<br><br>
                    <strong>Action recommandée :</strong> Prenez rendez-vous pour une mammographie dès que possible.<br><br>
                    Le dépistage est recommandé tous les 2 ans entre 50 et 74 ans.
                `;
                urgency = 'danger';
            }
        } else {
            recommendation = `
                <strong>Âge : ${age} ans</strong><br><br>
                Vous êtes dans la tranche d'âge du dépistage systématique.<br><br>
                <strong>Recommandations :</strong><br>
                • Mammographie tous les 2 ans<br>
                • Auto-examen mensuel<br>
                • Consultation médicale annuelle<br><br>
                <strong>Action :</strong> Prenez rendez-vous pour votre première mammographie si ce n'est pas déjà fait.
            `;
            urgency = 'warning';
        }
    } else {
        recommendation = `
            <strong>Âge : ${age} ans</strong><br><br>
            Après 74 ans, le dépistage systématique n'est plus automatiquement recommandé.<br><br>
            <strong>Recommandations :</strong><br>
            • Discutez avec votre médecin de la pertinence d'un dépistage selon votre état de santé<br>
            • Continuez l'auto-examen mensuel<br>
            • Consultez en cas d'anomalie
        `;
    }
    
    // Afficher le résultat
    resultDiv.className = `alert alert-${urgency} mt-4`;
    recommendationText.innerHTML = recommendation;
    resultDiv.style.display = 'block';
    
    // Animation
    resultDiv.classList.add('animate-fade-in');
    
    // Scroll vers le résultat
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getNextScreeningDate(lastScreening) {
    const nextDate = new Date(lastScreening);
    nextDate.setMonth(nextDate.getMonth() + 24);
    
    const options = { year: 'numeric', month: 'long' };
    return nextDate.toLocaleDateString('fr-FR', options);
}

// Validation des champs du calculateur
function validateCalculatorField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    let isValid = true;
    
    // Réinitialiser les classes
    field.classList.remove('is-valid', 'is-invalid');
    
    switch(fieldId) {
        case 'birthYear':
            const year = parseInt(value);
            const currentYear = new Date().getFullYear();
            isValid = value && year >= 1920 && year <= currentYear;
            break;
            
        case 'lastScreening':
            const today = new Date();
            const screeningDate = new Date(value);
            isValid = value && screeningDate <= today;
            break;
    }
    
    // Vérifier si le champ requis est vide
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');
    return isValid;
}
