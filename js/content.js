// Управление контентом сайта в админ-панели
window.renderSiteContentTab = function(container) {
    const data = window.AppData.siteContent;
    let html = `<table class="data-table"><tbody>
        <tr><td>Project Name</td><td><input type="text" id="site-name" value="${data.projectName}"></td></tr>
        <tr><td>Logo URL</td><td><input type="text" id="site-logo" value="${data.logoUrl}"></td></tr>
        <tr><td>Telegram Channel</td><td><input type="text" id="site-channel" value="${data.social.channel}"></td></tr>
        <tr><td>Telegram Bot</td><td><input type="text" id="site-bot" value="${data.social.bot}"></td></tr>
        <tr><td>Founder</td><td><input type="text" id="site-founder" value="${data.social.founder}"></td></tr>
    </tbody></table>
    <button class="btn primary" id="save-site" style="margin-top:1rem;">Save Changes</button>`;
    
    container.innerHTML = html;

    document.getElementById('save-site').addEventListener('click', () => {
        data.projectName = document.getElementById('site-name').value;
        data.logoUrl = document.getElementById('site-logo').value;
        data.social.channel = document.getElementById('site-channel').value;
        data.social.bot = document.getElementById('site-bot').value;
        data.social.founder = document.getElementById('site-founder').value;
        
        // Применяем изменения на всех страницах
        const logoText = document.querySelector('.navbar__logo-text');
        const logoImg = document.querySelector('.navbar__logo-img');
        if (logoText) logoText.textContent = data.projectName;
        if (logoImg) logoImg.src = data.logoUrl;
        
        const channelLink = document.querySelector('a[href*="LunaryNew"]');
        const botLink = document.querySelector('a[href*="lunarygames_bot"]');
        const founderLink = document.querySelector('a[href*="whcxze"]');
        if (channelLink) channelLink.href = data.social.channel;
        if (botLink) botLink.href = data.social.bot;
        if (founderLink) founderLink.href = data.social.founder;
        
        window.AppData.saveData();
        alert('Site content updated');
    });
};