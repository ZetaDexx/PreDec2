// Cookie Consent
const cookieConsent = document.getElementById('cookie-consent');
const cookieAccept = document.getElementById('cookie-accept');

if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
        cookieConsent.classList.remove('hidden');
    }, 2000);
}

cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieConsent.classList.add('hidden');
});

// Функционал загрузки файла и валидации
const fileInput = document.getElementById('file-upload');
const emailInput = document.getElementById('email');
const consentCheckbox = document.getElementById('consent');
const calculateBtn = document.getElementById('calculate-btn');
const form = document.getElementById('calc-form');
const loading = document.getElementById('loading');
const resultsContent = document.getElementById('results-content');

// Валидация формы
function validateForm() {
    const isFileSelected = fileInput.files.length > 0;
    const isEmailValid = emailInput.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
    const isConsentChecked = consentCheckbox.checked;
    
    calculateBtn.disabled = !(isFileSelected && isEmailValid && isConsentChecked);
    
    // Валидация email
    const emailGroup = emailInput.closest('.mb-6');
    const emailError = emailGroup.querySelector('.invalid-feedback');
    if (emailInput.value && !isEmailValid) {
        emailError.classList.remove('hidden');
    } else {
        emailError.classList.add('hidden');
    }
}

// Обработка загрузки файла
function handleFiles(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const validTypes = [
        'application/pdf',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
        alert('Поддерживаются только PDF, DOCX и TXT файлы');
        return;
    }
    
    if (file.size > 30 * 1024 * 1024) {
        alert('Максимальный размер файла: 30MB');
        return;
    }
    
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('file-info').classList.remove('hidden');
    document.querySelector('.invalid-feedback')?.classList.add('hidden');
    validateForm();
}

// Слушатели событий
fileInput.addEventListener('change', handleFiles);
emailInput.addEventListener('input', validateForm);
consentCheckbox.addEventListener('change', validateForm);

// Инициализация
validateForm();

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const modal = document.getElementById('results-modal');
    const loading = document.getElementById('loading');
    const resultsContent = document.getElementById('results-content');
    
    modal.classList.remove('hidden');
    loading.classList.remove('hidden');
    resultsContent.classList.add('hidden');
    
    try {
        const formData = new FormData(form);
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Ошибка сервера');
        
        // Обновляем данные в модальном окне
        document.getElementById('probability').textContent = `${data.probability}%`;
        document.getElementById('result-title').textContent = data.title;
        document.getElementById('result-subtitle').textContent = data.subtitle;
        
        const keyPointsList = document.getElementById('key-points');
        keyPointsList.innerHTML = data.keyPoints
            .map(point => `<li>${point}</li>`)
            .join('');
            
        document.getElementById('recommendations').textContent = data.recommendations;
        
        // Анимация круговой диаграммы
        const circle = document.getElementById('result-circle');
        const circumference = 2 * Math.PI * 15.9155;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference * ((100 - data.probability)/100);
        
        loading.classList.add('hidden');
        resultsContent.classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        loading.classList.add('hidden');
        resultsContent.innerHTML = `
            <div class="p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                ${error.message || 'Произошла ошибка при анализе'}
            </div>
        `;
        resultsContent.classList.remove('hidden');
    }
});

