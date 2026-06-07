// Модуль админ-панели: переключение вкладок и управление администраторами
window.renderTab = function(tabName) {
    const container = document.getElementById('tab-content');
    if (!container) return;
    switch(tabName) {
        case 'news': window.renderNewsTab(container); break;
        case 'site': window.renderSiteContentTab(container); break;
        case 'admins': window.renderAdminsTab(container); break;
        case 'tickets': window.renderTicketsTab(container); break;   // <-- добавлено
    }
};

// Рендер вкладки Admin Management
window.renderAdminsTab = function(container) {
    const data = window.AppData;
    let html = `<div class="form-row">
        <input type="text" id="new-admin-user" placeholder="Username">
        <input type="password" id="new-admin-pass" placeholder="Password">
        <button class="btn small primary" id="add-admin">Add</button>
    </div>
    <table class="data-table"><thead><tr><th>Username</th><th>Actions</th></tr></thead><tbody>`;
    
    data.admins.forEach(a => {
        html += `<tr>
            <td>${a.username}</td>
            <td class="action-btns">
                <button class="icon-btn edit-admin" data-id="${a.id}">✎</button>
                <button class="icon-btn danger delete-admin" data-id="${a.id}">✕</button>
            </td>
        </tr>`;
    });
    
    html += `</tbody></table>`;
    container.innerHTML = html;

    document.getElementById('add-admin').addEventListener('click', () => {
        const user = document.getElementById('new-admin-user').value.trim();
        const pass = document.getElementById('new-admin-pass').value.trim();
        if (!user || !pass) return alert('Fill fields');
        data.admins.push({ id: data.getNextId(data.admins), username: user, password: pass });
        data.saveData();
        window.renderAdminsTab(container);
    });

    document.querySelectorAll('.delete-admin').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            if (id === 1) return alert('Cannot delete primary admin');
            data.admins = data.admins.filter(a => a.id !== id);
            data.saveData();
            window.renderAdminsTab(container);
        });
    });

    document.querySelectorAll('.edit-admin').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const admin = data.admins.find(a => a.id === id);
            if (!admin) return;
            const newPass = prompt('Enter new password for ' + admin.username);
            if (newPass) {
                admin.password = newPass;
                data.saveData();
                window.renderAdminsTab(container);
            }
        });
    });
};

// Новая функция: рендер вкладки Обращения
window.renderTicketsTab = function(container) {
    const data = window.AppData;
    let html = `
        <div class="tickets-container">
            <div class="tickets-filter">
                <button class="ticket-filter-btn active" data-filter="active">Активные</button>
                <button class="ticket-filter-btn" data-filter="in_process">В процессе</button>
                <button class="ticket-filter-btn" data-filter="closed">Закрытые</button>
            </div>
            <div class="tickets-list" id="tickets-list"></div>
        </div>
    `;
    container.innerHTML = html;

    const filterBtns = container.querySelectorAll('.ticket-filter-btn');
    const listContainer = container.querySelector('#tickets-list');

    function renderList(filter) {
        const tickets = data.ticketsData.filter(t => t.status === filter);
        listContainer.innerHTML = tickets.length ? tickets.map(t => `
            <div class="ticket-card">
                <div class="ticket-subject">${t.subject}</div>
                <div class="ticket-date">${t.date}</div>
                <div class="ticket-desc">${t.description}</div>
            </div>
        `).join('') : '<p class="tickets-empty">Нет обращений</p>';
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderList(btn.dataset.filter);
        });
    });

    renderList('active'); // по умолчанию активные
};

// Инициализация переключения вкладок
(function() {
    const tabs = document.querySelectorAll('.admin-tabs .tab');
    if (!tabs.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            window.renderTab(tab.dataset.tab);
        });
    });
})();