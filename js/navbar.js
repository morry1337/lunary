// Управление навбаром
(function() {
    const navbar = document.getElementById('navbar');
    const burger = document.getElementById('burger');
    const overlayBg = document.getElementById('overlay-bg');

    if (!navbar || !burger) return;

    function closeNavbar() {
        navbar.classList.remove('open');
        burger.classList.remove('active');
        if (overlayBg) overlayBg.style.display = 'none';
    }

    burger.addEventListener('click', () => {
        if (navbar.classList.contains('open')) {
            closeNavbar();
        } else {
            navbar.classList.add('open');
            burger.classList.add('active');
            if (overlayBg) overlayBg.style.display = 'block';
        }
    });

    if (overlayBg) {
        overlayBg.addEventListener('click', closeNavbar);
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && navbar.classList.contains('open')) {
            closeNavbar();
        }
    });
})();