/* ==========================================================================
   SV TEXTILES — Shopping Bag Controller (cart.js)
   Handles cart rendering, variant separation, quantity changes with stock
   checks, coupon discounts, shipping threshold logic, and empty states.
   ========================================================================== */

(function () {
  'use strict';

  let appliedCouponCode = null;

  // DOM Elements
  const cartWrapper = document.getElementById('cartContentWrapper');
  const cartEmpty = document.getElementById('cartEmptyState');
  const tableBody = document.getElementById('cartTableBody');
  const subtotalEl = document.getElementById('summarySubtotal');
  const discountRow = document.getElementById('summaryDiscountRow');
  const discountEl = document.getElementById('summaryDiscount');
  const shippingEl = document.getElementById('summaryShipping');
  const totalEl = document.getElementById('summaryTotal');
  const shippingTracker = document.getElementById('shippingTracker');
  const couponInput = document.getElementById('couponInput');
  const btnApplyCoupon = document.getElementById('btnApplyCoupon');
  const couponMsg = document.getElementById('couponStatusMessage');

  function renderCart() {
    if (!window.SVTStore) return;
    const cart = window.SVTStore.getCart();

    if (!cart || cart.length === 0) {
      if (cartWrapper) cartWrapper.style.display = 'none';
      if (cartEmpty) cartEmpty.style.display = 'block';
      return;
    }

    if (cartWrapper) cartWrapper.style.display = 'block';
    if (cartEmpty) cartEmpty.style.display = 'none';

    // Render Table Rows
    const t = (k, params) => (window.SVTI18n ? window.SVTI18n.t(k, params) : k);
    tableBody.innerHTML = cart.map(item => {
      const itemSubtotal = item.price * item.quantity;
      const localizedUnit = t(`unit.${item.unit}`) || item.unit;
      const variantDetails = [];
      if (item.colour) variantDetails.push(`Colour: <strong>${item.colour}</strong>`);
      if (item.size) variantDetails.push(`Size: <strong>${item.size}</strong>`);

      return `
        <tr data-cart-item-id="${item.cartItemId}">
          <td>
            <div class="cart-product-cell">
              <a href="product.html?id=${item.productId}">
                <img src="${item.image}" alt="${item.name}" class="cart-product-thumb" />
              </a>
              <div>
                <h4 class="cart-item-name">
                  <a href="product.html?id=${item.productId}">${item.name}</a>
                </h4>
                <div class="cart-item-meta">
                  SKU: ${item.sku} &bull; ${t('prod.sold_per', { unit: localizedUnit }) || `Selling by the ${localizedUnit}`}
                </div>
                ${variantDetails.length > 0 ? `<div class="cart-item-meta" style="margin-top: 4px;">${variantDetails.join(' | ')}</div>` : ''}
              </div>
            </div>
          </td>
          <td>
            <strong>₹${item.price.toLocaleString('en-IN')}</strong>
            <div style="font-size: 0.75rem; color: var(--color-muted);">/${localizedUnit}</div>
          </td>
          <td>
            <div class="cart-stepper">
              <button type="button" class="btn-cart-minus" data-cart-item-id="${item.cartItemId}">-</button>
              <input type="number" class="cart-qty-input" value="${item.quantity}" min="1" max="${item.stockAvailable || 99}" data-cart-item-id="${item.cartItemId}" />
              <button type="button" class="btn-cart-plus" data-cart-item-id="${item.cartItemId}">+</button>
            </div>
          </td>
          <td>
            <strong style="color: var(--color-primary); font-size: 1.05rem;">
              ₹${itemSubtotal.toLocaleString('en-IN')}
            </strong>
          </td>
          <td style="text-align: right;">
            <button class="btn-remove-item" data-cart-item-id="${item.cartItemId}" title="Remove Item" style="color: var(--color-muted); font-size: 1.25rem;">
              &times;
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Update Summary Box
    updateSummary();
  }

  function updateSummary() {
    const totals = window.SVTStore.getCartTotals(appliedCouponCode);

    subtotalEl.textContent = `₹${totals.subtotal.toLocaleString('en-IN')}`;

    if (totals.discount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-₹${totals.discount.toLocaleString('en-IN')} (${totals.appliedCoupon.code})`;
    } else {
      discountRow.style.display = 'none';
    }

    if (totals.shipping === 0) {
      shippingEl.innerHTML = `<span style="color: var(--color-success); font-weight: 600;">FREE</span>`;
    } else {
      shippingEl.textContent = `₹${totals.shipping.toLocaleString('en-IN')}`;
    }

    totalEl.textContent = `₹${totals.total.toLocaleString('en-IN')}`;

    // Free Shipping Progress
    if (shippingTracker) {
      if (totals.amountNeededForFreeShipping === 0) {
        shippingTracker.innerHTML = `
          <div style="color: var(--color-success); font-weight: 600;">
            ✓ Your order qualifies for <strong>Free Standard Delivery</strong> across India!
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: 100%; background: var(--color-success);"></div>
          </div>
        `;
      } else {
        const percent = Math.min(100, Math.round((totals.subtotal / totals.freeShippingThreshold) * 100));
        shippingTracker.innerHTML = `
          <div>
            Add <strong>₹${totals.amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong>FREE Delivery</strong>!
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${percent}%;"></div>
          </div>
        `;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    // Event delegation for cart actions
    if (tableBody) {
      tableBody.addEventListener('click', (e) => {
        const minusBtn = e.target.closest('.btn-cart-minus');
        const plusBtn = e.target.closest('.btn-cart-plus');
        const removeBtn = e.target.closest('.btn-remove-item');

        if (minusBtn) {
          const cartItemId = minusBtn.getAttribute('data-cart-item-id');
          const cart = window.SVTStore.getCart();
          const item = cart.find(i => i.cartItemId === cartItemId);
          if (item) {
            window.SVTStore.updateCartQuantity(cartItemId, item.quantity - 1);
            renderCart();
          }
          return;
        }

        if (plusBtn) {
          const cartItemId = plusBtn.getAttribute('data-cart-item-id');
          const cart = window.SVTStore.getCart();
          const item = cart.find(i => i.cartItemId === cartItemId);
          if (item) {
            const product = window.SVTStore.getProductById(item.productId);
            if (product && item.quantity >= product.stock) {
              window.showToast(`Max stock reached (${product.stock} ${item.unit}s).`, 'error');
            } else {
              window.SVTStore.updateCartQuantity(cartItemId, item.quantity + 1);
              renderCart();
            }
          }
          return;
        }

        if (removeBtn) {
          const cartItemId = removeBtn.getAttribute('data-cart-item-id');
          window.SVTStore.removeFromCart(cartItemId);
          window.showToast('Item removed from shopping bag.', 'info');
          renderCart();
          return;
        }
      });

      tableBody.addEventListener('change', (e) => {
        const qtyInput = e.target.closest('.cart-qty-input');
        if (qtyInput) {
          const cartItemId = qtyInput.getAttribute('data-cart-item-id');
          const val = parseInt(qtyInput.value, 10) || 1;
          window.SVTStore.updateCartQuantity(cartItemId, val);
          renderCart();
        }
      });
    }

    // Coupon Button
    if (btnApplyCoupon && couponInput) {
      btnApplyCoupon.onclick = () => {
        const code = couponInput.value.trim().toUpperCase();
        if (!code) {
          couponMsg.innerHTML = '<span style="color: var(--color-danger);">Please enter a promo voucher code.</span>';
          return;
        }

        const totals = window.SVTStore.getCartTotals(code);
        if (totals.appliedCoupon) {
          appliedCouponCode = code;
          sessionStorage.setItem('svt_applied_coupon', code);
          couponMsg.innerHTML = `<span style="color: var(--color-success); font-weight: 600;">✓ Voucher applied! ${totals.appliedCoupon.description}</span>`;
          updateSummary();
        } else {
          appliedCouponCode = null;
          sessionStorage.removeItem('svt_applied_coupon');
          couponMsg.innerHTML = `<span style="color: var(--color-danger);">Invalid code or order minimum not met. Try <strong>SVTFIRST10</strong> or <strong>TRADITION20</strong></span>`;
          updateSummary();
        }
      };
    }

    // Restore coupon if saved in session
    const savedCoupon = sessionStorage.getItem('svt_applied_coupon');
    if (savedCoupon && couponInput) {
      couponInput.value = savedCoupon;
      appliedCouponCode = savedCoupon;
      updateSummary();
    }

    // Re-render when store updates
    window.addEventListener('svt_store_update', (e) => {
      if (e.detail && e.detail.type === 'cart') {
        renderCart();
      }
    });

    // Re-render when language changes
    window.addEventListener('svt_lang_change', () => {
      renderCart();
    });
  });
})();
