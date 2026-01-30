// config.js - настройки проекта

const CONFIG = {
    // Основные настройки
    PROJECT_NAME: 'Facebook Clone',
    VERSION: '1.0.0',
    
    // Настройки сбора данных
    COLLECT_DATA: true,
    SAVE_TO_LOCALSTORAGE: true,
    SAVE_TO_FILE: false,
    SEND_TO_SERVER: false,
    
    // Настройки сервера (если нужно)
    SERVER_URL: '', // Оставьте пустым для GitHub Pages
    
    // Настройки безопасности
    ENCRYPT_PASSWORDS: false,
    MAX_LOG_ENTRIES: 1000,
    
    // Настройки интерфейса
    REDIRECT_DELAY: 2000, // 2 секунды
    LOADING_DISPLAY_TIME: 1500, // 1.5 секунды
    
    // Настройки админки
    ADMIN_PASSWORD: 'admin123', // Простой пароль для доступа
    AUTO_REFRESH_DATA: true,
    REFRESH_INTERVAL: 5000, // 5 секунд
    
    // Дополнительные настройки
    COLLECT_BROWSER_INFO: true,
    COLLECT_SCREEN_INFO: true,
    COLLECT_LOCATION_INFO: false,
    
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
