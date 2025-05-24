// js/shared.js

import { PRODUCTS } from './product-data.js';

// --- Dark Mode Toggle ---
export function setupDarkModeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');

    const enableDarkMode = () => {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.replace('bg-gray-50', 'bg-gray-900');
        document.body.classList.replace('text-gray-800', 'text-gray-100');
        // Update specific elements that might not change with body classes
        document.querySelectorAll('.bg-white').forEach(el => el.classList.replace('bg-white', 'bg-gray-800'));
        document.querySelectorAll('.text-gray-800').forEach(el => el.classList.replace('text-gray-800', 'text-gray-100'));
        document.querySelectorAll('.bg-gray-100').forEach(el => el.classList.replace('bg-gray-100', 'bg-gray-700'));
        document.querySelectorAll('.text-gray-700').forEach(el => el.classList.replace('text-gray-700', 'text-gray-300'));
        document.querySelectorAll('.border-gray-300').forEach(el => el.classList.replace('border-gray-300', 'border-gray-600'));
        localStorage.setItem('theme', 'dark');
    };

    const disableDarkMode = () => {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.classList.replace('bg-gray-900', 'bg-gray-50');
        document.body.classList.replace('text-gray-100', 'text-gray-800');
        // Revert specific elements
        document.querySelectorAll('.bg-gray-800').forEach(el => el.classList.replace('bg-gray-800', 'bg-white'));
        document.querySelectorAll('.text-gray-100').forEach(el => el.classList.replace('text-gray-100', 'text-gray-800'));
        document.querySelectorAll('.bg-gray-700').forEach(el => el.classList.replace('bg-gray-700', 'bg-gray-100'));
        document.querySelectorAll('.text-gray-300').forEach(el => el.classList.replace('text-gray-300', 'text-gray-700'));
        document.querySelectorAll('.border-gray-600').forEach(el => el.classList.replace('border-gray-600', 'border-gray-300'));
        localStorage.setItem('theme', 'light');
    };

    const applyTheme = () => {
        if (localStorage.getItem('theme') === 'dark') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    };

    // Apply theme on initial load
    applyTheme();

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }

    if (darkModeToggleMobile) {
        darkModeToggleMobile.addEventListener('click', () => {
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }
}

// --- Mobile Menu Toggle ---
export function setupMobileMenuToggle() {
    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
    }
}

// --- Cookie Consent Banner ---
export function setupCookieConsent() {
    const banner = document.getElementById('cookie-consent-banner');
    const acceptBtn = document.getElementById('accept-cookies-btn');
    const declineBtn = document.getElementById('decline-cookies-btn');

    if (localStorage.getItem('cookieConsent') === 'accepted') {
        banner.style.display = 'none';
    } else {
        setTimeout(() => {
            if (banner) {
                banner.classList.remove('translate-y-full');
            }
        }, 500);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            if (banner) banner.classList.add('translate-y-full');
            setTimeout(() => { if (banner) banner.style.display = 'none'; }, 500);
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            if (banner) banner.classList.add('translate-y-full');
            setTimeout(() => { if (banner) banner.style.display = 'none'; }, 500);
        });
    }
}

// --- Scroll to Top Button ---
export function setupScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.remove('opacity-0');
                scrollToTopBtn.classList.add('opacity-100');
            } else {
                scrollToTopBtn.classList.remove('opacity-100');
                scrollToTopBtn.classList.add('opacity-0');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// --- Cart Management Functions ---

export function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart;
    } catch (e) {
        console.error("Error parsing cart from localStorage:", e);
        return [];
    }
}

export function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

export function addToCart(productId, size, quantity = 1) {
    const cart = getCart();
    const product = PRODUCTS.find(p => p.id === productId);

    if (!product) {
        console.error('Product not found:', productId);
        showToast('Error: Product not found.', 'error');
        return;
    }

    // Ensure size is selected
    if (!size || size === "Select Size") {
        showToast('Please select a size first!', 'warning');
        return;
    }

    const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === size);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            size: size,
            quantity: quantity
        });
    }
    saveCart(cart);
    showToast(`${product.name} (Size: ${size}) added to cart!`, 'success');
}

