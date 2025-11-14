// Sistema principal da Associação Guphassana
class GuphassanaSite {
    constructor() {
        this.currentLanguage = 'pt';
        this.selectedAmount = null;
        this.selectedPaymentMethod = null;
        this.donationModal = null;
        this.volunteerModal = null;
        this.init();
    }

    init() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupAnimations();
        this.initializeLanguageSystem();
        this.initializeModals();
        this.setupDonationSystem();
    }

    hideLoadingScreen() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }
            }, 1000);
        });
    }

    setupEventListeners() {
        // Navegação suave
        this.setupSmoothNavigation();
        
        // Botões de ação principais
        this.setupActionButtons();
        
        // Formulário de contacto
        this.setupContactForm();
        
        // Observador para menu ativo durante scroll
        this.setupScrollSpy();
    }

    setupSmoothNavigation() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    this.updateActiveNav(anchor.getAttribute('href'));
                }
            });
        });
    }

    setupActionButtons() {
        // Botões de doação
        document.querySelectorAll('#donate-btn, #hero-donate').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDonationModal();
            });
        });

        // Botão de voluntariado
        document.getElementById('hero-volunteer')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showVolunteerModal();
        });

        // Botão de parcerias
        document.getElementById('hero-partner')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showPartnershipInfo();
        });
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(contactForm);
            });
        }
    }

    setupScrollEffects() {
        const header = document.querySelector('.main-header');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveNav(`#${id}`);
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });

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
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar elementos para animação
        const elementsToAnimate = document.querySelectorAll(
            '.access-card, .work-card, .project-card, .mv-item, .story-card, .stat-item'
        );
        
        elementsToAnimate.forEach(el => {
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

    // SISTEMA DE TRADUÇÃO
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

        // Atualizar conteúdo dos modais se estiverem abertos
        this.updateModalContent();
    }

    // SISTEMA DE MODAIS
    initializeModals() {
        this.donationModal = document.getElementById('donationModal');
        this.volunteerModal = document.getElementById('volunteerModal');

        // Fechar modais ao clicar no X
        document.getElementById('closeDonationModal')?.addEventListener('click', () => {
            this.hideDonationModal();
        });

        document.getElementById('closeVolunteerModal')?.addEventListener('click', () => {
            this.hideVolunteerModal();
        });

        // Fechar modais ao clicar fora
        [this.donationModal, this.volunteerModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hideModal(modal);
                    }
                });
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
            }
        });
    }

    showDonationModal() {
        this.showModal(this.donationModal);
    }

    hideDonationModal() {
        this.hideModal(this.donationModal);
        this.resetDonationForm();
    }

    showVolunteerModal() {
        this.showModal(this.volunteerModal);
    }

    hideVolunteerModal() {
        this.hideModal(this.volunteerModal);
    }

    showModal(modal) {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    hideAllModals() {
        this.hideDonationModal();
        this.hideVolunteerModal();
    }

    updateModalContent() {
        // Atualizar conteúdo dos modais baseado no idioma atual
        // O conteúdo já está no HTML com data-lang, só precisa ser mostrado/ocultado
    }

    // SISTEMA DE DOAÇÕES
    setupDonationSystem() {
        this.setupAmountSelection();
        this.setupPaymentMethodSelection();
        this.setupFinalDonation();
    }

    setupAmountSelection() {
        // Botões de valor pré-definido
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedAmount = btn.getAttribute('data-amount');
                document.getElementById('customAmount').value = '';
                this.updateDonationButton();
            });
        });

        // Valor personalizado
        const customAmountInput = document.getElementById('customAmount');
        if (customAmountInput) {
            customAmountInput.addEventListener('input', (e) => {
                document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
                this.selectedAmount = e.target.value;
                this.updateDonationButton();
            });
        }
    }

    setupPaymentMethodSelection() {
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.selectedPaymentMethod = option.getAttribute('data-method');
                this.showPaymentDetails(this.selectedPaymentMethod);
                this.updateDonationButton();
            });
        });
    }

    showPaymentDetails(method) {
        const detailsContainer = document.getElementById('paymentDetails');
        if (!detailsContainer) return;

        const paymentDetails = {
            mpesa: {
                title: this.getTranslation('mpesa_title'),
                instructions: this.getTranslation('mpesa_instructions'),
                number: '+258 82 393 3624',
                steps: [
                    this.getTranslation('mpesa_step1'),
                    this.getTranslation('mpesa_step2'),
                    this.getTranslation('mpesa_step3')
                ]
            },
            emola: {
                title: this.getTranslation('emola_title'),
                instructions: this.getTranslation('emola_instructions'),
                number: '+258 87 923 3624',
                steps: [
                    this.getTranslation('emola_step1'),
                    this.getTranslation('emola_step2'),
                    this.getTranslation('emola_step3')
                ]
            },
            bank: {
                title: this.getTranslation('bank_title'),
                instructions: this.getTranslation('bank_instructions'),
                details: `
                    <strong>${this.getTranslation('bank_name')}:</strong> Banco Comercial de Moçambique<br>
                    <strong>${this.getTranslation('account_name')}:</strong> Associação Guphassana<br>
                    <strong>${this.getTranslation('account_number')}:</strong> 123456789012<br>
                    <strong>${this.getTranslation('nib')}:</strong> 1234 5678 9012 3456 7890 1<br>
                    <strong>${this.getTranslation('swift')}:</strong> BCMOMZMA
                `
            },
            paypal: {
                title: 'PayPal',
                instructions: this.getTranslation('paypal_instructions'),
                email: 'info.guphassana@gmail.com',
                steps: [
                    this.getTranslation('paypal_step1'),
                    this.getTranslation('paypal_step2'),
                    this.getTranslation('paypal_step3')
                ]
            }
        };

        const details = paymentDetails[method];
        if (!details) return;

        let html = `
            <h5>${details.title}</h5>
            <p>${details.instructions}</p>
        `;

        if (method === 'mpesa' || method === 'emola') {
            html += `
                <p><strong>${this.getTranslation('phone_number')}:</strong> ${details.number}</p>
                <div class="instructions">
                    <strong>${this.getTranslation('how_to')}:</strong>
                    <ul>
                        ${details.steps.map(step => `<li>${step}</li>`).join('')}
                    </ul>
                </div>
            `;
        } else if (method === 'bank') {
            html += `
                <div class="instructions">
                    ${details.details}
                </div>
            `;
        } else if (method === 'paypal') {
            html += `
                <p><strong>${this.getTranslation('paypal_email')}:</strong> ${details.email}</p>
                <div class="instructions">
                    <strong>${this.getTranslation('how_to')}:</strong>
                    <ul>
                        ${details.steps.map(step => `<li>${step}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        detailsContainer.innerHTML = html;
    }

    getTranslation(key) {
        const translations = {
            // Títulos
            'mpesa_title': {
                pt: 'M-Pesa - Pagamento por Mobile Money',
                en: 'M-Pesa - Mobile Money Payment',
                fr: 'M-Pesa - Paiement Mobile Money'
            },
            'emola_title': {
                pt: 'e-Mola - Carteira Digital',
                en: 'e-Mola - Digital Wallet',
                fr: 'e-Mola - Portefeuille Numérique'
            },
            'bank_title': {
                pt: 'Transferência Bancária',
                en: 'Bank Transfer',
                fr: 'Virement Bancaire'
            },
            'paypal_instructions': {
                pt: 'Faça sua doação através do PayPal de forma segura.',
                en: 'Make your donation securely through PayPal.',
                fr: 'Faites votre don en toute sécurité via PayPal.'
            },

            // Instruções
            'mpesa_instructions': {
                pt: 'Faça a transferência para o número abaixo:',
                en: 'Transfer to the number below:',
                fr: 'Transférez au numéro ci-dessous:'
            },
            'emola_instructions': {
                pt: 'Utilize o número da carteira e-Mola:',
                en: 'Use the e-Mola wallet number:',
                fr: 'Utilisez le numéro de portefeuille e-Mola:'
            },
            'bank_instructions': {
                pt: 'Utilize os dados bancários abaixo para transferência:',
                en: 'Use the bank details below for transfer:',
                fr: 'Utilisez les coordonnées bancaires ci-dessous pour le virement:'
            },

            // Passos M-Pesa/e-Mola
            'mpesa_step1': {
                pt: 'Aceda ao menu M-Pesa no seu telemóvel',
                en: 'Access the M-Pesa menu on your mobile',
                fr: 'Accédez au menu M-Pesa sur votre mobile'
            },
            'mpesa_step2': {
                pt: 'Selecione "Enviar Dinheiro"',
                en: 'Select "Send Money"',
                fr: 'Sélectionnez "Envoyer de l\'argent"'
            },
            'mpesa_step3': {
                pt: 'Insira o número +258 82 393 3624 e o valor',
                en: 'Enter number +258 82 393 3624 and amount',
                fr: 'Entrez le numéro +258 82 393 3624 et le montant'
            },
            'emola_step1': {
                pt: 'Abra a aplicação e-Mola',
                en: 'Open the e-Mola application',
                fr: 'Ouvrez l\'application e-Mola'
            },
            'emola_step2': {
                pt: 'Selecione "Transferir"',
                en: 'Select "Transfer"',
                fr: 'Sélectionnez "Transférer"'
            },
            'emola_step3': {
                pt: 'Insira o número +258 87 923 3624 e o valor',
                en: 'Enter number +258 87 923 3624 and amount',
                fr: 'Entrez le numéro +258 87 923 3624 et le montant'
            },

            // Passos PayPal
            'paypal_step1': {
                pt: 'Aceda ao www.paypal.com',
                en: 'Go to www.paypal.com',
                fr: 'Allez sur www.paypal.com'
            },
            'paypal_step2': {
                pt: 'Faça login na sua conta PayPal',
                en: 'Log in to your PayPal account',
                fr: 'Connectez-vous à votre compte PayPal'
            },
            'paypal_step3': {
                pt: 'Envie o valor para info.guphassana@gmail.com',
                en: 'Send the amount to info.guphassana@gmail.com',
                fr: 'Envoyez le montant à info.guphassana@gmail.com'
            },

            // Dados bancários
            'bank_name': {
                pt: 'Nome do Banco',
                en: 'Bank Name',
                fr: 'Nom de la Banque'
            },
            'account_name': {
                pt: 'Nome da Conta',
                en: 'Account Name',
                fr: 'Nom du Compte'
            },
            'account_number': {
                pt: 'Número da Conta',
                en: 'Account Number',
                fr: 'Numéro de Compte'
            },
            'nib': {
                pt: 'NIB',
                en: 'NIB',
                fr: 'NIB'
            },
            'swift': {
                pt: 'Código SWIFT',
                en: 'SWIFT Code',
                fr: 'Code SWIFT'
            },

            // Textos gerais
            'phone_number': {
                pt: 'Número de Telefone',
                en: 'Phone Number',
                fr: 'Numéro de Téléphone'
            },
            'paypal_email': {
                pt: 'Email do PayPal',
                en: 'PayPal Email',
                fr: 'Email PayPal'
            },
            'how_to': {
                pt: 'Como fazer:',
                en: 'How to:',
                fr: 'Comment faire:'
            }
        };

        const translation = translations[key];
        return translation ? translation[this.currentLanguage] || translation.pt : key;
    }

    updateDonationButton() {
        const donateButton = document.getElementById('finalizeDonation');
        if (donateButton) {
            const isReady = this.selectedAmount && this.selectedPaymentMethod;
            donateButton.disabled = !isReady;
            
            if (isReady) {
                const amountText = this.selectedAmount === 'custom' ? 
                    document.getElementById('customAmount').value : 
                    this.selectedAmount;
                
                donateButton.innerHTML = `
                    ${this.getTranslation('finalize_donation')} - ${amountText} MT
                `;
            } else {
                donateButton.innerHTML = this.getTranslation('finalize_donation');
            }
        }
    }

    setupFinalDonation() {
        const donateButton = document.getElementById('finalizeDonation');
        if (donateButton) {
            donateButton.addEventListener('click', () => {
                this.processDonation();
            });
        }
    }

    processDonation() {
        if (!this.selectedAmount || !this.selectedPaymentMethod) {
            this.showNotification(
                this.getTranslation('select_amount_method'),
                'error'
            );
            return;
        }

        const amount = this.selectedAmount === 'custom' ? 
            document.getElementById('customAmount').value : 
            this.selectedAmount;

        // Simular processamento
        this.showNotification(
            this.getTranslation('processing_donation').replace('{amount}', amount),
            'info'
        );

        // Simular sucesso após 2 segundos
        setTimeout(() => {
            this.showNotification(
                this.getTranslation('donation_success').replace('{amount}', amount),
                'success'
            );
            this.hideDonationModal();
            this.resetDonationForm();
        }, 2000);
    }

    resetDonationForm() {
        this.selectedAmount = null;
        this.selectedPaymentMethod = null;
        
        document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.payment-option').forEach(option => option.classList.remove('active'));
        
        const customAmountInput = document.getElementById('customAmount');
        if (customAmountInput) customAmountInput.value = '';
        
        const detailsContainer = document.getElementById('paymentDetails');
        if (detailsContainer) detailsContainer.innerHTML = '';
        
        this.updateDonationButton();
    }

    // SISTEMA DE NOTIFICAÇÕES
    showNotification(message, type = 'info') {
        // Remover notificação anterior se existir
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Adicionar estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Animação de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            info: '#2196f3',
            warning: '#ff9800'
        };
        return colors[type] || '#2196f3';
    }

    // OUTRAS FUNCIONALIDADES
    handleFormSubmit(form) {
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;

        // Simular envio
        button.disabled = true;
        button.innerHTML = this.currentLanguage === 'pt' ? 
            '<i class="fas fa-spinner fa-spin"></i> Enviando...' :
            this.currentLanguage === 'en' ?
            '<i class="fas fa-spinner fa-spin"></i> Sending...' :
            '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

        setTimeout(() => {
            const successMessage = this.currentLanguage === 'pt' ? 
                'Mensagem enviada com sucesso! Entraremos em contacto em breve.' :
                this.currentLanguage === 'en' ?
                'Message sent successfully! We will contact you soon.' :
                'Message envoyée avec succès ! Nous vous contacterons bientôt.';
                
            this.showNotification(successMessage, 'success');
            form.reset();
            button.disabled = false;
            button.innerHTML = originalText;
        }, 2000);
    }

    showPartnershipInfo() {
        const message = this.currentLanguage === 'pt' ?
            'Para parcerias empresariais ou institucionais, contacte-nos através do email info.guphassana@gmail.com ou telefone +258 823 933 624.' :
            this.currentLanguage === 'en' ?
            'For business or institutional partnerships, contact us at info.guphassana@gmail.com or phone +258 823 933 624.' :
            'Pour des partenariats d\'entreprise ou institutionnels, contactez-nous à info.guphassana@gmail.com ou téléphone +258 823 933 624.';
        
        this.showNotification(message, 'info');
    }

    // Traduções adicionais para o sistema de doações
    getTranslation(key) {
        const translations = {
            'finalize_donation': {
                pt: 'Finalizar Doação',
                en: 'Finalize Donation',
                fr: 'Finaliser le Don'
            },
            'select_amount_method': {
                pt: 'Por favor, selecione o valor e método de pagamento.',
                en: 'Please select amount and payment method.',
                fr: 'Veuillez sélectionner le montant et la méthode de paiement.'
            },
            'processing_donation': {
                pt: 'A processar sua doação de {amount} MT...',
                en: 'Processing your {amount} MT donation...',
                fr: 'Traitement de votre don de {amount} MT...'
            },
            'donation_success': {
                pt: 'Obrigado! Sua doação de {amount} MT foi processada com sucesso.',
                en: 'Thank you! Your {amount} MT donation was processed successfully.',
                fr: 'Merci ! Votre don de {amount} MT a été traité avec succès.'
            }
        };

        const translation = translations[key];
        return translation ? translation[this.currentLanguage] || translation.pt : key;
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new GuphassanaSite();
});

// Adicionar CSS para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        font-weight: 500;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(notificationStyles);
