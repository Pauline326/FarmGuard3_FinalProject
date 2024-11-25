document.addEventListener('DOMContentLoaded', function () {
    const cartManager = new CartManager();

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger-icon');
    const mobileMenu = document.querySelector('.mobile-menu');

    hamburger.addEventListener('click', function () {
        this.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickInsideHamburger = hamburger.contains(event.target);

        if (!isClickInsideMenu && !isClickInsideHamburger && mobileMenu.classList.contains('open')) {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
        }
    });

    // Close mobile menu when window is resized above mobile breakpoint
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
        }
    });
});

class CartManager {
    constructor() {
        this.cart = new Map();
        this.sidebar = document.querySelector('.cart-sidebar');
        this.overlay = document.querySelector('.overlay');
        this.cartItems = document.querySelector('.cart-items');
        this.totalAmount = document.querySelector('.total-amount');
        this.cartCount = document.querySelector('.cart-count');
        this.loadCart();
        this.setupEventListeners();
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify([...this.cart]));
    }

    // Load cart from localStorage
    loadCart() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            this.cart = new Map(JSON.parse(storedCart));
            this.updateCart();
        }
    }

    setupEventListeners() {
        // Close cart when clicking close button or overlay
        document.querySelector('.cart-close').addEventListener('click', () => this.closeCart());
        this.overlay.addEventListener('click', () => this.closeCart());

        // Open cart when clicking cart icon
        document.querySelector('.cart-icon').addEventListener('click', () => this.openCart());

        // Setup add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const productCard = button.closest('.product-card');
                const product = {
                    id: productCard.dataset.id || Math.random().toString(36).substr(2, 9),
                    title: productCard.querySelector('.product-title').textContent,
                    price: parseFloat(productCard.querySelector('.price').textContent.replace('KES ', '').replace(/,/g, '')),
                    image: productCard.querySelector('img').src
                };
                this.addToCart(product);
            });
        });
    }

    addToCart(product) {
        if (this.cart.has(product.id)) {
            const item = this.cart.get(product.id);
            item.quantity += 1;
        } else {
            this.cart.set(product.id, {
                ...product,
                quantity: 1
            });
        }
        this.updateCart();
        this.openCart();
    }

    updateQuantity(productId, change) {
        if (this.cart.has(productId)) {
            const item = this.cart.get(productId);
            item.quantity += change;
            if (item.quantity <= 0) {
                this.cart.delete(productId);
            }
            this.updateCart();
        }
    }

    updateCart() {
        this.cartItems.innerHTML = '';
        let total = 0;
        let itemCount = 0;

        this.cart.forEach((item, id) => {
            total += item.price * item.quantity;
            itemCount += item.quantity;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">KES ${item.price.toLocaleString()}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
            `;

            itemElement.querySelector('.minus').addEventListener('click', () => 
                this.updateQuantity(id, -1)
            );
            itemElement.querySelector('.plus').addEventListener('click', () => 
                this.updateQuantity(id, 1)
            );

            this.cartItems.appendChild(itemElement);
        });

        this.totalAmount.textContent = `KES ${total.toLocaleString()}`;
        this.cartCount.textContent = itemCount;

        // Save cart to localStorage
        this.saveCart();
    }

    openCart() {
        this.sidebar.classList.add('open');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        this.sidebar.classList.remove('open');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}
