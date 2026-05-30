// Gestion du quiz éducatif

let currentQuestion = 1;
let score = 0;
const totalQuestions = 3;

document.addEventListener('DOMContentLoaded', function() {
    initQuiz();
});

function initQuiz() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            handleQuizAnswer(this);
        });
    });
}

function handleQuizAnswer(button) {
    const isCorrect = button.getAttribute('data-answer') === 'true';
    const currentQuestionDiv = document.getElementById(`question${currentQuestion}`);
    const allOptions = currentQuestionDiv.querySelectorAll('.quiz-option');
    
    // Désactiver tous les boutons de la question actuelle
    allOptions.forEach(opt => {
        opt.disabled = true;
        opt.style.cursor = 'not-allowed';
        
        // Afficher la bonne réponse
        if (opt.getAttribute('data-answer') === 'true') {
            opt.classList.add('correct');
        }
    });
    
    // Marquer la réponse sélectionnée
    if (isCorrect) {
        button.classList.add('correct');
        score++;
        
        // Animation de succès
        showFeedback('✓ Bonne réponse !', 'success');
    } else {
        button.classList.add('incorrect');
        showFeedback('✗ Mauvaise réponse. La bonne réponse est surlignée en vert.', 'error');
    }
    
    // Passer à la question suivante ou afficher le résultat
    setTimeout(() => {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            showNextQuestion();
        } else {
            showQuizResult();
        }
    }, 2000);
}

function showNextQuestion() {
    // Masquer la question actuelle
    document.getElementById(`question${currentQuestion - 1}`).style.display = 'none';
    
    // Afficher la question suivante
    const nextQuestion = document.getElementById(`question${currentQuestion}`);
    nextQuestion.style.display = 'block';
    nextQuestion.classList.add('animate-fade-in');
}

function showQuizResult() {
    // Masquer toutes les questions
    for (let i = 1; i <= totalQuestions; i++) {
        document.getElementById(`question${i}`).style.display = 'none';
    }
    
    // Afficher le résultat
    const quizResult = document.getElementById('quizResult');
    const quizScore = document.getElementById('quizScore');
    const quizMessage = document.getElementById('quizMessage');
    
    quizScore.textContent = score;
    
    // Message personnalisé selon le score
    let message = '';
    let emoji = '';
    
    if (score === totalQuestions) {
        emoji = '🎉';
        message = 'Excellent ! Vous maîtrisez parfaitement les informations sur le dépistage du cancer du sein.';
    } else if (score >= totalQuestions / 2) {
        emoji = '👍';
        message = 'Bien joué ! Vous avez de bonnes connaissances. Continuez à vous informer.';
    } else {
        emoji = '📚';
        message = 'Continuez à vous informer. Le dépistage précoce est essentiel pour sauver des vies.';
    }
    
    quizMessage.innerHTML = `<p class="lead">${emoji} ${message}</p>`;
    
    quizResult.style.display = 'block';
    quizResult.classList.add('animate-fade-in');
    
    // Confettis si score parfait
    if (score === totalQuestions) {
        createConfetti();
    }
}

function restartQuiz() {
    currentQuestion = 1;
    score = 0;
    
    // Réinitialiser toutes les questions
    for (let i = 1; i <= totalQuestions; i++) {
        const questionDiv = document.getElementById(`question${i}`);
        const options = questionDiv.querySelectorAll('.quiz-option');
        
        options.forEach(opt => {
            opt.disabled = false;
            opt.style.cursor = 'pointer';
            opt.classList.remove('correct', 'incorrect');
        });
        
        questionDiv.style.display = i === 1 ? 'block' : 'none';
    }
    
    // Masquer le résultat
    document.getElementById('quizResult').style.display = 'none';
}

function showFeedback(message, type) {
    const feedback = document.createElement('div');
    feedback.className = `alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
    feedback.textContent = message;
    feedback.style.animation = 'fadeIn 0.3s';
    
    const currentQuestionDiv = document.getElementById(`question${currentQuestion}`);
    currentQuestionDiv.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

function createConfetti() {
    const confettiCount = 50;
    const colors = ['#E83E8C', '#FFB6D9', '#FFE4F0', '#FF69B4'];
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            
            document.body.appendChild(confetti);
            
            const duration = 2000 + Math.random() * 1000;
            const rotation = Math.random() * 360;
            
            confetti.animate([
                { 
                    transform: 'translateY(0) rotate(0deg)',
                    opacity: 1
                },
                { 
                    transform: `translateY(${window.innerHeight}px) rotate(${rotation}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            setTimeout(() => confetti.remove(), duration);
        }, i * 30);
    }
}
