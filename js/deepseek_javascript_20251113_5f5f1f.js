// Sistema principal da Associação Guphassana
class GuphassanaSite {
    constructor() {
        this.currentLanguage = 'pt';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupAnimations();
        this.initializeLanguageSystem();
    }

    setupEventListeners() {
        // Navegação suave
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    // Atualizar menu ativo
                    this.updateActiveNav(anchor.getAttribute('href'));
                }
            });
        });

        // Botões de doação - CORRIGIDO
        document.querySelectorAll('#donate-btn, #hero-donate').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleDonation();
            });
        });

        // Botão saber mais
        document.getElementById('hero-learn')?.addEventListener('click', () => {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
            this.updateActiveNav('#about');
        });

        // Formulário de contacto
        document.getElementById('contact-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Observador para menu ativo durante scroll
        this.setupScrollSpy();
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

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveNav(`#${id}`);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    updateActiveNav(hash) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`.nav-link[href="${hash}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
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

        document.querySelectorAll('.access-card, .work-card, .project-card, .mv-item').forEach(el => {
            observer.observe(el);
        });
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.countUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

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

    // SISTEMA DE TRADUÇÃO CORRIGIDO
    initializeLanguageSystem() {
        // Adicionar event listeners aos botões de idioma
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.id.replace('translate-', '');
                this.switchLanguage(lang);
            });
        });

        // Inicializar com português
        this.switchLanguage('pt');
    }

    switchLanguage(lang) {
        this.currentLanguage = lang;
        
        // Atualizar botões ativos
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`translate-${lang}`).classList.add('active');

        // Esconder todos os textos
        document.querySelectorAll('[data-lang]').forEach(el => {
            el.style.display = 'none';
        });
        
        // Mostrar textos do idioma selecionado
        document.querySelectorAll(`[data-lang="${lang}"]`).forEach(el => {
            el.style.display = el.tagName === 'DIV' ? 'block' : 'inline';
        });

        // Atualizar atributo lang do HTML
        document.documentElement.lang = lang;
    }

    handleDonation() {
        // Simulação de sistema de doações - CORRIGIDO
        const donationOptions = `
            <div style="padding: 20px; text-align: center;">
                <h3>${this.currentLanguage === 'pt' ? 'Apoie a Associação Guphassana' : 
                     this.currentLanguage === 'en' ? 'Support Guphassana Association' : 
                     'Soutenez l\'Association Guphassana'}</h3>
                <p>${this.currentLanguage === 'pt' ? 'Entre em contacto para fazer a sua doação:' : 
                     this.currentLanguage === 'en' ? 'Get in touch to make your donation:' : 
                     'Contactez-nous pour faire votre don:'}</p>
                <p><strong>Email:</strong> info.guphassana@gmail.com</p>
                <p><strong>Telefone:</strong> +258 823 933 624</p>
            </div>
        `;
        
        // Criar modal simples
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 10px;
            max-width: 400px;
            width: 90%;
            text-align: center;
        `;
        modalContent.innerHTML = donationOptions;
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = this.currentLanguage === 'pt' ? 'Fechar' : 
                              this.currentLanguage === 'en' ? 'Close' : 'Fermer';
        closeBtn.style.cssText = `
            background: var(--secondary);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 1rem;
        `;
        closeBtn.onclick = () => document.body.removeChild(modal);
        
        modalContent.appendChild(closeBtn);
        modal.appendChild(modalContent);
        modal.onclick = (e) => {
            if (e.target === modal) document.body.removeChild(modal);
        };
        
        document.body.appendChild(modal);
    }

    handleFormSubmit() {
        const form = document.getElementById('contact-form');
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;

        // Simular envio
        button.disabled = true;
        button.innerHTML = this.currentLanguage === 'pt' ? 'Enviando...' :
                          this.currentLanguage === 'en' ? 'Sending...' :
                          'Envoi en cours...';

        setTimeout(() => {
            const successMessage = this.currentLanguage === 'pt' ? 
                'Mensagem enviada com sucesso! Entraremos em contacto em breve.' :
                this.currentLanguage === 'en' ?
                'Message sent successfully! We will contact you soon.' :
                'Message envoyée avec succès ! Nous vous contacterons bientôt.';
                
            alert(successMessage);
            form.reset();
            button.disabled = false;
            button.innerHTML = originalText;
        }, 2000);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new GuphassanaSite();
});

// Adicionar CSS para animações
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
