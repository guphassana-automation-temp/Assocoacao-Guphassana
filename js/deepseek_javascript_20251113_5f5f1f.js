// ===== ASSOCIAÇÃO GUPHASSANA =====

class GuphassanaApp {
    constructor() {
        this.currentLang = 'pt';
        this.selectedAmount = 0;
        this.selectedMethod = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.initializeModals();
        console.log('🏁 Associação Guphassana - Aplicação inicializada');
    }

    // ===== CONFIGURAÇÃO DE EVENT LISTENERS =====
    setupEventListeners() {
        this.handleLoadingScreen();
        this.setupNavigation();
        this.setupTranslation();
        this.setupModalHandlers();
        this.setupFormHandlers();
        this.setupDonationSystem();
        this.setupCounters();
    }

    // ===== LOADING SCREEN =====
    handleLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }, 500);
                }, 1500);
            });

            // Fallback se a página demorar muito
            setTimeout(() => {
                if (loadingScreen.style.display !== 'none') {
                    loadingScreen.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }, 5000);
        }
    }

    // ===== NAVEGAÇÃO =====
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const header = document.querySelector('.main-header');

        // Navegação suave
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollToSection(targetId);
                
                // Atualizar link ativo
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Header scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
                
                if (currentScroll > lastScroll && currentScroll > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.style.background = 'var(--bg-white)';
                header.style.backdropFilter = 'none';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });

        this.setupActiveNavigation();
    }

    scrollToSection(sectionId) {
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            const offsetTop = targetSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });

        sections.forEach(section => {
            if (section.id) {
                observer.observe(section);
            }
        });
    }

    // ===== SISTEMA DE TRADUÇÃO =====
    setupTranslation() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            button.addEventListener('click', () => {
                const lang = button.id.replace('translate-', '');
                this.switchLanguage(lang);
                
                // Atualizar botões ativos
                langButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        
        // Atualizar todos os elementos com data-lang
        document.querySelectorAll('[data-lang]').forEach(element => {
            if (element.getAttribute('data-lang') === lang) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });

        // Atualizar atributo lang do HTML
        document.documentElement.lang = lang;

        // Atualizar título da página
        const titles = {
            'pt': 'Associação Guphassana - Proteção Infantil, Igualdade de Gênero, Saúde e Ambiente',
            'en': 'Guphassana Association - Child Protection, Gender Equality, Health and Environment',
            'fr': 'Association Guphassana - Protection de l\'Enfance, Égalité des Genres, Santé et Environnement'
        };
        
        document.title = titles[lang] || titles['pt'];
        
        console.log(`🌐 Idioma alterado para: ${lang}`);
    }

    // ===== SISTEMA DE MODAIS =====
    initializeModals() {
        this.modals = {
            donation: document.getElementById('donationModal'),
            volunteer: document.getElementById('volunteerModal')
        };
    }

    setupModalHandlers() {
        // Botões de abrir modal
        document.getElementById('donate-btn')?.addEventListener('click', () => this.openModal('donation'));
        document.getElementById('hero-donate')?.addEventListener('click', () => this.openModal('donation'));
        document.getElementById('hero-volunteer')?.addEventListener('click', () => this.openModal('volunteer'));

        // Botões de fechar modal
        document.getElementById('closeDonationModal')?.addEventListener('click', () => this.closeModal('donation'));
        document.getElementById('closeVolunteerModal')?.addEventListener('click', () => this.closeModal('volunteer'));

        // Fechar modal ao clicar fora
        Object.keys(this.modals).forEach(modalKey => {
            this.modals[modalKey]?.addEventListener('click', (e) => {
                if (e.target === this.modals[modalKey]) {
                    this.closeModal(modalKey);
                }
            });
        });

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Object.keys(this.modals).forEach(modalKey => {
                    this.closeModal(modalKey);
                });
            }
        });
    }

    openModal(modalKey) {
        const modal = this.modals[modalKey];
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Reset do modal de doação
            if (modalKey === 'donation') {
                this.resetDonationForm();
            }
        }
    }

    closeModal(modalKey) {
        const modal = this.modals[modalKey];
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // ===== SISTEMA DE DOAÇÃO =====
    setupDonationSystem() {
        this.selectedAmount = 0;
        this.selectedMethod = '';

        const amountButtons = document.querySelectorAll('.amount-btn');
        const customAmount = document.getElementById('customAmount');
        const paymentOptions = document.querySelectorAll('.payment-option');
        const finalizeBtn = document.getElementById('finalizeDonation');

        // Botões de valor
        amountButtons.forEach(button => {
            button.addEventListener('click', () => {
                amountButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.selectedAmount = parseInt(button.getAttribute('data-amount'));
                if (customAmount) customAmount.value = '';
                this.updateDonationButton();
            });
        });

        // Valor customizado
        if (customAmount) {
            customAmount.addEventListener('input', () => {
                amountButtons.forEach(btn => btn.classList.remove('active'));
                this.selectedAmount = parseInt(customAmount.value) || 0;
                this.updateDonationButton();
            });
        }

        // Métodos de pagamento
        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                paymentOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.selectedMethod = option.getAttribute('data-method');
                this.showPaymentDetails(this.selectedMethod);
                this.updateDonationButton();
            });
        });

        // Finalizar doação
        if (finalizeBtn) {
            finalizeBtn.addEventListener('click', () => this.processDonation());
        }
    }

    showPaymentDetails(method) {
        const detailsContainer = document.getElementById('paymentDetails');
        if (!detailsContainer) return;

        const details = {
            mpesa: `
                <h5>M-Pesa</h5>
                <p><strong>Número:</strong> 82 393 3624</p>
                <p><strong>Nome:</strong> Associação Guphassana</p>
                <p><small>Use a referência: "DOAÇÃO" no campo de descrição</small></p>
            `,
            emola: `
                <h5>e-Mola</h5>
                <p><strong>Número:</strong> 82 393 3624</p>
                <p><strong>Nome:</strong> Associação Guphassana</p>
                <p><small>Transação: Doação para projetos sociais</small></p>
            `,
            bank: `
                <h5>Transferência Bancária</h5>
                <p><strong>Banco:</strong> Standard Bank Moçambique</p>
                <p><strong>Conta:</strong> 1234567890</p>
                <p><strong>NIB:</strong> 00080001234567890</p>
                <p><strong>Titular:</strong> Associação Guphassana</p>
            `,
            paypal: `
                <h5>PayPal</h5>
                <p><strong>Email:</strong> info.guphassana@gmail.com</p>
                <p><small>Envie para o email acima com a descrição "Doação"</small></p>
            `
        };

        detailsContainer.innerHTML = details[method] || '<p>Selecione um método de pagamento</p>';
    }

    updateDonationButton() {
        const finalizeBtn = document.getElementById('finalizeDonation');
        if (!finalizeBtn) return;

        if (this.selectedAmount > 0 && this.selectedMethod) {
            finalizeBtn.disabled = false;
            
            // Atualizar texto do botão com o valor
            const amountText = this.selectedAmount.toLocaleString('pt-MZ') + ' MT';
            const methodText = this.selectedMethod.toUpperCase();
            
            finalizeBtn.innerHTML = `
                <span data-lang="pt">Doar ${amountText} via ${methodText}</span>
                <span data-lang="en" style="display: none;">Donate ${amountText} via ${methodText}</span>
                <span data-lang="fr" style="display: none;">Donner ${amountText} via ${methodText}</span>
            `;
            
            // Atualizar visibilidade dos textos de idioma
            this.updateLanguageVisibility();
        } else {
            finalizeBtn.disabled = true;
            finalizeBtn.innerHTML = `
                <span data-lang="pt">Finalizar Doação</span>
                <span data-lang="en" style="display: none;">Finalize Donation</span>
                <span data-lang="fr" style="display: none;">Finaliser le Don</span>
            `;
        }
    }

    resetDonationForm() {
        this.selectedAmount = 0;
        this.selectedMethod = '';
        
        // Reset buttons
        document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
        
        // Reset inputs
        const customAmount = document.getElementById('customAmount');
        if (customAmount) customAmount.value = '';
        
        // Reset details
        const detailsContainer = document.getElementById('paymentDetails');
        if (detailsContainer) detailsContainer.innerHTML = '';
        
        this.updateDonationButton();
    }

    processDonation() {
        if (this.selectedAmount === 0 || !this.selectedMethod) {
            alert('Por favor, selecione um valor e método de pagamento.');
            return;
        }

        const amountText = this.selectedAmount.toLocaleString('pt-MZ') + ' MT';
        const messages = {
            'pt': `Obrigado pela sua doação de ${amountText}! Instruções de pagamento foram enviadas para o método selecionado.`,
            'en': `Thank you for your donation of ${amountText}! Payment instructions have been sent to the selected method.`,
            'fr': `Merci pour votre don de ${amountText}! Les instructions de paiement ont été envoyées à la méthode sélectionnée.`
        };

        alert(messages[this.currentLang] || messages['pt']);
        this.closeModal('donation');
        
        // Log para analytics
        console.log(`💸 Doação processada: ${amountText} via ${this.selectedMethod}`);
    }

    // ===== FORMULÁRIOS =====
    setupFormHandlers() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Validação básica
        if (!name || !email || !message) {
            this.showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showNotification('Por favor, insira um email válido.', 'error');
            return;
        }

        // Simular envio
        this.showNotification('Mensagem enviada com sucesso! Entraremos em contacto em breve.', 'success');
        form.reset();
        
        // Log para analytics
        console.log(`📧 Formulário de contacto enviado por: ${name} (${email})`);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        // Criar notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);

        // Fechar ao clicar no X
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    // ===== CONTADORES ANIMADOS =====
    setupCounters() {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target;
                    const target = parseInt(statNumber.getAttribute('data-count'));
                    this.animateCounter(statNumber, target);
                    observer.unobserve(statNumber);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    animateCounter(element, target) {
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const displayValue = Math.floor(current);
            element.textContent = displayValue.toLocaleString('pt-MZ') + (element.textContent.includes('+') ? '+' : '');
        }, 16);
    }

    // ===== OBSERVER DE INTERSECTION =====
    setupIntersectionObserver() {
        const fadeElements = document.querySelectorAll('.access-card, .work-card, .project-card, .story-card, .mv-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        fadeElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    // ===== EFEITOS DE SCROLL =====
    setupScrollEffects() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-background');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    // ===== ATUALIZAR VISIBILIDADE DE IDIOMA =====
    updateLanguageVisibility() {
        document.querySelectorAll('[data-lang]').forEach(element => {
            if (element.getAttribute('data-lang') === this.currentLang) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
    }
}

// ===== INICIALIZAÇÃO DA APLICAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar o DOM estar completamente pronto
    setTimeout(() => {
        window.guphassanaApp = new GuphassanaApp();
    }, 100);
});

// ===== FALLBACK PARA NAVEGADORES ANTIGOS =====
if (typeof window.IntersectionObserver === 'undefined') {
    // Polyfill básico para IntersectionObserver
    window.IntersectionObserver = class {
        constructor() { this.observers = []; }
        observe() { }
        unobserve() { }
    };
    
    // Fallback para quando o DOM carregar
    document.addEventListener('DOMContentLoaded', () => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 2000);
        }
    });
}

console.log('📄 Associação Guphassana - JavaScript carregado');
