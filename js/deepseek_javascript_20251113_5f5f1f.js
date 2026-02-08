// Associação Guphassana - Main JavaScript File
class GuphassanaApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Associação Guphassana - Aplicação inicializada');
        
        // Inicializar componentes
        this.initLoadingScreen();
        this.initNavigation();
        this.initModals();
        this.initScrollEffects();
        this.initEventListeners();
        
        // Marcar como carregado
        document.body.classList.add('loaded');
    }

    // ===== LOADING SCREEN =====
    initLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;

        // Simular carregamento (remover em produção)
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            
            // Remover após animação
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1500);

        // Fallback para caso demore muito
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.remove();
            }
        }, 5000);
    }

    // ===== NAVEGAÇÃO =====
    initNavigation() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');
        const header = document.getElementById('mainHeader');

        // Toggle do menu mobile
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Fechar menu ao clicar em um link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    // Atualizar link ativo
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                });
            });
        }

        // Efeito de scroll no header
        if (header) {
            let lastScroll = 0;
            
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 100) {
                    header.classList.add('scrolled');
                    
                    if (currentScroll > lastScroll && currentScroll > 200) {
                        header.style.transform = 'translateY(-100%)';
                    } else {
                        header.style.transform = 'translateY(0)';
                    }
                } else {
                    header.classList.remove('scrolled');
                    header.style.transform = 'translateY(0)';
                }
                
                lastScroll = currentScroll;
            });
        }

        // Navegação suave
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = header ? header.offsetHeight : 0;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Atualizar link ativo baseado na seção visível
        this.initActiveNavigation();
    }

    initActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[data-nav]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        
                        if (link.getAttribute('data-nav') === activeId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    // ===== MODAIS =====
    initModals() {
        // Modal de Doação
        const donationModal = document.getElementById('donationModal');
        const donateButtons = document.querySelectorAll('.btn-donate-nav, .btn-primary');
        
        donateButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(donationModal);
            });
        });

        // Fechar modal ao clicar fora
        if (donationModal) {
            donationModal.addEventListener('click', (e) => {
                if (e.target === donationModal) {
                    this.closeModal(donationModal);
                }
            });

            // Fechar com ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModal(donationModal);
                }
            });
        }
    }

    openModal(modal) {
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // ===== EFEITOS DE SCROLL =====
    initScrollEffects() {
        // Revelar elementos ao scroll
        const revealElements = document.querySelectorAll('.section-header, .hero-content');
        
        const revealObserver = new IntersectionObserver((entries) => {
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

        revealElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(element);
        });
    }

    // ===== EVENT LISTENERS GERAIS =====
    initEventListeners() {
        // Prevenir envio de formulários por enquanto
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Formulário enviado com sucesso! Entraremos em contacto em breve.');
                form.reset();
            });
        });

        // Animações de botões
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que tudo está pronto
    setTimeout(() => {
        window.guphassanaApp = new GuphassanaApp();
    }, 100);
});

// ===== FALLBACKS =====
if (typeof window.IntersectionObserver === 'undefined') {
    console.warn('IntersectionObserver não suportado pelo navegador');
    
    // Fallback simples
    document.addEventListener('DOMContentLoaded', () => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 2000);
        }
    });
}

// ===== FUNÇÕES UTILITÁRIAS =====
function showNotification(message, type = 'success') {
    // Implementação será adicionada posteriormente
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
        minimumFractionDigits: 0
    }).format(amount);
}