class ScrollManager {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
        this.init();
        this.initScrollCue();
        this.setupScrollRestoration();
        this.initMobileMenu();
        this.initLogoScroll();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupPreloader();
        this.addResizeListener();
        this.setupFileUpload();
        this.setupFAQ();
        this.setupModal();
    }
    
    initScrollCue() {
        const cue = document.getElementById('scroll-cue');
        let timeoutId, lastScroll = 0;
        
        const showCue = () => {
            if (window.scrollY === 0 && window.innerHeight < document.documentElement.scrollHeight) {
                cue.style.opacity = '1';
                timeoutId = setTimeout(hideCue, 17000);
            }
        }
        
        const hideCue = () => {
            cue.style.opacity = '0';
        }
        
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (Math.abs(currentScroll - lastScroll) > 50 || currentScroll === 0) {
                clearTimeout(timeoutId);
                hideCue();
            }
            lastScroll = currentScroll;
        }
        
        // Показать через x милисекунд если пользователь неактивен
        setTimeout(showCue, 500);
        
        // Отслеживание взаимодействий
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', hideCue);
        window.addEventListener('touchstart', hideCue);
    }
    
    initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const closeButton = document.getElementById('close-menu');
        const menuOverlay = document.getElementById('menu-overlay');
        let isMenuOpen = false;
        
        const toggleMenu = (shouldOpen) => {
            isMenuOpen = typeof shouldOpen === 'boolean' ? shouldOpen : !isMenuOpen;
            mobileMenu.classList.toggle('active', isMenuOpen);
            document.body.classList.toggle('no-scroll', isMenuOpen);
        };
        
        // Открытие меню
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(true);
        });
        
        // Закрытие меню
        closeButton.addEventListener('click', () => toggleMenu(false));
        menuOverlay.addEventListener('click', () => toggleMenu(false));
        
        // Закрытие при клике на ссылки
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(false));
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) toggleMenu(false);
        });
        
        // Сброс при изменении размера окна
        window.addEventListener('resize', () => {
            if (window.innerWidth > 767 && isMenuOpen) toggleMenu(false);
        });
    }
    
    initLogoScroll() {
        const logo = document.getElementById('logo');
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    setupScrollRestoration() {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('scrollPosition', window.scrollY);
        });
        
        window.addEventListener('load', () => {
            const savedScrollPosition = localStorage.getItem('scrollPosition');
            if (savedScrollPosition !== null) {
                window.scrollTo(0, savedScrollPosition);
            } else {
                window.scrollTo(0, 0);
            }
            requestAnimationFrame(() => {
                document.documentElement.style.scrollBehavior = 'auto';
            });
        });
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('active', entry.isIntersecting);
            });
        }, this.observerOptions);
        
        this.sections.forEach(section => observer.observe(section));
    }
    
    setupNavigation() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    this.closeMobileMenu();
                }
            });
        });
        
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }
    
    updateActiveNavLink() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                this.navLinks.forEach(link => {
                    const isActive = link.getAttribute('href') === `#${id}`;
                    link.classList.toggle('text-indigo-600', isActive);
                    link.setAttribute('aria-current', isActive ? 'page' : 'false');
                });
            }
        });
    }
    
    setupFileUpload() {
        const fileUpload = document.getElementById('file-upload');
        const dropArea = document.getElementById('drop-area');
        const validTypes = [
            'application/pdf',
            'text/plain',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        const highlight = () => dropArea.classList.add('border-indigo-500', 'bg-indigo-50');
        const unhighlight = () => dropArea.classList.remove('border-indigo-500', 'bg-indigo-50');
        
        ['dragenter', 'dragover'].forEach(event => {
            dropArea.addEventListener(event, highlight);
        });
        
        ['dragleave', 'drop'].forEach(event => {
            dropArea.addEventListener(event, unhighlight);
        });
        
        dropArea.addEventListener('drop', e => {
            const files = e.dataTransfer.files;
            this.handleFiles({ target: { files } });
        });
        
        fileUpload.addEventListener('change', e => this.handleFiles(e));
    }
    
    handleFiles(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!validTypes.includes(file.type)) {
            alert('Поддерживаются только PDF, DOCX и TXT файлы');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            alert('Максимальный размер файла: 5MB');
            return;
        }
        
        document.getElementById('file-name').textContent = file.name;
        document.getElementById('file-info').classList.remove('hidden');
        document.getElementById('calculate-btn').disabled = false;
    }
    
    setupFAQ() {
        document.querySelectorAll('.faq-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const content = toggle.nextElementSibling;
                const icon = toggle.querySelector('i');
                content.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
            });
        });
    }
    
    setupModal() {
        const modal = document.getElementById('results-modal');
        document.getElementById('calculate-btn').addEventListener('click', () => {
            modal.classList.remove('hidden');
            setTimeout(() => this.showResults(), 2000);
        });
        
        document.getElementById('close-modal').addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }
    
    showResults() {
        // Логика отображения результатов
    }
    
    setupPreloader() {
        window.addEventListener('load', () => {
            document.getElementById('preloader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('preloader').style.display = 'none';
            }, 500);
        });
    }
    
    addResizeListener() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('resize-animation-stopper');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove('resize-animation-stopper');
            }, 400);
        });
    }
    
    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new ScrollManager();
});
