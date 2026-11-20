/**
 * TrendStore - E-Commerce Application Logic
 * Vanilla JavaScript implementation
 */

// ==========================================================================
// 1. Product Catalog Data
// ==========================================================================
const PRODUCTS = [
    {
        id: 1,
        title: "Wireless Noise-Canceling Headphones",
        category: "electronics",
        price: 99.99,
        rating: 4.8,
        reviews: 142,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        description: "Premium over-ear wireless headphones with active noise cancellation and 40-hour battery life."
    },
    {
        id: 2,
        title: "Smart Fitness Tracker Watch",
        category: "electronics",
        price: 129.50,
        rating: 4.6,
        reviews: 98,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        description: "Water-resistant smartwatch with heart rate tracking, GPS, and custom AMOLED display."
    },
    {
        id: 3,
        title: "Classic Vintage Denim Jacket",
        category: "clothing",
        price: 69.99,
        rating: 4.5,
        reviews: 76,
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
        description: "Timeless denim jacket tailored with durable 100% cotton and vintage brass buttons."
    },
    {
        id: 4,
        title: "Urban Minimalist Canvas Sneakers",
        category: "footwear",
        price: 49.99,
        rating: 4.7,
        reviews: 112,
        image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop&q=80",
        description: "Comfortable breathable sneakers designed for casual everyday wear and urban walking."
    },
    {
        id: 5,
        title: "Handcrafted Leather Travel Backpack",
        category: "accessories",
        price: 89.90,
        rating: 4.9,
        reviews: 84,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
        description: "Full-grain genuine leather backpack featuring a 15-inch laptop compartment and anti-theft pockets."
    },
    {
        id: 6,
        title: "Polarized Retro Sunglasses",
        category: "accessories",
        price: 34.00,
        rating: 4.4,
        reviews: 63,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
        description: "UV400 protective polarized lenses in a lightweight, durable acetate frame."
    },
    {
        id: 7,
        title: "RGB Mechanical Gaming Keyboard",
        category: "electronics",
        price: 84.99,
        rating: 4.7,
        reviews: 153,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
        description: "Tactile mechanical switches with customizable per-key RGB backlighting and aluminum top-plate."
    },
    {
        id: 8,
        title: "Organic Cotton Relaxed-Fit T-Shirt",
        category: "clothing",
        price: 24.99,
        rating: 4.3,
        reviews: 49,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
        description: "Ultra-soft, heavyweight certified organic cotton crewneck tee for all-day comfort."
    }
];

// ==========================================================================
// 2. Application State & Storage
// ==========================================================================
const CART_STORAGE_KEY = "trendstore_cart_items";

let state = {
    products: PRODUCTS,
    cart: loadCartFromStorage(),
    currentCategory: "all",
    searchQuery: "",
    sortBy: "default"
};

function loadCartFromStorage() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to load cart from storage:", e);
        return [];
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.cart));
    } catch (e) {
        console.error("Failed to save cart to storage:", e);
    }
}

// ==========================================================================
// 3. DOM Elements Selection
// ==========================================================================
const productGrid = document.getElementById("product-grid");
const emptyState = document.getElementById("empty-state");
const resultsCount = document.getElementById("results-count");
const sectionHeading = document.getElementById("section-heading");
const categoryFilterContainer = document.getElementById("category-filters");
const sortSelect = document.getElementById("sort-select");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search");
const resetFiltersBtn = document.getElementById("reset-filters-btn");

// Cart Elements
const cartBtn = document.getElementById("cart-btn");
const closeCartBtn = document.getElementById("close-cart");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsContainer = document.getElementById("cart-items");
const cartBadge = document.getElementById("cart-count");
const cartItemCount = document.getElementById("cart-item-count");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart-btn");
const checkoutBtn = document.getElementById("checkout-btn");

// Checkout & Modals
const checkoutModal = document.getElementById("checkout-modal");
const closeCheckoutModalBtn = document.getElementById("close-checkout-modal");
const checkoutForm = document.getElementById("checkout-form");
const modalTotalAmount = document.getElementById("modal-total-amount");
const submitBtnAmount = document.getElementById("submit-btn-amount");
const successModal = document.getElementById("success-modal");
const successContinueBtn = document.getElementById("success-continue-btn");
const orderIdDisplay = document.getElementById("order-id-display");
const toastContainer = document.getElementById("toast-container");

