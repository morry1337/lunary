// Управление новостями в админ-панели
window.renderNewsTab = function(container) {
    const data = window.AppData;
    let html = `<div class="form-row" style="flex-direction: column; gap: 10px;">
        <input type="text" id="new-title" placeholder="Заголовок">
        <textarea id="new-text" placeholder="Текст новости" style="min-height: 100px;"></textarea>
        <button class="btn primary" id="add-news" style="width: 100%;">Опубликовать</button>
    </div>
    <table class="data-table"><thead><tr><th>Заголовок</th><th>Дата</th><th>Действия</th></tr></thead><tbody>`;
    
    data.newsData.forEach(n => {
        html += `<tr>
            <td>${n.title}</td>
            <td>${n.date}</td>
            <td class="action-btns">
                <button class="icon-btn edit-news" data-id="${n.id}">✎</button>
                <button class="icon-btn danger delete-news" data-id="${n.id}">✕</button>
            </td>
        </tr>`;
    });
    
    html += `</tbody></table>`;
    container.innerHTML = html;

    // Обработчик добавления новости
    document.getElementById('add-news').addEventListener('click', () => {
        const title = document.getElementById('new-title').value.trim();
        const text = document.getElementById('new-text').value.trim();
        if (!title || !text) return alert('Введите заголовок и текст');
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        data.newsData.push({ id: data.getNextId(data.newsData), title, text, date: today, imageUrl: '' });
        data.saveData();
        window.renderNewsTab(container); // обновить таблицу
    });

    // Удаление новости
    document.querySelectorAll('.delete-news').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            if (confirm('Удалить эту новость?')) {
                data.newsData = data.newsData.filter(n => n.id !== id);
                data.saveData();
                window.renderNewsTab(container);
            }
        });
    });

    // Редактирование новости
    document.querySelectorAll('.edit-news').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const news = data.newsData.find(n => n.id === id);
            if (!news) return;
            const newTitle = prompt('Изменить заголовок', news.title);
            if (newTitle !== null) news.title = newTitle;
            const newText = prompt('Изменить текст', news.text);
            if (newText !== null) news.text = newText;
            data.saveData();
            window.renderNewsTab(container);
        });
    });
};