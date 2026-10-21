/* ==========================================================================
   SV TEXTILES — Admin Dashboard Controller (admin.js)
   Handles admin authorization, product catalog CRUD, quick inventory
   adjusters, live customer order status updates, and wholesale leads.
   ========================================================================== */

(function () {
  'use strict';

  // Elements
  const gateScreen = document.getElementById('adminGateScreen');
  const portal = document.getElementById('adminPortal');
  const passForm = document.getElementById('adminPassForm');
  const passInput = document.getElementById('adminPassInput');
  const btnQuickDemo = document.getElementById('btnQuickDemoAdmin');
  const btnLogout = document.getElementById('btnAdminLogout');
  const btnResetDemo = document.getElementById('btnResetDemoData');

  const navItems = document.querySelectorAll('.admin-nav-item');
  const views = document.querySelectorAll('.admin-view');

  // Metrics elements
  const metricRev = document.getElementById('metricRevenue');
  const metricOrders = document.getElementById('metricOrdersCount');
  const metricOrdersSub = document.getElementById('metricOrdersSubtitle');
  const metricProducts = document.getElementById('metricProductsCount');
  const metricLowStock = document.getElementById('metricLowStockCount');

  // Product modal elements
  const productModal = document.getElementById('productModal');
  const btnOpenAddModal = document.getElementById('btnOpenAddProductModal');
  const btnCloseModal = document.getElementById('btnCloseProductModal');
  const productForm = document.getElementById('productForm');
  const productModalTitle = document.getElementById('productModalTitle');
  const editIdInput = document.getElementById('editProductId');

  // Order modal elements
  const orderModal = document.getElementById('adminOrderDetailModal');
  const btnCloseOrderModal = document.getElementById('btnCloseOrderModal');
  const orderModalContent = document.getElementById('admOrderModalContent');
  const orderModalTitle = document.getElementById('admOrderModalTitle');

  // ----------------- Auth State -----------------
  function checkAdminAuth() {
    if (window.SVTStore && window.SVTStore.isAdminAuthenticated()) {
      gateScreen.style.display = 'none';
      portal.style.display = 'block';
      refreshAllData();
    } else {
      gateScreen.style.display = 'block';
      portal.style.display = 'none';
    }
  }

  // ----------------- Data Refreshers -----------------
  function refreshAllData() {
    refreshMetrics();
    renderDashboardRecentOrders();
    renderProductsTable();
    renderOrdersTable();
    renderWholesaleTable();
  }

  function refreshMetrics() {
    if (!window.SVTStore) return;
    const orders = window.SVTStore.getAllOrders();
    const products = window.SVTStore.getAllProducts();

    // Total Revenue
    const revenue = orders.reduce((sum, o) => sum + (o.pricing ? o.pricing.finalTotal : 0), 0);
    metricRev.textContent = `₹${revenue.toLocaleString('en-IN')}`;

    // Total Orders
    metricOrders.textContent = orders.length;
    const pending = orders.filter(o => o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing').length;
    metricOrdersSub.textContent = `${pending} active in fulfillment`;

    // Products Count
    metricProducts.textContent = products.length;

    // Low stock count (< 10)
    const lowStock = products.filter(p => p.stock <= 10).length;
    metricLowStock.textContent = lowStock;
  }

  // ----------------- Orders Views -----------------
  function renderDashboardRecentOrders() {
    const orders = window.SVTStore.getAllOrders().slice(0, 5);
    const tbody = document.getElementById('dashboardOrdersBody');
    if (!tbody) return;

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--color-muted); padding: 2rem;">No orders placed yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><strong>${o.orderReference}</strong></td>
        <td>
          <strong>${o.customer.fullName}</strong><br />
          <span style="font-size: 0.78rem; color: var(--color-muted);">${o.customer.city}, ${o.customer.state}</span>
        </td>
        <td>
          <span style="font-size: 0.78rem; font-weight: 600;">${o.paymentMethod.toUpperCase()}</span>
        </td>
        <td><strong>₹${o.pricing.finalTotal.toLocaleString('en-IN')}</strong></td>
        <td>
          <span class="badge" style="background: var(--color-ivory); border: 1px solid var(--color-border); color: var(--color-primary);">${o.orderStatus}</span>
        </td>
        <td>
          <select class="status-select" data-order-ref="${o.orderReference}">
            <option value="Confirmed" ${o.orderStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Processing" ${o.orderStatus === 'Processing' ? 'selected' : ''}>Processing</option>
            <option value="Shipped" ${o.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${o.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
          </select>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.status-select').forEach(sel => {
      sel.onchange = () => {
        const ref = sel.getAttribute('data-order-ref');
        window.SVTStore.updateOrderStatus(ref, sel.value);
        refreshAllData();
      };
    });
  }

  function renderOrdersTable() {
    let orders = window.SVTStore.getAllOrders();
    const filter = document.getElementById('adminOrderFilterSelect').value;
    if (filter !== 'all') {
      orders = orders.filter(o => o.orderStatus === filter);
    }

    const tbody = document.getElementById('adminOrdersFullBody');
    if (!tbody) return;

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--color-muted); padding: 3rem;">No orders matching filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = orders.map(o => {
      const dateStr = new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      return `
        <tr>
          <td><strong>${o.orderReference}</strong></td>
          <td style="color: var(--color-muted);">${dateStr}</td>
          <td>
            <strong>${o.customer.fullName}</strong><br />
            <span style="font-size: 0.78rem; color: var(--color-muted);">${o.customer.mobile}</span>
          </td>
          <td>${o.customer.city}, ${o.customer.pincode}</td>
          <td>${o.items.length} item(s)</td>
          <td><strong>₹${o.pricing.finalTotal.toLocaleString('en-IN')}</strong></td>
          <td><span style="font-size: 0.8rem;">${o.paymentMethod.toUpperCase()}</span></td>
          <td>
            <select class="status-select" data-order-ref="${o.orderReference}">
              <option value="Confirmed" ${o.orderStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Processing" ${o.orderStatus === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Shipped" ${o.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${o.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
            </select>
          </td>
          <td>
            <button class="btn btn-sm btn-secondary btn-inspect-order" data-order-ref="${o.orderReference}">Inspect</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.status-select').forEach(sel => {
      sel.onchange = () => {
        const ref = sel.getAttribute('data-order-ref');
        window.SVTStore.updateOrderStatus(ref, sel.value);
        refreshAllData();
      };
    });

    tbody.querySelectorAll('.btn-inspect-order').forEach(btn => {
      btn.onclick = () => {
        const ref = btn.getAttribute('data-order-ref');
        openOrderModal(ref);
      };
    });
  }

  function openOrderModal(ref) {
    const order = window.SVTStore.getOrderById(ref);
    if (!order) return;

    orderModalTitle.textContent = `Order Details #${order.orderReference}`;
    orderModalContent.innerHTML = `
      <div style="margin-bottom: 1.5rem; background: var(--color-ivory); padding: 1.25rem; border-radius: var(--radius-sm);">
        <h4 style="margin-bottom: 0.5rem; color: var(--color-primary);">Customer &amp; Shipping Profile</h4>
        <p style="font-size: 0.9rem; line-height: 1.6;">
          <strong>Name:</strong> ${order.customer.fullName}<br />
          <strong>Email:</strong> ${order.customer.email}<br />
          <strong>Phone:</strong> +91 ${order.customer.mobile}<br />
          <strong>Delivery Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.state} — <strong>${order.customer.pincode}</strong><br />
          ${order.customer.orderNotes ? `<strong>Notes:</strong> <em>${order.customer.orderNotes}</em>` : ''}
        </p>
      </div>

      <h4 style="margin-bottom: 0.75rem; color: var(--color-primary);">Items in Consignment</h4>
      <div style="border: 1px solid var(--color-border); border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 1.5rem;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
          <tbody style="background: var(--color-white);">
            ${order.items.map(item => `
              <tr style="border-bottom: 1px solid var(--color-border-light);">
                <td style="padding: 0.75rem;">
                  <img src="${item.image}" alt="" style="width: 40px; height: 50px; object-fit: cover; border-radius: var(--radius-sm);" />
                </td>
                <td style="padding: 0.75rem;">
                  <strong>${item.name}</strong><br />
                  <span style="font-size: 0.78rem; color: var(--color-muted);">
                    SKU: ${item.sku} &bull; ${item.colour || ''} &bull; ${item.size || ''}
                  </span>
                </td>
                <td style="padding: 0.75rem;">${item.quantity} ${item.unit}(s)</td>
                <td style="padding: 0.75rem; text-align: right; font-weight: 700;">₹${item.itemSubtotal.toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="text-align: right; font-size: 1.1rem; font-weight: 700; color: var(--color-primary);">
        Total: ₹${order.pricing.finalTotal.toLocaleString('en-IN')} (${order.paymentMethod.toUpperCase()})
      </div>
    `;

    orderModal.classList.add('active');
  }

  // ----------------- Product Management -----------------
  function renderProductsTable() {
    const products = window.SVTStore.getAllProducts();
    const tbody = document.getElementById('adminProductsBody');
    if (!tbody) return;

    tbody.innerHTML = products.map(p => `
      <tr data-prod-id="${p.id}">
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${p.images[0]}" alt="" style="width: 44px; height: 55px; object-fit: cover; border-radius: var(--radius-sm);" />
            <div>
              <strong style="color: var(--color-primary);">${p.name}</strong>
            </div>
          </div>
        </td>
        <td><code>${p.sku}</code></td>
        <td>${p.category}</td>
        <td><strong>₹${p.price.toLocaleString('en-IN')}</strong></td>
        <td><span class="badge badge-unit">${p.unit}</span></td>
        <td>
          <strong style="color: ${p.stock <= 10 ? 'var(--color-warning)' : 'var(--color-success)'};">
            ${p.stock}
          </strong>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 4px;">
            <button class="btn btn-sm btn-secondary btn-stock-minus" data-id="${p.id}" style="padding: 0.2rem 0.5rem;">-</button>
            <input type="number" class="admin-stock-input" value="${p.stock}" data-id="${p.id}" style="width: 50px; text-align: center; border: 1px solid var(--color-border); padding: 0.2rem; font-size: 0.85rem;" />
            <button class="btn btn-sm btn-secondary btn-stock-plus" data-id="${p.id}" style="padding: 0.2rem 0.5rem;">+</button>
          </div>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-sm btn-secondary btn-edit-product" data-id="${p.id}">Edit</button>
            <button class="btn btn-sm btn-secondary btn-delete-product" data-id="${p.id}" style="color: var(--color-danger);">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Attach row events
    tbody.querySelectorAll('.btn-stock-minus').forEach(b => {
      b.onclick = () => {
        const id = b.getAttribute('data-id');
        const prod = products.find(p => p.id === id);
        if (prod && prod.stock > 0) {
          window.SVTStore.updateStock(id, prod.stock - 1);
          refreshAllData();
        }
      };
    });

    tbody.querySelectorAll('.btn-stock-plus').forEach(b => {
      b.onclick = () => {
        const id = b.getAttribute('data-id');
        const prod = products.find(p => p.id === id);
        if (prod) {
          window.SVTStore.updateStock(id, prod.stock + 1);
          refreshAllData();
        }
      };
    });

    tbody.querySelectorAll('.admin-stock-input').forEach(inp => {
      inp.onchange = () => {
        const id = inp.getAttribute('data-id');
        const val = parseInt(inp.value, 10);
        if (!isNaN(val)) {
          window.SVTStore.updateStock(id, val);
          refreshAllData();
        }
      };
    });

    tbody.querySelectorAll('.btn-delete-product').forEach(b => {
      b.onclick = () => {
        const id = b.getAttribute('data-id');
        if (confirm('Are you sure you want to remove this product from the master catalogue?')) {
          window.SVTStore.deleteProduct(id);
          refreshAllData();
        }
      };
    });

    tbody.querySelectorAll('.btn-edit-product').forEach(b => {
      b.onclick = () => {
        const id = b.getAttribute('data-id');
        openEditProductModal(id);
      };
    });
  }

  function openEditProductModal(id) {
    const prod = window.SVTStore.getProductById(id);
    if (!prod) return;

    productModalTitle.textContent = `Edit Product — ${prod.sku}`;
    editIdInput.value = prod.id;
    document.getElementById('prodName').value = prod.name;
    document.getElementById('prodSku').value = prod.sku;
    document.getElementById('prodCategory').value = prod.category;
    document.getElementById('prodUnit').value = prod.unit;
    document.getElementById('prodPrice').value = prod.price;
    document.getElementById('prodStock').value = prod.stock;
    document.getElementById('prodImageUrl').value = prod.images[0] || '';
    document.getElementById('prodDescription').value = prod.description || '';

    productModal.classList.add('active');
  }

  // ----------------- Wholesale Leads -----------------
  function renderWholesaleTable() {
    const enquiries = window.SVTStore.getAllWholesaleEnquiries();
    const tbody = document.getElementById('adminWholesaleBody');
    if (!tbody) return;

    if (enquiries.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--color-muted); padding: 3rem;">No wholesale leads recorded yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = enquiries.map(e => `
      <tr>
        <td><strong>${e.referenceNo || 'WSE-001'}</strong></td>
        <td><strong>${e.businessName}</strong></td>
        <td>${e.contactPerson}</td>
        <td>
          <a href="https://wa.me/91${e.mobile}" target="_blank" style="color: #25D366; font-weight: 600;">
            +91 ${e.mobile} &nearr;
          </a>
        </td>
        <td>${e.category}</td>
        <td>${e.estimatedQty} (${e.unit})</td>
        <td>${e.location}</td>
        <td>
          <a href="mailto:${e.email}?subject=SV%20Textiles%20Wholesale%20Quotation%20${e.referenceNo}" class="btn btn-sm btn-secondary">Email</a>
        </td>
      </tr>
    `).join('');
  }

  // ----------------- Event Handlers -----------------
  document.addEventListener('DOMContentLoaded', () => {
    checkAdminAuth();

    // Admin Passcode Submission
    if (passForm) {
      passForm.onsubmit = (e) => {
        e.preventDefault();
        const code = passInput.value.trim();
        const res = window.SVTStore.loginAdmin(code);
        if (res.success) {
          checkAdminAuth();
        } else {
          alert(res.message);
        }
      };
    }

    if (btnQuickDemo) {
      btnQuickDemo.onclick = () => {
        window.SVTStore.loginAdmin('svtadmin2026');
        checkAdminAuth();
      };
    }

    if (btnLogout) {
      btnLogout.onclick = () => {
        window.SVTStore.logoutAdmin();
        checkAdminAuth();
      };
    }

    if (btnResetDemo) {
      btnResetDemo.onclick = () => {
        if (confirm('Reset catalogue products to default factory samples? This keeps customer test orders safe.')) {
          window.SVTStore.resetProducts();
          refreshAllData();
          alert('Catalogue reset to initial collection.');
        }
      };
    }

    // View Navigation Switcher
    navItems.forEach(item => {
      item.onclick = () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const targetView = item.getAttribute('data-view');
        views.forEach(v => v.style.display = 'none');

        if (targetView === 'dashboard') document.getElementById('viewDashboard').style.display = 'block';
        if (targetView === 'products') document.getElementById('viewProducts').style.display = 'block';
        if (targetView === 'orders') document.getElementById('viewOrders').style.display = 'block';
        if (targetView === 'wholesale') document.getElementById('viewWholesale').style.display = 'block';
      };
    });

    // Orders Filter Dropdown
    const orderFilterSelect = document.getElementById('adminOrderFilterSelect');
    if (orderFilterSelect) {
      orderFilterSelect.onchange = renderOrdersTable;
    }

    // Product Add Modal Trigger
    if (btnOpenAddModal) {
      btnOpenAddModal.onclick = () => {
        productModalTitle.textContent = 'Add New Textile Product';
        productForm.reset();
        editIdInput.value = '';
        productModal.classList.add('active');
      };
    }

    if (btnCloseModal) {
      btnCloseModal.onclick = () => productModal.classList.remove('active');
    }

    if (btnCloseOrderModal) {
      btnCloseOrderModal.onclick = () => orderModal.classList.remove('active');
    }

    // Product Form Submit (Add or Edit)
    if (productForm) {
      productForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('prodName').value.trim();
        const sku = document.getElementById('prodSku').value.trim();
        const category = document.getElementById('prodCategory').value;
        const unit = document.getElementById('prodUnit').value;
        const price = parseFloat(document.getElementById('prodPrice').value);
        const stock = parseInt(document.getElementById('prodStock').value, 10);
        const imgUrl = document.getElementById('prodImageUrl').value.trim() || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';
        const desc = document.getElementById('prodDescription').value.trim();
        const editId = editIdInput.value;

        if (!name || !sku || isNaN(price) || isNaN(stock)) {
          alert('Please fill all required product fields.');
          return;
        }

        const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const payload = {
          name,
          sku,
          category,
          categorySlug,
          unit,
          price,
          stock,
          images: [imgUrl],
          description: desc,
          material: `${category} Specification`,
          colours: [{ name: 'Standard Weave', hex: '#153D32' }]
        };

        if (editId) {
          payload.id = editId;
        }

        window.SVTStore.saveProduct(payload);
        productModal.classList.remove('active');
        refreshAllData();
      };
    }
  });
})();
