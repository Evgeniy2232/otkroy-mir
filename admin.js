
document.addEventListener('DOMContentLoaded', function() {

    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            
            this.classList.add('active');
            
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            window.location.href = 'index.html';
        }
    });

    
    initializeCharts();

    
    loadDashboardData();
});


function initializeCharts() {
    
    const bookingsCtx = document.getElementById('bookingsChart').getContext('2d');
    new Chart(bookingsCtx, {
        type: 'line',
        data: {
            labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
            datasets: [{
                label: 'Бронирования',
                data: [65, 59, 80, 81, 56, 85],
                borderColor: '#2A9D8F',
                backgroundColor: 'rgba(42, 157, 143, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    
    const destinationsCtx = document.getElementById('destinationsChart').getContext('2d');
    new Chart(destinationsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Турция', 'Египет', 'Таиланд', 'ОАЭ', 'Россия'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    '#2A9D8F',
                    '#E9C46A',
                    '#E76F51',
                    '#264653',
                    '#F4A261'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}


function loadDashboardData() {
    
    console.log('Загрузка данных дашборда...');
}

function approveReview(reviewId) {
    if (confirm('Одобрить этот отзыв?')) {
        
        console.log('Отзыв одобрен:', reviewId);
        showNotification('Отзыв успешно одобрен', 'success');
    }
}

function rejectReview(reviewId) {
    if (confirm('Отклонить этот отзыв?')) {
        
        console.log('Отзыв отклонен:', reviewId);
        showNotification('Отзыв отклонен', 'warning');
    }
}


function toggleUserStatus(userId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    const statusText = newStatus === 'active' ? 'разблокировать' : 'заблокировать';
    
    if (confirm(`Вы уверены, что хотите ${statusText} этого пользователя?`)) {
        
        console.log(`Статус пользователя ${userId} изменен на: ${newStatus}`);
        showNotification(`Пользователь успешно ${newStatus === 'active' ? 'разблокирован' : 'заблокирован'}`, 'success');
    }
}


function showNotification(message, type = 'info') {
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
   
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 1rem;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 1000;
        border-left: 4px solid ${getNotificationColor(type)};
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        danger: 'times-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        warning: '#ffc107',
        danger: '#dc3545',
        info: '#17a2b8'
    };
    return colors[type] || '#17a2b8';
}


const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #6c757d;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(style);


function initializeSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.table-container').querySelector('tbody');
            const rows = table.querySelectorAll('tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    });
}


initializeSearch();