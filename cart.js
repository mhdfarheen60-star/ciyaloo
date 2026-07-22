function getCart() {
  return JSON.parse(localStorage.getItem('ciyalooCart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('ciyalooCart', JSON.stringify(cart));
  updateAllCartBadges();
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
}

function removeFromCart(productName) {
  saveCart(getCart().filter(item => item.name !== productName));
}

function updateQuantity(productName, delta) {
  const cart = getCart();
  const item = cart.find(item => item.name === productName);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      saveCart(cart.filter(i => i.name !== productName));
      return;
    }
  }
  saveCart(cart);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateAllCartBadges() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
  });
}

function renderCartPage() {
  const cart = getCart();
  const emptyState = document.getElementById('cart-empty-state');
  const cartItems = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');

  if (cart.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (cartItems) cartItems.innerHTML = '';
    if (cartSummary) cartSummary.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (cartItems) cartItems.style.display = 'block';
  if (cartSummary) cartSummary.style.display = 'block';

  let total = 0;
  if (cartItems) {
    cartItems.innerHTML = cart.map(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      return `
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <img src="${item.image}" alt="${item.name}" width="80" height="80" class="rounded me-3" style="object-fit: cover;">
              <div>
                <h6 class="mb-0" style="font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 500;">${item.name}</h6>
                <small class="text-muted">50ml</small>
              </div>
            </div>
          </td>
          <td style="font-family: 'Poppins', sans-serif; font-size: 14px; color: #7A5C3E;">AED ${item.price}</td>
          <td>
            <div class="input-group input-group-sm" style="width: 110px;">
              <button class="btn qty-btn" data-action="decrease" data-name="${item.name}" style="border: 1px solid #e0d5c5; color: #7A5C3E; background: #fff;">-</button>
              <input type="text" class="form-control text-center qty-input" value="${item.quantity}" readonly style="border: 1px solid #e0d5c5; color: #7A5C3E; font-size: 13px;">
              <button class="btn qty-btn" data-action="increase" data-name="${item.name}" style="border: 1px solid #e0d5c5; color: #7A5C3E; background: #fff;">+</button>
            </div>
          </td>
          <td class="item-subtotal" style="font-family: 'Poppins', sans-serif; font-size: 14px; color: #7A5C3E; font-weight: 500;">AED ${subtotal}</td>
          <td><button class="btn btn-sm remove-btn" data-name="${item.name}" style="color: #999; background: none; border: none; padding: 4px 8px; transition: color 0.3s ease;"><i class="bi bi-trash" style="font-size: 16px;"></i></button></td>
        </tr>
      `;
    }).join('');
  }

  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  if (subtotalEl) subtotalEl.textContent = 'AED ' + total;
  if (totalEl) totalEl.textContent = 'AED ' + total;

  if (cartItems) {
    cartItems.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const name = this.dataset.name;
        const action = this.dataset.action;
        const delta = action === 'increase' ? 1 : -1;
        updateQuantity(name, delta);
        renderCartPage();
      });
    });

    cartItems.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const name = this.dataset.name;
        removeFromCart(name);
        renderCartPage();
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  updateAllCartBadges();
  renderCartPage();
});
