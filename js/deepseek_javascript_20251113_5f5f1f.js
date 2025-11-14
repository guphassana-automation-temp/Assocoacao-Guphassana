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

    // Sistema de Tradução
    const langButtons = document.querySelectorAll('.lang-btn');
    let currentLang = 'pt';
    
    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.id.replace('translate-', '');
            switchLanguage(lang, button);
        });
    });

    function switchLanguage(lang, clickedButton = null) {
        currentLang = lang;
        
        // Atualizar botões ativos
        if (clickedButton) {
            langButtons.forEach(btn => btn.classList.remove('active'));
            clickedButton.classList.add('active');
        }
        
        // Atualizar conteúdo por idioma
        document.querySelectorAll('[data-lang]').forEach(element => {
            if (element.getAttribute('data-lang') === lang) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });

        // Atualizar atributos de acessibilidade
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

    // Sistema de Doações
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
            amountButtons.forEach(btn => btn.classList.remove('active'));
            selectedAmount = parseInt(customAmount.value) || 0;
            updateDonationButton();
        });
    }

    // Métodos de pagamento
    paymentOptions.forEach(option => {
        option.addEventListener('click', () => {
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedMethod = option.getAttribute('data-method');
            showPaymentDetails(selectedMethod);
            updateDonationButton();
        });
    });

    // Finalizar doação
    if (finalizeBtn) {
        finalizeBtn.addEventListener('click', processDonation);
    }

    function showPaymentDetails(method) {
        if (!paymentDetails) return;

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

        paymentDetails.innerHTML = details[method] || '<p>Selecione um método de pagamento</p>';
    }

    function updateDonationButton() {
        if (!finalizeBtn) return;

        if (selectedAmount > 0 && selectedMethod) {
            finalizeBtn.disabled = false;
            
            // Atualizar texto do botão com informações
            const amountText = selectedAmount.toLocaleString('pt-MZ') + ' MT';
            const methodText = selectedMethod.toUpperCase();
            
            // Atualizar textos em todos os idiomas
            ['pt', 'en', 'fr'].forEach(lang => {
                const elements = finalizeBtn.querySelectorAll(`[data-lang="${lang}"]`);
                if (elements.length > 0) {
                    const text = {
                        'pt': `Doar ${amountText} via ${methodText}`,
                        'en': `Donate ${amountText} via ${methodText}`,
                        'fr': `Donner ${amountText} via ${methodText}`
                    };
                    elements[0].textContent = text[lang];
                }
            });
        } else {
            finalizeBtn.disabled = true;
            // Restaurar texto original
            ['pt', 'en', 'fr'].forEach(lang => {
                const elements = finalizeBtn.querySelectorAll(`[data-lang="${lang}"]`);
                if (elements.length > 0) {
                    const text = {
                        'pt': 'Finalizar Doação',
                        'en': 'Finalize Donation',
                        'fr': 'Finaliser le Don'
                    };
                    elements[0].textContent = text[lang];
                }
            });
        }
    }

    function resetDonationForm() {
        selectedAmount = 0;
        selectedMethod = '';
        
        amountButtons.forEach(btn => btn.classList.remove('active'));
        paymentOptions.forEach(opt => opt.classList.remove('active'));
        
        if (customAmount) customAmount.value = '';
        if (paymentDetails) paymentDetails.innerHTML = '';
        
        updateDonationButton();
    }

    function processDonation() {
        if (selectedAmount === 0 || !selectedMethod) {
            showNotification('Por favor, selecione um valor e método de pagamento.', 'error');
            return;
        }

        const amountText = selectedAmount.toLocaleString('pt-MZ') + ' MT';
        const messages = {
            'pt': `Obrigado pela sua doação de ${amountText}! Instruções de pagamento foram enviadas para o método selecionado.`,
            'en': `Thank you for your donation of ${amountText}! Payment instructions have been sent to the selected method.`,
            'fr': `Merci pour votre don de ${amountText}! Les instructions de paiement ont été envoyées à la méthode sélectionnée.`
        };

        showNotification(messages[currentLang] || messages['pt'], 'success');
        closeModal(donationModal);
        
        console.log(`💸 Doação processada: ${amountText} via ${selectedMethod}`);
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
        counterObserver.observe(stat);
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
            element.textContent = displayValue.toLocaleString('pt-MZ') + (element.textContent.includes('+') ? '+' : '');
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

    // Inicializar sistema de tradução com Português como padrão
    switchLanguage('pt', document.getElementById('translate-pt'));

    console.log('✅ Todos os sistemas inicializados com sucesso');
});

// Garantir que tudo funcione após carregamento completo
window.addEventListener('load', function() {
    console.log('🎉 Página totalmente carregada - Associação Guphassana');
});
