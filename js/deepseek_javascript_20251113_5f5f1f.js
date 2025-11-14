document.addEventListener('DOMContentLoaded', function() {
    console.log('🌍 Associação Guphassana - Site inicializado');
    
    // Gerenciamento da Loading Screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 500);
            }, 1000);
        });

        // Fallback caso a página demore muito para carregar
        setTimeout(() => {
            if (loadingScreen.style.display !== 'none') {
                loadingScreen.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }, 5000);
    }

    // Sistema de Navegação
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.main-header');

    // Navegação suave
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            scrollToSection(targetId, link);
        });
    });

    function scrollToSection(sectionId, clickedLink = null) {
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const offsetTop = targetSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            if (clickedLink) {
                navLinks.forEach(l => l.classList.remove('active'));
                clickedLink.classList.add('active');
            }
        }
    }

    // Efeito de header ao scroll
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

    // Observer para navegação ativa
    const sections = document.querySelectorAll('section[id]');
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

    // Sistema de Modais
    const donationModal = document.getElementById('donationModal');
    const volunteerModal = document.getElementById('volunteerModal');

    // Abrir modais
    document.getElementById('donate-btn')?.addEventListener('click', () => openModal(donationModal));
    document.getElementById('hero-donate')?.addEventListener('click', () => openModal(donationModal));
    document.getElementById('hero-volunteer')?.addEventListener('click', () => openModal(volunteerModal));

    // Fechar modais
    document.getElementById('closeDonationModal')?.addEventListener('click', () => closeModal(donationModal));
    document.getElementById('closeVolunteerModal')?.addEventListener('click', () => closeModal(volunteerModal));

    // Fechar modal ao clicar fora
    [donationModal, volunteerModal].forEach(modal => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(donationModal);
            closeModal(volunteerModal);
        }
    });

    function openModal(modal) {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '15px';
            
            // Reset do modal de doação ao abrir
            if (modal === donationModal) {
                resetDonationForm();
            }
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
    }

    // Sistema de Formulário de Contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleContactForm(contactForm);
        });
    }

    function handleContactForm(form) {
        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const message = formData.get('message').trim();

        // Validação
        if (!name || !email || !message) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Por favor, insira um email válido.', 'error');
            return;
        }

        if (message.length < 10) {
            showNotification('A mensagem deve ter pelo menos 10 caracteres.', 'error');
            return;
        }

        // Simular envio
        showNotification('Mensagem enviada com sucesso! Entraremos em contacto em breve.', 'success');
        form.reset();
        
        console.log(`📧 Formulário enviado: ${name} (${email})`);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Sistema de Notificações
    function showNotification(message, type = 'info') {
        // Remover notificações existentes
        document.querySelectorAll('.notification').forEach(notification => {
            notification.remove();
        });

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close" aria-label="Fechar notificação">&times;</button>
            </div>
        `;

        const styles = {
            success: '#27ae60',
            error: '#e74c3c',
            info: '#3498db'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${styles[type] || styles.info};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 3000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        // Adicionar animação CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto-remover após 5 segundos
        const autoRemove = setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);

        // Fechar manualmente
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        });
    }

    // SISTEMA DE DOAÇÕES COMPLETO
    let selectedAmount = 0;
    let selectedMethod = '';

    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmount = document.getElementById('customAmount');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const finalizeBtn = document.getElementById('finalizeDonation');
    const paymentDetails = document.getElementById('paymentDetails');

    // Configurar botões de valor
    amountButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('💰 Valor selecionado:', button.getAttribute('data-amount'));
            amountButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedAmount = parseInt(button.getAttribute('data-amount'));
            if (customAmount) customAmount.value = '';
            updateDonationButton();
        });
    });

    // Valor customizado
    if (customAmount) {
        customAmount.addEventListener('input', () => {
            console.log('💰 Valor customizado:', customAmount.value);
            amountButtons.forEach(btn => btn.classList.remove('active'));
            selectedAmount = parseInt(customAmount.value) || 0;
            updateDonationButton();
        });

        customAmount.addEventListener('focus', () => {
            amountButtons.forEach(btn => btn.classList.remove('active'));
        });
    }

    // Métodos de pagamento
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            const method = option.getAttribute('data-method');
            console.log('💳 Método selecionado:', method);
            
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedMethod = method;
            showPaymentDetails(selectedMethod);
            updateDonationButton();
        });
    });

    // Finalizar doação
    if (finalizeBtn) {
        finalizeBtn.addEventListener('click', processDonation);
    }

    function showPaymentDetails(method) {
        if (!paymentDetails) {
            console.error('❌ Elemento paymentDetails não encontrado');
            return;
        }

        const details = {
            mpesa: `
                <h5>💰 M-Pesa</h5>
                <p><strong>📱 Número:</strong> 82 393 3624</p>
                <p><strong>👤 Nome:</strong> Associação Guphassana</p>
                <p><small>💡 Use a referência: "DOAÇÃO" no campo de descrição</small></p>
            `,
            emola: `
                <h5>💳 e-Mola</h5>
                <p><strong>📱 Número:</strong> 82 393 3624</p>
                <p><strong>👤 Nome:</strong> Associação Guphassana</p>
                <p><small>💡 Transação: Doação para projetos sociais</small></p>
            `,
            bank: `
                <h5>🏦 Transferência Bancária</h5>
                <p><strong>Banco:</strong> Standard Bank Moçambique</p>
                <p><strong>📋 Conta:</strong> 1234567890</p>
                <p><strong>🔢 NIB:</strong> 00080001234567890</p>
                <p><strong>👤 Titular:</strong> Associação Guphassana</p>
            `,
            paypal: `
                <h5>🌐 PayPal</h5>
                <p><strong>📧 Email:</strong> info.guphassana@gmail.com</p>
                <p><small>💡 Envie para o email acima com a descrição "Doação"</small></p>
            `
        };

        paymentDetails.innerHTML = details[method] || '<p>Selecione um método de pagamento</p>';
        console.log('📋 Detalhes de pagamento atualizados para:', method);
    }

    function updateDonationButton() {
        if (!finalizeBtn) {
            console.error('❌ Botão finalizeDonation não encontrado');
            return;
        }

        console.log('🔄 Atualizando botão - Valor:', selectedAmount, 'Método:', selectedMethod);

        if (selectedAmount > 0 && selectedMethod) {
            finalizeBtn.disabled = false;
            finalizeBtn.innerHTML = `
                <i class="fas fa-heart"></i>
                <span>Doar ${selectedAmount.toLocaleString('pt-MZ')} MT via ${selectedMethod.toUpperCase()}</span>
            `;
            console.log('✅ Botão ativado');
        } else {
            finalizeBtn.disabled = true;
            finalizeBtn.innerHTML = `
                <i class="fas fa-heart"></i>
                <span>Finalizar Doação</span>
            `;
            console.log('❌ Botão desativado - faltam seleções');
        }
    }

    function resetDonationForm() {
        console.log('🔄 Resetando formulário de doação');
        selectedAmount = 0;
        selectedMethod = '';
        
        amountButtons.forEach(btn => btn.classList.remove('active'));
        paymentOptions.forEach(opt => opt.classList.remove('active'));
        
        if (customAmount) customAmount.value = '';
        if (paymentDetails) paymentDetails.innerHTML = '<p>Selecione um método de pagamento para ver os detalhes</p>';
        
        updateDonationButton();
    }

    function processDonation() {
        console.log('🚀 Processando doação...');
        
        if (selectedAmount === 0 || !selectedMethod) {
            showNotification('Por favor, selecione um valor e método de pagamento.', 'error');
            console.error('❌ Doação falhou - seleções incompletas');
            return;
        }

        const amountText = selectedAmount.toLocaleString('pt-MZ') + ' MT';
        const message = `Obrigado pela sua doação de ${amountText}! Instruções de pagamento foram enviadas para ${selectedMethod.toUpperCase()}.`;

        showNotification(message, 'success');
        closeModal(donationModal);
        
        console.log(`💸 Doação processada com sucesso: ${amountText} via ${selectedMethod}`);
        
        // Reset após sucesso
        setTimeout(resetDonationForm, 1000);
    }

    // Contadores animados para estatísticas
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const target = parseInt(statNumber.getAttribute('data-count'));
                animateCounter(statNumber, target);
                counterObserver.unobserve(statNumber);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    statNumbers.forEach(stat => {
        if (stat.hasAttribute('data-count')) {
            counterObserver.observe(stat);
        }
    });

    function animateCounter(element, target) {
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
            const hasPlus = element.textContent.includes('+');
            element.textContent = displayValue.toLocaleString('pt-MZ') + (hasPlus ? '+' : '');
        }, 16);
    }

    // Animações de entrada para elementos
    const fadeElements = document.querySelectorAll('.access-card, .work-card, .project-card, .story-card, .mv-item');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });

    // Inicializar sistema de doações
    resetDonationForm();

    console.log('✅ Todos os sistemas inicializados com sucesso');
});

// Garantir que tudo funcione após carregamento completo
window.addEventListener('load', function() {
    console.log('🎉 Página totalmente carregada - Associação Guphassana');
});

// Adicionar estilos para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        color: white;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 15px;
        padding: 0;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(255,255,255,0.2);
    }
`;
document.head.appendChild(notificationStyles);
