/* ==========================================================================
   SV TEXTILES — Checkout Controller (checkout.js)
   Validates customer data, ensures stock availability, calculates totals,
   safely prevents duplicate submissions, and places verified orders.
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    if (!window.SVTStore) return;

    const cart = window.SVTStore.getCart();
    if (!cart || cart.length === 0) {
      window.location.href = 'cart.html';
      return;
    }

    const appliedCoupon = sessionStorage.getItem('svt_applied_coupon') || null;
    const totals = window.SVTStore.getCartTotals(appliedCoupon);

    // Elements
    const itemsListEl = document.getElementById('checkoutItemsList');
    const subtotalEl = document.getElementById('chkSubtotal');
    const discountRow = document.getElementById('chkDiscountRow');
    const discountEl = document.getElementById('chkDiscount');
    const shippingEl = document.getElementById('chkShipping');
    const totalEl = document.getElementById('chkFinalTotal');
    const form = document.getElementById('checkoutForm');
    const btnSubmit = document.getElementById('btnSubmitOrder');
    const errorMsgEl = document.getElementById('orderErrorMessage');

    const cardCOD = document.getElementById('cardCOD');
    const cardOnline = document.getElementById('cardOnline');
    const onlineNotice = document.getElementById('onlineGatewayNotice');

    // Populate Items Summary
    itemsListEl.innerHTML = cart.map(item => `
      <div class="order-item-mini">
        <img src="${item.image}" alt="${item.name}" />
        <div style="flex: 1;">
          <div style="font-weight: 600; font-size: 0.88rem; color: var(--color-primary);">${item.name}</div>
          <div style="font-size: 0.75rem; color: var(--color-muted);">
            Qty: ${item.quantity} ${item.unit}(s) ${item.colour ? `&bull; ${item.colour}` : ''} ${item.size ? `&bull; ${item.size}` : ''}
          </div>
        </div>
        <div style="font-weight: 700; font-size: 0.92rem;">
          ₹${(item.price * item.quantity).toLocaleString('en-IN')}
        </div>
      </div>
    `).join('');

    // Update Totals
    subtotalEl.textContent = `₹${totals.subtotal.toLocaleString('en-IN')}`;
    if (totals.discount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-₹${totals.discount.toLocaleString('en-IN')}`;
    }
    shippingEl.textContent = totals.shipping === 0 ? 'FREE' : `₹${totals.shipping.toLocaleString('en-IN')}`;
    totalEl.textContent = `₹${totals.total.toLocaleString('en-IN')}`;

    // Payment Option card selection styling
    document.querySelectorAll('input[name="paymentOption"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'online') {
          cardOnline.classList.add('selected');
          cardCOD.classList.remove('selected');
          onlineNotice.style.display = 'block';
        } else {
          cardCOD.classList.add('selected');
          cardOnline.classList.remove('selected');
          onlineNotice.style.display = 'none';
        }
      });
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      errorMsgEl.style.display = 'none';

      // 1. Client-Side Field Validation
      let isValid = true;
      const name = document.getElementById('custFullName');
      const mobile = document.getElementById('custMobile');
      const email = document.getElementById('custEmail');
      const address = document.getElementById('custAddress');
      const city = document.getElementById('custCity');
      const state = document.getElementById('custState');
      const pincode = document.getElementById('custPincode');
      const notes = document.getElementById('custNotes');

      // Reset classes
      [name, mobile, email, address, city, state, pincode].forEach(el => el.classList.remove('is-invalid'));

      if (!name.value.trim() || name.value.trim().length < 3) {
        name.classList.add('is-invalid');
        isValid = false;
      }

      // 10-digit Indian mobile regex
      const mobilePattern = /^[6-9]\d{9}$/;
      if (!mobilePattern.test(mobile.value.trim())) {
        mobile.classList.add('is-invalid');
        isValid = false;
      }

      // Email regex
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        email.classList.add('is-invalid');
        isValid = false;
      }

      if (!address.value.trim() || address.value.trim().length < 8) {
        address.classList.add('is-invalid');
        isValid = false;
      }

      if (!city.value.trim()) {
        city.classList.add('is-invalid');
        isValid = false;
      }

      if (!state.value.trim()) {
        state.classList.add('is-invalid');
        isValid = false;
      }

      // 6-digit Indian PIN code regex
      const pinPattern = /^[1-9][0-9]{5}$/;
      if (!pinPattern.test(pincode.value.trim())) {
        pincode.classList.add('is-invalid');
        isValid = false;
      }

      if (!isValid) {
        errorMsgEl.textContent = 'Please correct the highlighted errors before proceeding.';
        errorMsgEl.style.display = 'block';
        return;
      }

      // Anti-duplicate protection: Disable button and show progress indicator
      btnSubmit.disabled = true;
      const originalBtnText = btnSubmit.innerHTML;
      btnSubmit.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 50 50" style="animation: spin 1s linear infinite; vertical-align: middle;">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="31.415, 31.415"></circle>
        </svg>
        Verifying Inventory &amp; Placing Order...
      `;

      const paymentMethod = document.querySelector('input[name="paymentOption"]:checked').value;

      const orderPayload = {
        customer: {
          fullName: name.value.trim(),
          mobile: mobile.value.trim(),
          email: email.value.trim(),
          address: address.value.trim(),
          city: city.value.trim(),
          state: state.value.trim(),
          pincode: pincode.value.trim(),
          orderNotes: notes.value.trim()
        },
        paymentMethod: paymentMethod,
        couponCode: appliedCoupon
      };

      // Slight network-like async delay for realistic UX and backend validation
      setTimeout(() => {
        const result = window.SVTStore.createOrder(orderPayload);

        if (result.success) {
          // Clear applied coupon from session
          sessionStorage.removeItem('svt_applied_coupon');
          // Cache completed order reference
          sessionStorage.setItem('svt_last_order', JSON.stringify(result.order));
          // Redirect to confirmation page
          window.location.href = `order-confirmation.html?ref=${result.order.orderReference}`;
        } else {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = originalBtnText;
          errorMsgEl.textContent = result.message || 'Failed to place order. Please review your bag and try again.';
          errorMsgEl.style.display = 'block';
        }
      }, 700);
    });
  });
})();
