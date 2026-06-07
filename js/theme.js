// Модуль переключения тем с анимацией иконки
(function() {
    const THEME_KEY = 'lunary_theme';
    const themeBtn = document.getElementById('change-theme-btn');
    const iconContainer = document.getElementById('theme-icon'); // id добавлен в HTML
    if (!themeBtn || !iconContainer) return;

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        animateIcon(theme);
        toggleCanvas(theme);
    }

    function animateIcon(theme) {
        // плавно скрываем
        iconContainer.classList.add('icon-hidden');
        setTimeout(() => {
            // заменяем SVG
            iconContainer.innerHTML = theme === 'light' ?
                `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>` :
                `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>`;
            // плавно показываем
            iconContainer.classList.remove('icon-hidden');
        }, 300);
    }

    function toggleCanvas(theme) {
        const canvas = document.getElementById('scene');
        if (!canvas) return;
        if (theme === 'light') {
            canvas.style.display = 'none';
            if (typeof window.stopCanvas === 'function') window.stopCanvas();
        } else {
            canvas.style.display = 'block';
            if (typeof window.startCanvas === 'function') window.startCanvas();
        }
    }

    themeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Инициализация при загрузке
    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    if (saved === 'light') {
        iconContainer.innerHTML = `<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>`;
    }
    applyTheme(saved);
})();