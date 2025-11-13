// Sistema principal
class GuphassanaSite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Navegação suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Botões de doação
        document.querySelectorAll('#donate-btn, #hero-donate').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleDonation();
            });
        });

        // Botão saber mais
        document.getElementById('hero-learn')?.addEventListener('click', () => {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        });

        // Formulário de contacto
        document.getElementById('contact-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Botões de idioma
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchLanguage(btn.id.replace('translate-', ''));
            });
        });
    }

    setupScrollEffects() {
        const header = document.querySelector('.main-header');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'var(--white)';
                header.style.backdropFilter = 'none';
            }
        });
    }

    setupAnimations() {
        // Animar números de estatísticas
        this.animateStats();
        
        // Observer para elementos
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.access-card, .work-card, .project-card').forEach(el => {
            observer.observe(el);
        });
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.countUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => observer.observe(stat));
    }

    countUp(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    handleDonation() {
        alert('Obrigado pelo seu interesse em apoiar a Associação Guphassana! Em breve teremos um sistema de doações online.');
    }

    handleFormSubmit() {
        const form = document.getElementById('contact-form');
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;

        // Simular envio
        button.textContent = 'Enviando...';
        button.disabled = true;

        setTimeout(() => {
            alert('Mensagem enviada com sucesso! Entraremos em contacto em breve.');
            form.reset();
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    }

    switchLanguage(lang) {
        // Atualizar botões ativos
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`translate-${lang}`).classList.add('active');

        // Aqui iria a lógica de tradução real
        console.log(`Idioma alterado para: ${lang}`);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new GuphassanaSite();
});

// CSS para animações
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeInUp 0.6s ease-out;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);