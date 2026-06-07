// Модуль управления страницей обращений (tickets)
(function() {
    const loginRequired = document.getElementById('login-required');
    const ticketsContent = document.getElementById('tickets-content');
    const loginModal = document.getElementById('login-modal');
    const showLoginBtn = document.getElementById('show-login-btn');
    const loginUsername = document.getElementById('login-username');
    const loginPassword = document.getElementById('login-password');
    const loginSubmit = document.getElementById('login-submit');
    const loginClose = document.getElementById('login-close');
    const listView = document.getElementById('tickets-list-view');
    const detailView = document.getElementById('ticket-detail-view');
    const ticketsList = document.getElementById('tickets-list');

    let currentFilter = 'active';

    function isLoggedIn() {
        return localStorage.getItem('adminLoggedIn') === 'true';
    }

    function showLoginRequired() {
        if (loginRequired) loginRequired.style.display = 'flex';
        if (ticketsContent) ticketsContent.style.display = 'none';
    }

    function showTickets() {
        if (loginRequired) loginRequired.style.display = 'none';
        if (ticketsContent) ticketsContent.style.display = 'block';
        showListView();
    }

    function showListView() {
        if (listView) listView.style.display = 'block';
        if (detailView) detailView.style.display = 'none';
        renderTickets(currentFilter);
    }

    function showDetailView(ticketId) {
        if (listView) listView.style.display = 'none';
        if (detailView) detailView.style.display = 'block';
        renderDetail(ticketId);
    }

    // Рендер списка тикетов
    function renderTickets(filter) {
        currentFilter = filter;
        if (!ticketsList) return;
        const tickets = window.AppData.ticketsData.filter(t => t.status === filter);
        ticketsList.innerHTML = tickets.length ? tickets.map(t => `
            <div class="ticket-card" data-id="${t.id}">
                <div class="ticket-info">
                    <div class="ticket-subject">${t.subject}</div>
                    <div class="ticket-date">${t.date}</div>
                    <div class="ticket-desc">${t.description || 'Нет описания'}</div>
                    <div class="ticket-status status-${t.status}">
                        ${t.status === 'active' ? 'Активен' : t.status === 'in_process' ? 'В процессе' : 'Закрыт'}
                    </div>
                </div>
                <div class="ticket-actions">
                    <button class="btn-small delete-btn" data-id="${t.id}">Удалить</button>
                </div>
            </div>
        `).join('') : '<p class="tickets-empty">Нет обращений</p>';

        // Обновление активной кнопки фильтра
        document.querySelectorAll('.ticket-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) btn.classList.add('active');
        });
    }

    // Делегирование клика по карточке (один раз)
    ticketsList.addEventListener('click', (e) => {
        const card = e.target.closest('.ticket-card');
        if (!card) return;
        // Если клик по кнопке удаления — не переходим в детали
        if (e.target.closest('.delete-btn')) return;
        const id = parseInt(card.dataset.id);
        showDetailView(id);
    });

    // Делегирование клика по кнопкам удаления в списке
    ticketsList.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-btn');
        if (!btn) return;
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        if (confirm('Удалить обращение?')) {
            window.AppData.ticketsData = window.AppData.ticketsData.filter(t => t.id !== id);
            window.AppData.saveData();
            renderTickets(currentFilter);
        }
    });

    // Кнопки фильтра
    document.querySelectorAll('.ticket-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            renderTickets(btn.dataset.filter);
        });
    });

    // Детальный просмотр тикета
    function renderDetail(ticketId) {
        const ticket = window.AppData.ticketsData.find(t => t.id === ticketId);
        if (!ticket) return;

        let html = `
            <div class="ticket-detail">
                <button class="back-btn" id="back-to-list">← Назад</button>
                <h3 class="ticket-subject" style="margin-bottom:1rem;">${ticket.subject}</h3>
                <div class="ticket-status status-${ticket.status}" style="margin-bottom:1rem;">
                    Статус: ${ticket.status === 'active' ? 'Активен' : ticket.status === 'in_process' ? 'В процессе' : 'Закрыт'}
                </div>
                <div class="messages-list" id="messages-list">
                    ${ticket.messages && ticket.messages.length ? ticket.messages.map(m => `
                        <div class="message ${m.author}">
                            <div class="message-author">${m.author === 'admin' ? 'Администратор' : 'Пользователь'}</div>
                            <div class="message-text">${m.text}</div>
                            <div class="message-date">${m.date}</div>
                        </div>
                    `).join('') : '<p class="tickets-empty">Нет сообщений</p>'}
                </div>
                <div class="reply-form">
                    <textarea id="reply-text" placeholder="Введите ответ..."></textarea>
                    <button id="send-reply">Отправить</button>
                </div>
                <div class="ticket-actions" style="margin-top: 1rem;">
                    ${ticket.status === 'active' ? '<button class="btn-small in-progress-btn" data-id="' + ticket.id + '">Взять в работу</button>' : ''}
                    ${ticket.status !== 'closed' ? '<button class="btn-small close-btn" data-id="' + ticket.id + '">Закрыть</button>' : ''}
                </div>
            </div>
        `;
        detailView.innerHTML = html;

        // Обработчик кнопки "Назад"
        document.getElementById('back-to-list').addEventListener('click', showListView);

        // Отправка ответа
        document.getElementById('send-reply').addEventListener('click', () => {
            const text = document.getElementById('reply-text').value.trim();
            if (!text) return alert('Введите сообщение');
            if (!ticket.messages) ticket.messages = [];
            ticket.messages.push({
                author: 'admin',
                text: text,
                date: new Date().toISOString().split('T')[0]
            });
            window.AppData.saveData();
            renderDetail(ticket.id);
        });

        // Изменение статуса
        const inProgressBtn = document.querySelector('.in-progress-btn');
        const closeBtn = document.querySelector('.close-btn');
        if (inProgressBtn) {
            inProgressBtn.addEventListener('click', () => {
                ticket.status = 'in_process';
                window.AppData.saveData();
                renderDetail(ticket.id);
            });
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                ticket.status = 'closed';
                window.AppData.saveData();
                renderDetail(ticket.id);
            });
        }

        // Прокрутка переписки вниз
        const msgList = document.getElementById('messages-list');
        if (msgList) msgList.scrollTop = msgList.scrollHeight;
    }

    // Вход
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'flex';
        });
    }
    if (loginClose) loginClose.addEventListener('click', () => { if (loginModal) loginModal.style.display = 'none'; });
    if (loginSubmit) {
        loginSubmit.addEventListener('click', () => {
            const user = loginUsername.value.trim();
            const pass = loginPassword.value.trim();
            if (!user || !pass) return alert('Введите логин и пароль');
            const admin = window.AppData.admins.find(a => a.username === user && a.password === pass);
            if (admin) {
                localStorage.setItem('adminLoggedIn', 'true');
                if (loginModal) loginModal.style.display = 'none';
                showTickets();
            } else {
                alert('Неверный логин или пароль');
            }
        });
    }

    // Инициализация
    if (isLoggedIn()) showTickets();
    else showLoginRequired();
})();