// ==========================================================================
// 4. Products Rendering & Filtering
// ==========================================================================
function getFilteredAndSortedProducts() {
    let result = [...state.products];

    // 1. Filter by category
    if (state.currentCategory !== "all") {
        result = result.filter(item => item.category === state.currentCategory);
    }

    // 2. Filter by search query
    if (state.searchQuery.trim() !== "") {
        const query = state.searchQuery.toLowerCase().trim();
        result = result.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );
    }

    // 3. Sort
    switch (state.sortBy) {
        case "price-low":
            result.sort((a, b) => a.price - b.price);
            break;
        case "price-high":
            result.sort((a, b) => b.price - a.price);
            break;
        case "rating":
            result.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Keep default catalog order
            break;
    }

    return result;
}

function renderProducts() {
    const products = getFilteredAndSortedProducts();

    // Update results counter & heading
    resultsCount.textContent = `Showing ${products.length} item${products.length === 1 ? '' : 's'}`;
    
    if (state.currentCategory !== "all") {
        sectionHeading.textContent = `${state.currentCategory.charAt(0).toUpperCase() + state.currentCategory.slice(1)} Products`;
    } else {
        sectionHeading.textContent = "Featured Products";
    }

    // Handle empty state
    if (products.length === 0) {
        productGrid.innerHTML = "";
        emptyState.style.display = "block";
        return;
    }

    emptyState.style.display = "none";

    // Generate product cards HTML
    productGrid.innerHTML = products.map(product => `
        <article class="product-card" data-id="${product.id}">
            <div class="product-image-wrap">
                <span class="category-tag">${product.category}</span>
                <img 
                    class="product-image" 
                    src="${product.image}" 
                    alt="${escapeHtml(product.title)}"
                    loading="lazy"
                    onerror="this.src='https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'"
                />
            </div>
            <div class="product-body">
                <div class="product-rating">
                    <span>★</span>
                    <strong>${product.rating.toFixed(1)}</strong>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <h3 class="product-title">${escapeHtml(product.title)}</h3>
                <p class="product-desc">${escapeHtml(product.description)}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-id="${product.id}" aria-label="Add ${escapeHtml(product.title)} to cart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        <span>Add</span>
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// ==========================================================================
// 5. Cart Management
// ==========================================================================
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = state.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
        state.cart[existingIndex].quantity += 1;
    } else {
        state.cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: 1
        });
    }

    saveCartToStorage();
    renderCart();
    showToast(`Added "${product.title}" to cart!`, "success");
}

function updateCartQuantity(productId, delta) {
    const itemIndex = state.cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) return;

    const newQty = state.cart[itemIndex].quantity + delta;

    if (newQty <= 0) {
        const itemTitle = state.cart[itemIndex].title;
        state.cart.splice(itemIndex, 1);
        showToast(`Removed "${itemTitle}" from cart`, "info");
    } else {
        state.cart[itemIndex].quantity = newQty;
    }

    saveCartToStorage();
    renderCart();
}

function removeFromCart(productId) {
    const itemIndex = state.cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const title = state.cart[itemIndex].title;
        state.cart.splice(itemIndex, 1);
        saveCartToStorage();
        renderCart();
        showToast(`Removed "${title}" from cart`, "info");
    }
}

function clearCart() {
    if (state.cart.length === 0) return;
    if (confirm("Are you sure you want to empty your shopping cart?")) {
        state.cart = [];
        saveCartToStorage();
        renderCart();
        showToast("Cart has been cleared", "info");
    }
}

function calculateCartTotals() {
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { count, subtotal, total: subtotal };
}

function renderCart() {
    const { count, subtotal, total } = calculateCartTotals();

    // Update badges
    cartBadge.textContent = count;
    cartItemCount.textContent = count;

    // Update amounts
    const formattedTotal = `$${total.toFixed(2)}`;
    cartSubtotal.textContent = formattedTotal;
    cartTotal.textContent = formattedTotal;
    modalTotalAmount.textContent = formattedTotal;
    submitBtnAmount.textContent = total.toFixed(2);

    // Disable/enable checkout
    if (count === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = "0.5";
        checkoutBtn.style.cursor = "not-allowed";
        clearCartBtn.style.display = "none";

        cartItemsContainer.innerHTML = `
            <div class="cart-empty-message">
                <div class="icon">🛒</div>
                <h4>Your cart is empty</h4>
                <p>Add some products from the shop to get started.</p>
            </div>
        `;
        return;
    }

    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";
    checkoutBtn.style.cursor = "pointer";
    clearCartBtn.style.display = "block";

    cartItemsContainer.innerHTML = state.cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img class="cart-item-img" src="${item.image}" alt="${escapeHtml(item.title)}" onerror="this.src='https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'">
            <div class="cart-item-info">
                <h4 class="cart-item-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h4>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="qty-btn" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
                </div>
            </div>
            <button class="cart-remove-btn" data-id="${item.id}" title="Remove item" aria-label="Remove item">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    `).join("");
}

