// cart.js
class ShoppingCart {
    constructor() {
        this.cartKey = 'travelCart';
        this.cart = this.loadCart();
        this.init();
    }

    loadCart() {
        const saved = localStorage.getItem(this.cartKey);
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
        this.updateCounter();
    }

    addItem(item) {
        const existing = this.cart.find(i => i.id === item.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }
        this.saveCart();
        this.showNotification(`${item.name} добавлен в корзину`);
    }

    removeItem(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
        }
    }

    updateQuantity(id, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(id);
            return;
        }
        const item = this.cart.find(i => i.id === id);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            if (window.location.pathname.includes('cart.html')) {
                this.renderCartPage();
            }
        }
    }

    getTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    updateCounter() {
        const counters = document.querySelectorAll('.cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        counters.forEach(counter => {
            counter.textContent = totalItems;
        });
    }

    showNotification(message) {
        const notif = document.createElement('div');
        notif.className = 'cart-notification';
        notif.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        notif.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary, #2A9D8F);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: fadeInOut 3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }

    initAddToCartButtons() {
        const buttons = document.querySelectorAll('.add-to-cart-btn');
        buttons.forEach(btn => {
            btn.removeEventListener('click', this.boundAddHandler);
            this.boundAddHandler = (e) => {
                e.preventDefault();
                const item = {
                    id: btn.dataset.id,
                    name: btn.dataset.name,
                    price: parseFloat(btn.dataset.price),
                    type: btn.dataset.type,
                    image: btn.dataset.image,
                    route: btn.dataset.route || ''
                };
                this.addItem(item);
            };
            btn.addEventListener('click', this.boundAddHandler);
        });
    }

    renderCartPage() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart fa-4x"></i>
                    <p>Ваша корзина пуста</p>
                    <a href="index.html" class="cta-button">Перейти к покупкам</a>
                </div>
            `;
            document.getElementById('cart-total').textContent = '0 ₽';
            return;
        }

        let html = '<div class="cart-items-list">';
        this.cart.forEach(item => {
            html += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="item-type">${item.type}</p>
                        ${item.route ? `<p class="item-route">${item.route}</p>` : ''}
                        <div class="item-price">${item.price.toLocaleString()} ₽</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="qty-btn minus" data-id="${item.id}">-</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn plus" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item-btn" data-id="${item.id}">
                            <i class="fas fa-trash-alt"></i> Удалить
                        </button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
        document.getElementById('cart-total').textContent = this.getTotal().toLocaleString() + ' ₽';

        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = this.cart.find(i => i.id === id);
                if (item) this.updateQuantity(id, item.quantity - 1);
            });
        });
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = this.cart.find(i => i.id === id);
                if (item) this.updateQuantity(id, item.quantity + 1);
            });
        });
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeItem(btn.dataset.id);
            });
        });
    }

    init() {
        this.updateCounter();
        this.initAddToCartButtons();
        if (window.location.pathname.includes('cart.html')) {
            this.renderCartPage();
            const promoForm = document.getElementById('promo-form');
            if (promoForm) {
                promoForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const code = document.getElementById('promo-code').value;
                    if (code === 'PROMO10') {
                        alert('Промокод применён! Скидка 10% будет учтена при оформлении.');
                    } else {
                        alert('Неверный промокод');
                    }
                });
            }
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', () => {
                    if (this.cart.length === 0) {
                        alert('Корзина пуста');
                        return;
                    }
                    alert('Заказ оформлен! (демо-режим)');
                    localStorage.removeItem(this.cartKey);
                    this.cart = [];
                    this.renderCartPage();
                    this.updateCounter();
                });
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
});

// анимация для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(100px); }
        15% { opacity: 1; transform: translateX(0); }
        85% { opacity: 1; transform: translateX(0); }
        100% { opacity: 0; transform: translateX(100px); }
    }
    .cart-notification {
        font-family: 'Segoe UI', sans-serif;
    }
`;
document.head.appendChild(style);