export function updateCartItemQuantity(productId, size, newQuantity) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId && item.size === size);

    if (itemIndex > -1) {
        if (newQuantity <= 0) {
            cart.splice(itemIndex, 1);
            showToast('Item removed from cart.', 'info');
        } else {
            cart[itemIndex].quantity = newQuantity;
            showToast('Cart updated.', 'info');
        }
        saveCart(cart);
    }
}

export function removeFromCart(productId, size) {
    let cart = getCart();
    const initialLength = cart.length;
    cart = cart.filter(item => !(item.id === productId && item.size === size));

    if (cart.length < initialLength) {
        saveCart(cart);
        showToast('Item removed from cart.', 'info');
    }
}

export function clearCart() {
    localStorage.removeItem('cart');
    updateCartDisplay();
    showToast('Your cart has been cleared.', 'info');
}

export function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Function to update cart display across different elements
export function updateCartDisplay() {
    const cartCountDesktop = document.getElementById('cart-count-desktop');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    const cartCountFloating = document.getElementById('cart-count'); // The small floating icon count

    const count = getCartItemCount();

    if (cartCountDesktop) cartCountDesktop.textContent = count;
    if (cartCountMobile) cartCountMobile.textContent = count;
    if (cartCountFloating) cartCountFloating.textContent = count;

    // Also update cart sidebar total if it exists
    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        cartTotalElement.textContent = formatPrice(getCartTotal());
    }

    // Update cart sidebar items
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    if (cartItemsContainer) {
        const cart = getCart();
        cartItemsContainer.innerHTML = ''; // Clear current items

        if (cart.length === 0) {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'block'; // Show empty message
            } else {
                cartItemsContainer.innerHTML = `<p class="text-gray-600 dark:text-gray-400 text-center" id="empty-cart-message">Your cart is empty.</p>`;
            }
            // Disable checkout button if cart is empty
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) checkoutBtn.disabled = true;

        } else {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'none'; // Hide empty message
            }
            // Enable checkout button if cart is not empty
            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) checkoutBtn.disabled = false;


            cart.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg shadow-sm';
                itemDiv.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md">
                    <div class="flex-grow">
                        <p class="font-semibold text-gray-800 dark:text-gray-100">${item.name}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-300">Size: ${item.size}</p>
                        <p class="text-sm text-gray-700 dark:text-gray-200">${formatPrice(item.price)} x ${item.quantity}</p>
                    </div>
                    <button class="btn btn-sm btn-ghost text-red-500 remove-item-btn" data-product-id="${item.id}" data-product-size="${item.size}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                `;
                cartItemsContainer.appendChild(itemDiv);
            });

            // Add event listeners to remove buttons
            cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const productId = event.currentTarget.dataset.productId;
                    const productSize = event.currentTarget.dataset.productSize;
                    removeFromCart(productId, productSize);
                });
            });
        }
    }
}

// Utility function to format price to INR
export function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0, // No decimal places for whole rupees
        maximumFractionDigits: 0, // No decimal places for whole rupees
    }).format(price);
}

// Universal Toast Notification
export function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        const div = document.createElement('div');
        div.id = 'toast-container';
        div.className = 'fixed bottom-4 right-4 z-[1000] flex flex-col-reverse gap-2';
        document.body.appendChild(div);
    }

    const toast = document.createElement('div');
    toast.className = `alert ${type === 'success' ? 'alert-success' : type === 'error' ? 'alert-error' : type === 'warning' ? 'alert-warning' : 'alert-info'} text-white shadow-lg transition-all duration-300 transform translate-x-full opacity-0`;
    toast.innerHTML = `
        <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000); // Hide after 3 seconds
}

// Generic page setup function
export function initializePage() {
    setupDarkModeToggle();
    setupMobileMenuToggle();
    setupCookieConsent();
    setupScrollToTop();
    updateCartDisplay(); // Ensure cart display is updated on every page load
}