// Drawer Visibility
function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevent background scroll
}

function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
}

// ==========================================================================
// 6. Checkout & Modals Logic
// ==========================================================================
function openCheckoutModal() {
    if (state.cart.length === 0) return;
    closeCart();
    checkoutModal.classList.add("open");
}

function closeCheckoutModal() {
    checkoutModal.classList.remove("open");
}

function handleCheckoutSubmit(e) {
    e.preventDefault();

    // Generate random order id
    const randomOrderId = "#ORD-" + Math.floor(10000 + Math.random() * 90000);
    orderIdDisplay.textContent = randomOrderId;

    // Reset form and close checkout modal
    checkoutForm.reset();
    closeCheckoutModal();

    // Clear cart
    state.cart = [];
    saveCartToStorage();
    renderCart();

    // Open success modal
    successModal.classList.add("open");
}

function closeSuccessModal() {
    successModal.classList.remove("open");
}

// ==========================================================================
// 7. Toast Notification Utility
// ==========================================================================
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    const icon = type === "success" ? "✓" : "ℹ";
    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;

    toastContainer.appendChild(toast);

    // Auto remove after animation completes (2.8s)
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 2800);
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ==========================================================================
// 8. Event Listeners Setup
// ==========================================================================
function setupEventListeners() {
    // Category filter clicks
    categoryFilterContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".category-btn");
        if (!btn) return;

        document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        state.currentCategory = btn.dataset.category;
        renderProducts();
    });

    // Search input
    searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        clearSearchBtn.style.display = state.searchQuery ? "block" : "none";
        renderProducts();
    });

    // Clear search
    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        state.searchQuery = "";
        clearSearchBtn.style.display = "none";
        searchInput.focus();
        renderProducts();
    });

    // Sort select
    sortSelect.addEventListener("change", (e) => {
        state.sortBy = e.target.value;
        renderProducts();
    });

    // Reset filters button in empty state
    resetFiltersBtn.addEventListener("click", () => {
        state.searchQuery = "";
        state.currentCategory = "all";
        state.sortBy = "default";
        searchInput.value = "";
        clearSearchBtn.style.display = "none";
        sortSelect.value = "default";
        
        document.querySelectorAll(".category-btn").forEach(b => {
            b.classList.toggle("active", b.dataset.category === "all");
        });

        renderProducts();
    });

    // Product Grid - Add to cart delegation
    productGrid.addEventListener("click", (e) => {
        const addBtn = e.target.closest(".add-to-cart-btn");
        if (addBtn) {
            const productId = parseInt(addBtn.dataset.id, 10);
            addToCart(productId);
        }
    });

    // Cart Drawer triggers
    cartBtn.addEventListener("click", openCart);
    closeCartBtn.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    // Cart Items delegation (qty increase, decrease, remove)
    cartItemsContainer.addEventListener("click", (e) => {
        const qtyBtn = e.target.closest(".qty-btn");
        if (qtyBtn) {
            const id = parseInt(qtyBtn.dataset.id, 10);
            const action = qtyBtn.dataset.action;
            updateCartQuantity(id, action === "increase" ? 1 : -1);
            return;
        }

        const removeBtn = e.target.closest(".cart-remove-btn");
        if (removeBtn) {
            const id = parseInt(removeBtn.dataset.id, 10);
            removeFromCart(id);
        }
    });

    // Clear cart button
    clearCartBtn.addEventListener("click", clearCart);

    // Checkout Modal triggers
    checkoutBtn.addEventListener("click", openCheckoutModal);
    closeCheckoutModalBtn.addEventListener("click", closeCheckoutModal);
    checkoutModal.addEventListener("click", (e) => {
        if (e.target === checkoutModal) closeCheckoutModal();
    });
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);

    // Success Modal triggers
    successContinueBtn.addEventListener("click", closeSuccessModal);
    successModal.addEventListener("click", (e) => {
        if (e.target === successModal) closeSuccessModal();
    });

    // Escape key closes open drawers or modals
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeCart();
            closeCheckoutModal();
            closeSuccessModal();
        }
    });
}

// ==========================================================================
// 9. Application Initialization
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    renderProducts();
    renderCart();
});
