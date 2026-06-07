(function() {
    if (window.AppData && window.AppData.siteContent) {
        const data = window.AppData.siteContent;
        const logoText = document.querySelector('.navbar__logo-text');
        const logoImg = document.querySelector('.navbar__logo-img');
        if (logoText) logoText.textContent = data.projectName;
        if (logoImg) logoImg.src = data.logoUrl;
    }

    function updateOverlayPosition() {
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.style.left = window.innerWidth > 768 ? '290px' : '0';
        }
    }

    updateOverlayPosition();
    window.addEventListener('resize', updateOverlayPosition);
})();