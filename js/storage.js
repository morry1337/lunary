// Модуль хранения данных с поддержкой JSON-файлов
window.AppData = (function() {
    const STORAGE_KEY = 'lunary_data';

    // Значения по умолчанию (используются, если JSON не загрузился)
    const defaults = {
        siteContent: {
            projectName: 'LUNARY',
            logoUrl: '../images/logo.svg',
            social: {
                channel: 'https://t.me/LunaryVPN',
                bot: 'https://t.me/LunaryVPNbot',
                founder: 'https://t.me/st1xlox',
                admin: 'https://t.me/whcxze'
            }
        },
        newsData: [
            { id: 1, title: 'TEST', text: 'артем пидорас', date: '1488-06-07', imageUrl: '' }
        ],
        admins: [
            { id: 1, username: 'admin', password: '3fdc714bb52bc206' }
        ],
        ticketsData: []
    };

    // Текущие данные (инициализируются из localStorage или defaults)
    let data = { ...defaults, siteContent: { ...defaults.siteContent } };

    // Попытка загрузить данные из JSON-файлов
    async function loadFromJson() {
        try {
            const [newsResp, ticketsResp] = await Promise.all([
                fetch('../data/news.json'),
                fetch('../data/tickets.json')
            ]);
            if (newsResp.ok) {
                const newsData = await newsResp.json();
                data.newsData = newsData;
            }
            if (ticketsResp.ok) {
                const ticketsData = await ticketsResp.json();
                data.ticketsData = ticketsData;
            }
        } catch (e) {
            console.warn('Не удалось загрузить JSON-файлы, используются данные из localStorage');
        }
        // Сохраняем загруженные данные в localStorage для быстрого доступа
        saveToLocalStorage();
    }

    // Загрузка из localStorage (если JSON не загрузился, будет использоваться это)
    function loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                data = {
                    siteContent: { ...defaults.siteContent, ...parsed.siteContent },
                    newsData: parsed.newsData || defaults.newsData,
                    admins: parsed.admins || defaults.admins,
                    ticketsData: parsed.ticketsData || defaults.ticketsData
                };
            }
        } catch (e) {
            console.warn('Ошибка загрузки из localStorage, используются значения по умолчанию');
        }
    }

    function saveToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            siteContent: data.siteContent,
            newsData: data.newsData,
            admins: data.admins,
            ticketsData: data.ticketsData
        }));
    }

    // Сохранение данных (вызывается после каждого изменения)
    async function save() {
        saveToLocalStorage();
        // Попытка отправить изменения на сервер (пока что не реализовано)
        try {
            await fetch('/api/save-news', { method: 'POST', body: JSON.stringify(data.newsData) });
            await fetch('/api/save-tickets', { method: 'POST', body: JSON.stringify(data.ticketsData) });
        } catch (e) {
            // Серверная часть отсутствует – игнорируем ошибку
        }
    }

    function getNextId(arr) {
        return arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1;
    }

    // Инициализация: сначала пробуем JSON, затем localStorage
    async function init() {
        loadFromLocalStorage(); // быстро показываем хоть что-то
        await loadFromJson();   // заменяем актуальными данными из JSON
    }

    // Запускаем инициализацию; экспортируем готовый объект
    const readyPromise = init();

    return {
        // Готовые поля (после инициализации они будут указывать на актуальные массивы)
        get siteContent() { return data.siteContent; },
        get newsData() { return data.newsData; },
        set newsData(val) { data.newsData = val; },
        get admins() { return data.admins; },
        get ticketsData() { return data.ticketsData; },
        set ticketsData(val) { data.ticketsData = val; },
        saveData: save,
        getNextId,
        ready: readyPromise
    };
})();