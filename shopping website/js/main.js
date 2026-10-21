/* ==========================================================================
   SV TEXTILES — Main JavaScript & Shared UI Components
   Handles navigation, cart badges, toast notifications, quick-view modal,
   search modal, WhatsApp integration, and reusable product cards.
   ========================================================================== */

(function () {
  'use strict';

  // Configurable WhatsApp Business number placeholder (do not invent fake personal number)
  // Format: country code without + or dashes (e.g., '919876543210' for demo / business placeholder)
  const WHATSAPP_CONFIG = {
    businessNumber: '919000000000', // Configurable business support number
    defaultGreeting: 'Hello SV Textiles, I would like to enquire about your textile collections.'
  };

  // ----------------- Product Card Component Generator -----------------
  window.renderProductCardHTML = function (product) {
    if (!product) return '';
    const inWishlist = window.SVTStore ? window.SVTStore.isInWishlist(product.id) : false;
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;
    const t = (k, params) => (window.SVTI18n ? window.SVTI18n.t(k, params) : k);

    // Badges
    let badgeHTML = '';
    if (isOutOfStock) {
      badgeHTML += `<span class="badge badge-out-stock">${t('prod.out_of_stock')}</span>`;
    } else if (product.isNew) {
      badgeHTML += `<span class="badge badge-new">${t('prod.new_badge')}</span>`;
    } else if (product.isBestseller) {
      badgeHTML += `<span class="badge badge-bestseller">${t('prod.bestseller_badge')}</span>`;
    }

    if (product.originalPrice && product.originalPrice > product.price) {
      const discountPct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      badgeHTML += `<span class="badge badge-sale">-${discountPct}%</span>`;
    }

    // Color Swatches
    let swatchesHTML = '';
    if (product.colours && product.colours.length > 0) {
      swatchesHTML = `<div class="product-swatches" title="Available Colours">
        ${product.colours.slice(0, 4).map(c => `<span class="swatch" style="background-color: ${c.hex};" title="${c.name}"></span>`).join('')}
        ${product.colours.length > 4 ? `<span style="font-size: 0.72rem; color: var(--color-muted);">+${product.colours.length - 4}</span>` : ''}
      </div>`;
    }

    // Stock Status
    let stockStatusText = `<span class="product-stock-status">${t('prod.in_stock')}</span>`;
    if (isOutOfStock) {
      stockStatusText = `<span class="product-stock-status out">${t('prod.sold_out')}</span>`;
    } else if (isLowStock) {
      stockStatusText = `<span class="product-stock-status low">${t('prod.low_stock', { n: product.stock })}</span>`;
    }

    const primaryImage = (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';
    const localizedUnit = t(`unit.${product.unit}`) || product.unit;
    const perPrefix = t('prod.per');
    const unitTextDisplay = perPrefix ? `${perPrefix} ${localizedUnit}` : localizedUnit;
    const localizedCategory = t(`cat.${product.categorySlug}`) || product.category;

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-image-box">
          <a href="product.html?id=${product.id}" aria-label="View ${product.name}">
            <img src="${primaryImage}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';" />
          </a>
          
          <div class="product-badges">
            ${badgeHTML}
          </div>

          <div class="product-action-floating">
            <button class="btn-icon btn-wishlist-toggle ${inWishlist ? 'active' : ''}" 
                    data-product-id="${product.id}" 
                    title="${inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                    aria-label="Wishlist">
              <svg width="18" height="18" fill="${inWishlist ? 'var(--color-gold)' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <button class="btn-quick-view-overlay" data-product-id="${product.id}">
            ${t('prod.quick_view')}
          </button>
        </div>

        <div class="product-details">
          <div class="product-category-meta">${localizedCategory} &bull; /${localizedUnit}</div>
          <h3 class="product-title">
            <a href="product.html?id=${product.id}">${product.name}</a>
          </h3>

          <div class="product-price-row">
            <span class="product-current-price">₹${product.price.toLocaleString('en-IN')}</span>
            ${product.originalPrice ? `<span class="product-old-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
            <span class="product-unit-text">${unitTextDisplay}</span>
          </div>

          ${swatchesHTML}

          <div class="product-card-footer">
            ${stockStatusText}
            ${
              isOutOfStock
                ? `<button class="btn btn-sm btn-secondary" disabled style="opacity: 0.6;">${t('prod.sold_out')}</button>`
                : `<button class="btn btn-sm btn-primary btn-add-to-cart-direct" data-product-id="${product.id}">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
                    ${t('prod.add')}
                  </button>`
            }
          </div>
        </div>
      </article>
    `;
  };

  // ----------------- Toast Notifications -----------------
  window.showToast = function (message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSVG = '';
    if (type === 'success') {
      iconSVG = '<svg width="20" height="20" fill="none" stroke="#2E7D32" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'error') {
      iconSVG = '<svg width="20" height="20" fill="none" stroke="#C62828" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    } else {
      iconSVG = '<svg width="20" height="20" fill="none" stroke="var(--color-gold)" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `
      <div style="flex-shrink: 0;">${iconSVG}</div>
      <div style="flex: 1;">${message}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 3800);
  };

  // ----------------- Badges & Header Updates -----------------
  function updateHeaderBadges() {
    if (!window.SVTStore) return;
    const cartCount = window.SVTStore.getCartCount();
    const wishlist = window.SVTStore.getWishlist();

    const cartBadgeEls = document.querySelectorAll('.header-cart-count');
    cartBadgeEls.forEach(el => {
      el.textContent = cartCount;
      el.style.display = cartCount > 0 ? 'flex' : 'none';
    });

    const wishlistBadgeEls = document.querySelectorAll('.header-wishlist-count');
    wishlistBadgeEls.forEach(el => {
      el.textContent = wishlist.length;
      el.style.display = wishlist.length > 0 ? 'flex' : 'none';
    });
  }

  // ----------------- Quick View Modal -----------------
  function openQuickView(productId) {
    if (!window.SVTStore) return;
    const product = window.SVTStore.getProductById(productId);
    if (!product) return;

    let modalBackdrop = document.getElementById('quickViewModal');
    if (!modalBackdrop) {
      modalBackdrop = document.createElement('div');
      modalBackdrop.id = 'quickViewModal';
      modalBackdrop.className = 'modal-backdrop';
      document.body.appendChild(modalBackdrop);
    }

    const primaryImg = (product.images && product.images[0]) || '';
    const isOut = product.stock <= 0;
    const t = (k, params) => (window.SVTI18n ? window.SVTI18n.t(k, params) : k);
    const localizedUnit = t(`unit.${product.unit}`) || product.unit;
    const localizedCategory = t(`cat.${product.categorySlug}`) || product.category;

    modalBackdrop.innerHTML = `
      <div class="modal-dialog" style="max-width: 840px;">
        <button class="modal-close-btn" id="btnCloseQuickView" aria-label="Close modal">&times;</button>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2rem;">
          <div>
            <img src="${primaryImg}" alt="${product.name}" style="width: 100%; border-radius: var(--radius-sm); object-fit: cover; aspect-ratio: 3/4;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80';" />
          </div>
          <div style="display: flex; flex-direction: column;">
            <div class="section-label">${localizedCategory} &bull; /${localizedUnit}</div>
            <h2 style="font-size: 1.85rem; margin-bottom: 0.5rem;">${product.name}</h2>
            <div style="font-size: 0.8rem; color: var(--color-muted); margin-bottom: 1rem;">SKU: ${product.sku}</div>
            
            <div style="display: flex; align-items: baseline; gap: 0.75rem; margin-bottom: 1.25rem;">
              <span style="font-size: 1.75rem; font-weight: 700; color: var(--color-charcoal);">₹${product.price.toLocaleString('en-IN')}</span>
              ${product.originalPrice ? `<span style="font-size: 1.1rem; text-decoration: line-through; color: var(--color-muted);">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : ''}
              <span class="badge badge-unit">${localizedUnit}</span>
            </div>

            <p style="color: var(--color-charcoal-light); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6;">
              ${product.description}
            </p>

            ${
              product.colours && product.colours.length > 0 ? `
              <div style="margin-bottom: 1.25rem;">
                <label style="font-size: 0.82rem; font-weight: 600; text-transform: uppercase; color: var(--color-primary); display: block; margin-bottom: 0.4rem;">${t('prod.select_colour')}</label>
                <div style="display: flex; gap: 8px;" id="qvColourSwatches">
                  ${product.colours.map((c, i) => `
                    <button class="qv-swatch-btn ${i === 0 ? 'selected' : ''}" data-colour="${c.name}" style="width: 28px; height: 28px; border-radius: 50%; background: ${c.hex}; border: 2px solid ${i === 0 ? 'var(--color-primary)' : 'var(--color-border)'};" title="${c.name}"></button>
                  `).join('')}
                </div>
              </div>` : ''
            }

            ${
              product.sizes && product.sizes.length > 0 ? `
              <div style="margin-bottom: 1.25rem;">
                <label style="font-size: 0.82rem; font-weight: 600; text-transform: uppercase; color: var(--color-primary); display: block; margin-bottom: 0.4rem;">${t('prod.select_size')}</label>
                <select class="form-control" id="qvSizeSelect" style="max-width: 260px;">
                  ${product.sizes.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
              </div>` : ''
            }

            <div style="margin-top: auto; display: flex; gap: 1rem; align-items: center; padding-top: 1rem; border-top: 1px solid var(--color-border);">
              <div style="display: flex; align-items: center; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">
                <button type="button" style="padding: 0.5rem 0.85rem;" id="qvQtyMinus">-</button>
                <input type="number" id="qvQtyInput" value="1" min="1" max="${product.stock}" style="width: 44px; text-align: center; border: none; font-weight: 600;" />
                <button type="button" style="padding: 0.5rem 0.85rem;" id="qvQtyPlus">+</button>
              </div>

              ${
                isOut
                  ? `<button class="btn btn-secondary" disabled style="flex: 1;">${t('prod.out_of_stock')}</button>`
                  : `<button class="btn btn-primary" id="qvAddToCartBtn" style="flex: 1;">${t('prod.add_to_bag')}</button>`
              }
              <a href="product.html?id=${product.id}" class="btn btn-outline-gold" style="padding: 0.85rem 1rem;" title="${t('prod.view_full')}">${t('prod.view_full')}</a>
            </div>
          </div>
        </div>
      </div>
    `;

    modalBackdrop.classList.add('active');

    // Attach internal modal handlers
    document.getElementById('btnCloseQuickView').onclick = () => modalBackdrop.classList.remove('active');
    modalBackdrop.onclick = (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('active');
    };

    let selectedColour = product.colours && product.colours[0] ? product.colours[0].name : null;
    const swatchBtns = modalBackdrop.querySelectorAll('.qv-swatch-btn');
    swatchBtns.forEach(btn => {
      btn.onclick = () => {
        swatchBtns.forEach(b => b.style.borderColor = 'var(--color-border)');
        btn.style.borderColor = 'var(--color-primary)';
        selectedColour = btn.getAttribute('data-colour');
      };
    });

    const qtyInput = document.getElementById('qvQtyInput');
    const btnMinus = document.getElementById('qvQtyMinus');
    const btnPlus = document.getElementById('qvQtyPlus');

    if (btnMinus && btnPlus && qtyInput) {
      btnMinus.onclick = () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val > 1) qtyInput.value = val - 1;
      };
      btnPlus.onclick = () => {
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val < product.stock) qtyInput.value = val + 1;
        else window.showToast(`Max available stock is ${product.stock} ${product.unit}(s).`, 'error');
      };
    }

    const addToCartBtn = document.getElementById('qvAddToCartBtn');
    if (addToCartBtn) {
      addToCartBtn.onclick = () => {
        const qty = parseInt(qtyInput.value, 10) || 1;
        const sizeSelect = document.getElementById('qvSizeSelect');
        const selectedSize = sizeSelect ? sizeSelect.value : null;

        const result = window.SVTStore.addToCart(product.id, qty, selectedColour, selectedSize);
        if (result.success) {
          window.showToast(`${product.name} added to your shopping bag!`, 'success');
          modalBackdrop.classList.remove('active');
          updateHeaderBadges();
        } else {
          window.showToast(result.message, 'error');
        }
      };
    }
  }

  // ----------------- WhatsApp Link Formatter -----------------
  window.generateWhatsAppLink = function (productName, sku) {
    let msg = WHATSAPP_CONFIG.defaultGreeting;
    if (productName) {
      msg = `Hello SV Textiles, I am interested in "${productName}" (SKU: ${sku || 'N/A'}). Could you please share bulk pricing and availability details?`;
    }
    const encoded = encodeURIComponent(msg);
    return `https://wa.me/${WHATSAPP_CONFIG.businessNumber}?text=${encoded}`;
  };

  // ----------------- Search Modal -----------------
  function setupSearchModal() {
    const searchBtns = document.querySelectorAll('.btn-search-trigger');
    let searchModal = document.getElementById('searchModal');
    if (!searchModal) {
      searchModal = document.createElement('div');
      searchModal.id = 'searchModal';
      searchModal.className = 'modal-backdrop';
      searchModal.innerHTML = `
        <div class="modal-dialog" style="max-width: 650px; padding: 2rem;">
          <button class="modal-close-btn" id="btnCloseSearchModal">&times;</button>
          <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Search SV Textiles Collections</h3>
          <div style="position: relative; margin-bottom: 1.5rem;">
            <input type="text" id="liveSearchInput" class="form-control" placeholder="Search cotton, sarees, tussar silk, dress materials..." autofocus />
          </div>
          <div id="liveSearchResults" style="max-height: 380px; overflow-y: auto;">
            <div style="color: var(--color-muted); font-size: 0.9rem; text-align: center; padding: 1.5rem;">
              Type a fabric name, weave, or SKU above to search our catalogue...
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(searchModal);
    }

    const closeBtn = document.getElementById('btnCloseSearchModal');
    const searchInput = document.getElementById('liveSearchInput');
    const resultsContainer = document.getElementById('liveSearchResults');

    searchBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        searchModal.classList.add('active');
        setTimeout(() => searchInput.focus(), 100);
      };
    });

    closeBtn.onclick = () => searchModal.classList.remove('active');
    searchModal.onclick = (e) => {
      if (e.target === searchModal) searchModal.classList.remove('active');
    };

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (searchModal && searchModal.classList.contains('active')) searchModal.classList.remove('active');
        const qvModal = document.getElementById('quickViewModal');
        if (qvModal && qvModal.classList.contains('active')) qvModal.classList.remove('active');
        const mobileNav = document.getElementById('mobileNavBackdrop');
        if (mobileNav && mobileNav.classList.contains('active')) mobileNav.classList.remove('active');
      }
    });

    if (searchInput) {
      searchInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = searchInput.value.trim();
          if (query) {
            window.location.href = `shop.html?q=${encodeURIComponent(query)}`;
          }
        }
      };

      searchInput.oninput = (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
          resultsContainer.innerHTML = `<div style="color: var(--color-muted); font-size: 0.9rem; text-align: center; padding: 1.5rem;">Type a fabric name, weave, or SKU above...</div>`;
          return;
        }

        const products = window.SVTStore ? window.SVTStore.getAllProducts() : [];
        const matches = products.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.sku.toLowerCase().includes(query) ||
          p.material.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
          resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--color-muted);">
              <p>No matching fabrics or garments found for "<strong>${query}</strong>".</p>
              <a href="shop.html" class="btn btn-sm btn-outline-gold" style="margin-top: 1rem;">View All Catalogue</a>
            </div>
          `;
          return;
        }

        resultsContainer.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${matches.map(p => `
              <a href="product.html?id=${p.id}" style="display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border: 1px solid var(--color-border); border-radius: var(--radius-sm); transition: background 0.2s;" onmouseover="this.style.background='var(--color-ivory)'" onmouseout="this.style.background='transparent'">
                <img src="${p.images[0]}" alt="${p.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-sm);" />
                <div style="flex: 1;">
                  <div style="font-weight: 600; font-size: 0.92rem; color: var(--color-primary);">${p.name}</div>
                  <div style="font-size: 0.78rem; color: var(--color-muted);">${p.category} &bull; SKU: ${p.sku}</div>
                </div>
                <div style="font-weight: 700; color: var(--color-charcoal); font-size: 0.95rem;">
                  ₹${p.price.toLocaleString('en-IN')}<span style="font-size: 0.72rem; color: var(--color-muted);">/${p.unit}</span>
                </div>
              </a>
            `).join('')}
            <div style="text-align: center; margin-top: 0.75rem;">
              <a href="shop.html?q=${encodeURIComponent(query)}" class="btn btn-sm btn-outline-gold">
                View all ${matches.length} results in catalogue &rarr;
              </a>
            </div>
          </div>
        `;
      };
    }
  }

  // ----------------- Global Event Delegation -----------------
  function setupGlobalEvents() {
    // Direct Add-to-cart clicks
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.btn-add-to-cart-direct');
      if (addBtn) {
        e.preventDefault();
        const prodId = addBtn.getAttribute('data-product-id');
        if (window.SVTStore) {
          const res = window.SVTStore.addToCart(prodId, 1);
          if (res.success) {
            window.showToast(res.message, 'success');
            updateHeaderBadges();
          } else {
            window.showToast(res.message, 'error');
          }
        }
        return;
      }

      // Quick View Overlay click
      const qvBtn = e.target.closest('.btn-quick-view-overlay');
      if (qvBtn) {
        e.preventDefault();
        const prodId = qvBtn.getAttribute('data-product-id');
        openQuickView(prodId);
        return;
      }

      // Wishlist toggle click
      const wishBtn = e.target.closest('.btn-wishlist-toggle');
      if (wishBtn) {
        e.preventDefault();
        const prodId = wishBtn.getAttribute('data-product-id');
        if (window.SVTStore) {
          const res = window.SVTStore.toggleWishlist(prodId);
          if (res.added) {
            wishBtn.classList.add('active');
            wishBtn.querySelector('svg').setAttribute('fill', 'var(--color-gold)');
            window.showToast('Saved to your Wishlist!', 'info');
          } else {
            wishBtn.classList.remove('active');
            wishBtn.querySelector('svg').setAttribute('fill', 'none');
            window.showToast('Removed from Wishlist.', 'info');
          }
          updateHeaderBadges();
        }
        return;
      }
    });

    // Mobile nav toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.getElementById('mobileNavBackdrop');
    const closeMobileNav = document.getElementById('btnCloseMobileNav');

    if (menuToggle && mobileNav) {
      menuToggle.onclick = () => mobileNav.classList.add('active');
    }
    if (closeMobileNav && mobileNav) {
      closeMobileNav.onclick = () => mobileNav.classList.remove('active');
    }
    if (mobileNav) {
      mobileNav.onclick = (e) => {
        if (e.target === mobileNav) mobileNav.classList.remove('active');
      };
    }

    // Floating WhatsApp dynamic click
    const waFloating = document.querySelector('.floating-whatsapp');
    if (waFloating) {
      waFloating.href = window.generateWhatsAppLink();
      waFloating.target = '_blank';
      waFloating.rel = 'noopener noreferrer';
    }

    // Scroll header shadow
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.site-header');
      if (header) {
        if (window.scrollY > 30) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }
    });

    // Listen for store updates
    window.addEventListener('svt_store_update', () => {
      updateHeaderBadges();
    });
  }

  // DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    updateHeaderBadges();
    setupGlobalEvents();
    setupSearchModal();
  });
})();
