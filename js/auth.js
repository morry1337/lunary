// Модуль авторизации администратора
(function() {
    const loginModal = document.getElementById('login-modal');
    const loginRequired = document.getElementById('login-required');
    const adminContent = document.getElementById('admin-content');
    const showLoginBtn = document.getElementById('show-login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const loginSubmit = document.getElementById('login-submit');
    const loginClose = document.getElementById('login-close');

    // Проверка сохранённой сессии
    function isLoggedIn() {
        return localStorage.getItem('adminLoggedIn') === 'true';
    }

    function setLoggedIn(value) {
        if (value) {
            localStorage.setItem('adminLoggedIn', 'true');
        } else {
            localStorage.removeItem('adminLoggedIn');
        }
    }

    // Показать админ-панель и скрыть заглушку
    function showAdminContent() {
        if (loginRequired) loginRequired.style.display = 'none';
        if (adminContent) adminContent.style.display = 'flex';
        // Активируем первую вкладку
        const firstTab = document.querySelector('.admin-tabs .tab[data-tab="news"]');
        if (firstTab) {
            document.querySelectorAll('.admin-tabs .tab').forEach(t => t.classList.remove('active'));
            firstTab.classList.add('active');
            if (window.renderTab) window.renderTab('news');
        }
    }

    // Показать заглушку и скрыть панели
    function showLoginRequired() {
        if (loginRequired) loginRequired.style.display = 'flex';
        if (adminContent) adminContent.style.display = 'none';
        if (loginModal) loginModal.style.display = 'none';
    }

    // Выход
    function logout() {
        setLoggedIn(false);
        showLoginRequired();
    }

    // Открыть форму входа
    function openLoginModal() {
        if (loginModal) {
            loginModal.style.display = 'flex';
            if (loginUsername) loginUsername.value = '';
            if (loginPassword) loginPassword.value = '';
        }
    }

    function closeLoginModal() {
        if (loginModal) loginModal.style.display = 'none';
    }

    // Привязка событий
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', openLoginModal);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    if (loginClose) {
        loginClose.addEventListener('click', closeLoginModal);
    }

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) closeLoginModal();
        });
    }

    // Авторизация
    async function authenticate(username, password) {
        const admin = window.AppData.admins.find(a => a.username === username && a.password === password);
        if (admin) return { success: true, admin };
        return { success: false };
    }

    if (loginSubmit) {
        loginSubmit.addEventListener('click', async () => {
            const user = loginUsername.value.trim();
            const pass = loginPassword.value.trim();
            if (!user || !pass) return alert('Enter credentials');
            const result = await authenticate(user, pass);
            if (result.success) {
                setLoggedIn(true);
                closeLoginModal();
                showAdminContent();
            } else {
                alert('Invalid login or password');
            }
        });
    }

    // Инициализация страницы
    if (window.location.pathname.includes('/administration/')) {
        if (isLoggedIn()) {
            showAdminContent();
        } else {
            showLoginRequired();
        }
    }
})();