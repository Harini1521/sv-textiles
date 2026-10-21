/* ==========================================================================
   SV TEXTILES — Advanced Product Details Controller (product-details.js)
   Features:
     - Multi-image gallery with Prev/Next navigation & active thumbnail strip
     - High-resolution Lightbox inspection modal with Escape / Arrow keys
     - Interactive colour swatches with active visual rings & checkmarks
     - Synchronized selected colour label and product state
     - Quantity stepper (Minus & Plus buttons) strictly bounded [1, stock]
     - Fabric type, material, copyable SKU badge, price & savings calculation
     - Accurate real-time stock status (In Stock / Low Stock / Sold Out)
     - Add to Bag & Buy Now passing selected variants (colour, size, quantity)
     - Coordinating Related Products grid
     - Full reactive bilingual support (English & Tamil)
     - Robust lifecycle handling (loading / interactive / complete states)
   ========================================================================== */

(function () {
  'use strict';

  function initProductPage() {
    const params = new URLSearchParams(window.location.search);
    let productId = params.get('id');
    const container = document.getElementById('productDetailsContainer');
    const relatedGrid = document.getElementById('relatedProductsGrid');

    if (!container) return;

    // Fallback: If no productId in URL, default to the first catalog product so the page is never blank
    if (!productId && window.SVTStore) {
      const allProducts = window.SVTStore.getAllProducts();
      if (allProducts && allProducts.length > 0) {
        productId = allProducts[0].id;
      }
    }

    // Persistent state across language switches
    let currentSelectedColour = null;
    let currentSelectedSize = null;
    let currentQuantity = 1;
    let currentImageIndex = 0;

    function renderPage() {
      if (!window.SVTStore) {
        container.innerHTML = `
          <div style="text-align: center; padding: 4rem;">
            <h2>Store Not Initialized</h2>
            <p style="color: var(--color-muted); margin: 1rem 0 2rem;">Please refresh the page or return to the catalogue.</p>
            <a href="shop.html" class="btn btn-primary">Browse Catalogue</a>
          </div>
        `;
        return;
      }

      const allProducts = window.SVTStore.getAllProducts();
      let product = null;

      if (productId) {
        product = window.SVTStore.getProductById(productId) ||
          allProducts.find(p => p.id.toLowerCase() === productId.toLowerCase() || (p.sku && p.sku.toLowerCase() === productId.toLowerCase()));
      }

      if (!product && allProducts.length > 0) {
        product = allProducts[0];
      }

      if (!product) {
        container.innerHTML = `
          <div style="text-align: center; padding: 4rem;">
            <h2>Product Not Found</h2>
            <p style="color: var(--color-muted); margin: 1rem 0 2rem;">The requested product SKU or ID could not be located in our inventory.</p>
            <a href="shop.html" class="btn btn-primary">Return to Shop</a>
          </div>
        `;
        return;
      }

      const t = (k, params) => (window.SVTI18n ? window.SVTI18n.t(k, params) : k);
      const localizedUnit = t(`unit.${product.unit}`) || product.unit || 'piece';
      const localizedCategory = t(`cat.${product.categorySlug}`) || product.category || 'Textiles';

      // Update Page Title
      document.title = `${product.name} — SV TEXTILES`;

      // Safe stock values
      const rawStock = (typeof product.stock === 'number' && !isNaN(product.stock)) ? product.stock : parseInt(product.stock, 10);
      const stock = isNaN(rawStock) ? 0 : Math.max(0, rawStock);
      const minQty = Math.max(1, parseInt(product.minOrderQty, 10) || 1);
      const isOutOfStock = stock <= 0;
      const isLowStock = stock > 0 && stock <= 5;
      const inWishlist = window.SVTStore.isInWishlist(product.id);

      // Normalize colours array
      const rawColours = Array.isArray(product.colours) ? product.colours : [];
      const colours = rawColours.map((c, i) => {
        if (typeof c === 'string') {
          return { name: c, hex: '#153D32' };
        }
        return {
          name: c.name || `Colour ${i + 1}`,
          hex: c.hex || '#153D32'
        };
      });

      // Synchronize initial variant state
      if (!currentSelectedColour && colours.length > 0) {
        currentSelectedColour = colours[0].name;
      }
      product.selectedColour = currentSelectedColour;

      if (!currentSelectedSize && product.sizes && product.sizes.length > 0) {
        currentSelectedSize = product.sizes[0];
      }

      // Quantity clamping
      if (isOutOfStock) {
        currentQuantity = 0;
      } else {
        if (currentQuantity < minQty) currentQuantity = minQty;
        if (currentQuantity > stock) currentQuantity = stock;
      }
      product.selectedQuantity = currentQuantity;

      // Normalize images array
      let images = Array.isArray(product.images) && product.images.length > 0
        ? product.images.filter(Boolean)
        : (product.image ? [product.image] : []);

      if (images.length === 0) {
        images = ['https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80'];
      }

      if (currentImageIndex >= images.length || currentImageIndex < 0) {
        currentImageIndex = 0;
      }
      const activeImageSrc = images[currentImageIndex];

      // Savings calculations
      const hasDiscount = product.originalPrice && product.originalPrice > product.price;
      const savingsAmount = hasDiscount ? product.originalPrice - product.price : 0;
      const savingsPercent = hasDiscount ? Math.round((savingsAmount / product.originalPrice) * 100) : 0;

      // Render Product Details HTML
      container.innerHTML = `
        <div class="product-details-grid">
          <!-- Gallery Column -->
          <div class="product-gallery">
            <div class="main-image-frame" id="mainImageFrame" title="${t('prod.view_larger') || 'Click image to expand view'}">
              <!-- Floating Badges -->
              <div class="gallery-badge-overlay">
                ${product.isBestseller ? `<span class="badge badge-bestseller">${t('prod.bestseller_badge') || 'Bestseller'}</span>` : ''}
                ${product.isNew ? `<span class="badge badge-new">${t('prod.new_badge') || 'New Arrival'}</span>` : ''}
                ${hasDiscount ? `<span class="badge badge-sale">-${savingsPercent}% OFF</span>` : ''}
              </div>

              <!-- Zoom Trigger Icon -->
              <button type="button" class="gallery-zoom-trigger" id="btnGalleryZoom" title="${t('prod.view_larger') || 'Expand View'}" aria-label="Expand image">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </button>

              <!-- Main Image -->
              <img id="mainProductImage" class="main-product-img" src="${activeImageSrc}" alt="${product.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80';" />

              <!-- Prev / Next Navigation Buttons (only when multiple images exist) -->
              ${images.length > 1 ? `
                <button type="button" class="gallery-nav-btn prev" id="btnGalleryPrev" aria-label="Previous image">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <button type="button" class="gallery-nav-btn next" id="btnGalleryNext" aria-label="Next image">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
                <div class="gallery-counter" id="galleryCounter">${currentImageIndex + 1} / ${images.length}</div>
              ` : ''}
            </div>

            <!-- Thumbnail Strip -->
            ${images.length > 1 ? `
              <div class="thumbnail-row" role="tablist" aria-label="Product thumbnails">
                ${images.map((img, idx) => `
                  <button type="button" 
                          class="thumb-btn ${idx === currentImageIndex ? 'active' : ''}" 
                          data-idx="${idx}" 
                          data-img-src="${img}"
                          aria-label="View photo angle ${idx + 1}"
                          aria-selected="${idx === currentImageIndex ? 'true' : 'false'}">
                    <img src="${img}" alt="Thumbnail ${idx + 1}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=300&q=80';" />
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Product Info Column -->
          <div class="product-info-col">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
              <a href="shop.html?category=${product.categorySlug}" class="section-label" style="margin-bottom: 0;">
                ${localizedCategory}
              </a>
              <span class="unit-tag">${t('prod.sold_per', { unit: localizedUnit }) || `Sold per ${localizedUnit}`}</span>
            </div>

            <h1>${product.name}</h1>

            <!-- Meta: SKU Code & Ratings -->
            <div class="product-sku-meta">
              <span class="sku-badge" id="skuCopyBadge" title="Click to copy SKU">
                <span>SKU:</span> <strong>${product.sku}</strong>
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </span>
              <span>&bull;</span>
              <span style="color: var(--color-gold); font-weight: 700;">★ ${product.rating || '5.0'}</span>
              <span style="color: var(--color-muted);">(${product.reviewsCount || 1} ${t('prod.reviews') || 'reviews'})</span>
            </div>

            <!-- Pricing Hero -->
            <div class="pricing-hero">
              <span class="price">₹${product.price ? product.price.toLocaleString('en-IN') : '0'}</span>
              ${hasDiscount ? `
                <span class="old-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                <span class="savings-badge">
                  ${t('prod.save_calc', { amount: savingsAmount.toLocaleString('en-IN'), percent: savingsPercent }) || `Save ₹${savingsAmount.toLocaleString('en-IN')} (${savingsPercent}% OFF)`}
                </span>
              ` : ''}
              <span style="font-size: 0.88rem; color: var(--color-muted); width: 100%;">
                ${t('prod.per') || 'per'} ${localizedUnit} &bull; ${t('prod.inclusive_taxes') || 'Inclusive of all taxes'}
              </span>
            </div>

            <!-- Stock Availability Badge -->
            <div>
              ${
                isOutOfStock
                  ? `<div class="stock-status-box stock-out">
                       <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                       <span>${t('prod.sold_out') || 'Currently Sold Out'}</span>
                     </div>`
                  : isLowStock
                    ? `<div class="stock-status-box stock-low">
                         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                         <span>${t('prod.low_stock_alert', { n: stock, unit: localizedUnit }) || `Low Stock: Only ${stock} ${localizedUnit}(s) left`}</span>
                       </div>`
                    : `<div class="stock-status-box stock-in">
                         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                         <span>${t('prod.stock_count', { n: stock, unit: localizedUnit }) || `${stock} ${localizedUnit}(s) available in stock`}</span>
                       </div>`
              }
            </div>

            <!-- Colour Swatches -->
            ${
              colours.length > 0 ? `
              <div style="margin-bottom: 1.5rem;">
                <label style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--color-primary); display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
                  <span>${t('prod.select_colour') || 'Available Colours:'}</span>
                  <span id="selectedColourLabel" style="font-weight: 600; color: var(--color-charcoal); text-transform: none;">
                    ${currentSelectedColour}
                  </span>
                </label>
                <div class="swatches-row" id="detailColourSwatches" role="radiogroup" aria-label="Available Colours">
                  ${colours.map((c, i) => {
                    const isSelected = c.name === currentSelectedColour;
                    const hexColor = c.hex || '#153D32';
                    const isWhite = hexColor.toLowerCase() === '#ffffff' || hexColor.toLowerCase() === '#fff';
                    const iconColor = isWhite ? '#242824' : '#FFFFFF';
                    return `
                      <button type="button" 
                              class="colour-swatch-btn colour-swatch-pill ${isSelected ? 'selected' : ''}" 
                              data-colour-name="${c.name}"
                              data-colour-index="${i}"
                              style="background-color: ${hexColor};"
                              title="${c.name}"
                              aria-label="${c.name}"
                              role="radio"
                              aria-checked="${isSelected ? 'true' : 'false'}">
                        <svg class="swatch-check" width="14" height="14" fill="none" stroke="${iconColor}" stroke-width="3" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>` : ''
            }

            <!-- Size / Cut Selector (if applicable) -->
            ${
              product.sizes && product.sizes.length > 0 ? `
              <div style="margin-bottom: 1.5rem;">
                <label for="detailSizeSelect" style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--color-primary); display: block; margin-bottom: 0.5rem;">
                  ${t('prod.select_size') || 'Select Size / Cut:'}
                </label>
                <select id="detailSizeSelect" class="form-control" style="max-width: 420px; font-weight: 600;">
                  ${product.sizes.map(s => `
                    <option value="${s}" ${s === currentSelectedSize ? 'selected' : ''}>${s}</option>
                  `).join('')}
                </select>
              </div>` : ''
            }

            <!-- Quantity Stepper -->
            <div style="margin-bottom: 2rem;">
              <label style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: var(--color-primary); display: block; margin-bottom: 0.5rem;">
                ${t('prod.quantity') || 'Quantity'} (${localizedUnit}):
              </label>
              <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
                <div class="qty-stepper">
                  <button type="button" class="qty-btn qty-btn-minus" id="btnDetailMinus" ${isOutOfStock ? 'disabled' : ''} aria-label="Decrease quantity">-</button>
                  <input type="number" id="detailQtyInput" class="qty-input" value="${currentQuantity}" min="1" max="${stock}" ${isOutOfStock ? 'disabled' : ''} aria-label="Product quantity" />
                  <button type="button" class="qty-btn qty-btn-plus" id="btnDetailPlus" ${isOutOfStock ? 'disabled' : ''} aria-label="Increase quantity">+</button>
                </div>
                <span style="font-size: 0.85rem; color: var(--color-muted);">
                  ${t('prod.sold_per', { unit: localizedUnit }) || `Selling by the ${localizedUnit}`} 
                  ${minQty > 1 ? `(Min. ${minQty})` : ''}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
              ${
                isOutOfStock
                  ? `<button class="btn btn-secondary btn-lg" disabled style="flex: 2; opacity: 0.6; cursor: not-allowed;">
                       ${t('prod.out_of_stock') || 'Out of Stock'}
                     </button>`
                  : `
                    <button type="button" class="btn btn-primary btn-lg" id="btnDetailAddToCart" style="flex: 1.2; justify-content: center; gap: 0.5rem;">
                      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>
                      ${t('prod.add_to_bag') || 'Add to Bag'}
                    </button>
                    <button type="button" class="btn btn-gold btn-lg" id="btnDetailBuyNow" style="flex: 1; justify-content: center;">
                      ${t('prod.buy_now') || 'Buy Now →'}
                    </button>
                  `
              }
              <button type="button" class="btn-icon btn-wishlist-toggle ${inWishlist ? 'active' : ''}" 
                      data-product-id="${product.id}" 
                      style="width: 52px; height: 52px;"
                      title="${inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                      aria-label="Toggle Wishlist">
                <svg width="22" height="22" fill="${inWishlist ? 'var(--color-gold)' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <!-- WhatsApp Direct Enquiry Button -->
            <div style="margin-bottom: 2rem;">
              <a href="${window.generateWhatsAppLink ? window.generateWhatsAppLink(product.name, product.sku) : '#'}" 
                 target="_blank" rel="noopener noreferrer" 
                 class="btn btn-outline-gold btn-block" 
                 style="justify-content: center; gap: 0.5rem;">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                ${t('prod.whatsapp_enquiry') || 'Enquire About Bulk Availability On WhatsApp'}
              </a>
            </div>

            <!-- Detailed Editorial Specifications Table -->
            <table class="spec-table" aria-label="Product Specifications">
              <tbody>
                <tr>
                  <td>${t('prod.sku_lbl') || 'SKU Code:'}</td>
                  <td><strong>${product.sku}</strong></td>
                </tr>
                <tr>
                  <td>${t('prod.fabric_weave') || 'Fabric / Weave:'}</td>
                  <td>${product.material || 'Pure Textile Weave'}</td>
                </tr>
                <tr>
                  <td>${t('prod.material_lbl') || 'Material Composition:'}</td>
                  <td>${product.material || '100% Handcrafted Textile'}</td>
                </tr>
                <tr>
                  <td>${t('prod.width_dim') || 'Width / Dimension:'}</td>
                  <td>${product.width || 'Standard Width 44 Inches (112 cm)'}</td>
                </tr>
                <tr>
                  <td>${t('prod.selling_unit_lbl') || 'Selling Unit:'}</td>
                  <td>Per <strong>${localizedUnit}</strong></td>
                </tr>
                <tr>
                  <td>${t('prod.min_order') || 'Minimum Order:'}</td>
                  <td>${minQty} ${localizedUnit}</td>
                </tr>
              </tbody>
            </table>

            <!-- Information Tabs -->
            <div class="tab-pills" role="tablist">
              <button type="button" class="tab-pill active" data-tab-target="#tabDescription" role="tab" aria-selected="true">
                ${t('prod.desc_tab') || 'Description'}
              </button>
              <button type="button" class="tab-pill" data-tab-target="#tabCare" role="tab" aria-selected="false">
                ${t('prod.care_tab') || 'Fabric Care'}
              </button>
              <button type="button" class="tab-pill" data-tab-target="#tabDelivery" role="tab" aria-selected="false">
                ${t('prod.delivery_tab') || 'Delivery & Returns'}
              </button>
            </div>

            <div id="tabDescription" class="tab-panel active" role="tabpanel">
              <p>${product.description || 'Authentic handcrafted textiles inspected for yarn purity and finish.'}</p>
            </div>

            <div id="tabCare" class="tab-panel" role="tabpanel">
              <p>${product.careInstructions || 'Dry clean recommended for first wash. Subsequent gentle cold wash with mild detergent in shade.'}</p>
            </div>

            <div id="tabDelivery" class="tab-panel" role="tabpanel">
              <p>${product.deliveryInfo || 'Dispatches within 24-48 business hours across all major Indian pincodes via express insured courier.'}</p>
              <p style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--color-muted);">
                Complimentary delivery on all prepaid orders exceeding ₹1,999. Standard delivery ₹99 for smaller orders.
              </p>
            </div>
          </div>
        </div>
      `;

      // ----------------------------------------------------
      // GALLERY & THUMBNAILS LOGIC
      // ----------------------------------------------------
      const mainImg = document.getElementById('mainProductImage');
      const counterEl = document.getElementById('galleryCounter');
      const thumbBtns = container.querySelectorAll('.thumb-btn');

      function switchImage(index) {
        if (!images[index]) return;
        currentImageIndex = index;
        const newSrc = images[currentImageIndex];

        if (mainImg) {
          mainImg.src = newSrc;
        }

        if (counterEl) {
          counterEl.textContent = `${currentImageIndex + 1} / ${images.length}`;
        }

        thumbBtns.forEach((b, i) => {
          const isActive = (i === currentImageIndex);
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // If Lightbox is currently open, synchronize its image too
        const lightboxModal = document.getElementById('productLightbox');
        const lightboxImg = document.getElementById('lightboxImage');
        if (lightboxModal && lightboxModal.classList.contains('active') && lightboxImg) {
          lightboxImg.src = newSrc;
        }
      }

      // Thumbnail Click Handlers
      thumbBtns.forEach(btn => {
        btn.onclick = (e) => {
          e.preventDefault();
          const idxAttr = btn.getAttribute('data-idx');
          const idx = parseInt(idxAttr, 10);
          if (!isNaN(idx)) {
            switchImage(idx);
          }
        };
      });

      // Gallery Prev / Next Buttons
      const btnPrev = document.getElementById('btnGalleryPrev');
      const btnNext = document.getElementById('btnGalleryNext');
      if (btnPrev) {
        btnPrev.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const newIdx = (currentImageIndex - 1 + images.length) % images.length;
          switchImage(newIdx);
        };
      }
      if (btnNext) {
        btnNext.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const newIdx = (currentImageIndex + 1) % images.length;
          switchImage(newIdx);
        };
      }

      // Lightbox Modal Controls
      const lightboxModal = document.getElementById('productLightbox');
      const lightboxImg = document.getElementById('lightboxImage');
      const btnLightboxClose = document.getElementById('btnLightboxClose');
      const mainFrame = document.getElementById('mainImageFrame');
      const btnZoom = document.getElementById('btnGalleryZoom');

      function openLightbox() {
        if (lightboxModal && lightboxImg) {
          lightboxImg.src = images[currentImageIndex];
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }

      function closeLightbox() {
        if (lightboxModal) {
          lightboxModal.classList.remove('active');
          document.body.style.overflow = '';
        }
      }

      if (mainFrame) {
        mainFrame.onclick = (e) => {
          if (e.target.closest('button')) return; // let nav buttons do their job
          openLightbox();
        };
      }
      if (btnZoom) {
        btnZoom.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openLightbox();
        };
      }
      if (btnLightboxClose) {
        btnLightboxClose.onclick = (e) => {
          e.preventDefault();
          closeLightbox();
        };
      }
      if (lightboxModal) {
        lightboxModal.onclick = (e) => {
          if (e.target === lightboxModal) closeLightbox();
        };
      }

      // ----------------------------------------------------
      // COLOUR SWATCH SELECTION & SYNCHRONIZATION
      // ----------------------------------------------------
      const swatchBtns = container.querySelectorAll('.colour-swatch-btn, .colour-swatch-pill');
      const colourLabel = document.getElementById('selectedColourLabel');

      function selectColour(colourName, colourIndex) {
        currentSelectedColour = colourName;
        product.selectedColour = colourName;

        // Visual update on all swatches
        swatchBtns.forEach(btn => {
          const isMatch = btn.getAttribute('data-colour-name') === colourName;
          btn.classList.toggle('selected', isMatch);
          btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
        });

        // Label update
        if (colourLabel) {
          colourLabel.textContent = colourName;
        }

        // If gallery has a photo corresponding to this colour index, switch gallery image
        if (typeof colourIndex === 'number' && images[colourIndex]) {
          switchImage(colourIndex);
        }
      }

      swatchBtns.forEach((btn, idx) => {
        btn.onclick = (e) => {
          e.preventDefault();
          const name = btn.getAttribute('data-colour-name');
          const colIdx = parseInt(btn.getAttribute('data-colour-index'), 10);
          selectColour(name, !isNaN(colIdx) ? colIdx : idx);
        };
      });

      // Size dropdown change
      const sizeSelect = document.getElementById('detailSizeSelect');
      if (sizeSelect) {
        sizeSelect.onchange = () => {
          currentSelectedSize = sizeSelect.value;
        };
      }

      // ----------------------------------------------------
      // QUANTITY STEPPER (Minus & Plus strictly bounded)
      // ----------------------------------------------------
      const qtyInput = document.getElementById('detailQtyInput');
      const btnMinus = document.getElementById('btnDetailMinus');
      const btnPlus = document.getElementById('btnDetailPlus');

      function setQuantity(newQty) {
        if (isOutOfStock) {
          currentQuantity = 0;
          if (qtyInput) qtyInput.value = 0;
          return;
        }

        let q = parseInt(newQty, 10);
        if (isNaN(q) || q < 1) {
          q = 1;
        }
        if (q > stock) {
          q = stock;
          if (window.showToast) {
            window.showToast(`Maximum available inventory is ${stock} ${localizedUnit}(s).`, 'error');
          }
        }

        currentQuantity = q;
        product.selectedQuantity = q;
        if (qtyInput) {
          qtyInput.value = q;
        }
      }

      if (btnMinus && !isOutOfStock) {
        btnMinus.onclick = (e) => {
          e.preventDefault();
          const currentVal = parseInt(qtyInput ? qtyInput.value : currentQuantity, 10) || 1;
          if (currentVal > 1) {
            setQuantity(currentVal - 1);
          } else {
            // Already at minimum 1; remain at 1
            setQuantity(1);
          }
        };
      }

      if (btnPlus && !isOutOfStock) {
        btnPlus.onclick = (e) => {
          e.preventDefault();
          const currentVal = parseInt(qtyInput ? qtyInput.value : currentQuantity, 10) || 1;
          if (currentVal < stock) {
            setQuantity(currentVal + 1);
          } else {
            setQuantity(stock);
          }
        };
      }

      if (qtyInput && !isOutOfStock) {
        qtyInput.oninput = () => {
          const raw = parseInt(qtyInput.value, 10);
          if (!isNaN(raw) && raw > stock) {
            qtyInput.value = stock;
            currentQuantity = stock;
            if (window.showToast) {
              window.showToast(`Cannot exceed available inventory: ${stock} ${localizedUnit}(s).`, 'error');
            }
          }
        };

        qtyInput.onchange = () => {
          const raw = parseInt(qtyInput.value, 10);
          setQuantity(isNaN(raw) ? 1 : raw);
        };
      }

      // ----------------------------------------------------
      // ADD TO BAG & BUY NOW BUTTONS
      // ----------------------------------------------------
      const btnAddToCart = document.getElementById('btnDetailAddToCart');
      if (btnAddToCart) {
        btnAddToCart.onclick = (e) => {
          e.preventDefault();
          const qty = parseInt(qtyInput ? qtyInput.value : currentQuantity, 10) || 1;
          const res = window.SVTStore.addToCart(product.id, qty, currentSelectedColour, currentSelectedSize);
          if (res.success) {
            const variantDetails = currentSelectedColour ? ` (${currentSelectedColour})` : '';
            if (window.showToast) {
              window.showToast(`${qty} ${localizedUnit}(s) of "${product.name}"${variantDetails} added to your bag!`, 'success');
            }
          } else {
            if (window.showToast) {
              window.showToast(res.message, 'error');
            }
          }
        };
      }

      const btnBuyNow = document.getElementById('btnDetailBuyNow');
      if (btnBuyNow) {
        btnBuyNow.onclick = (e) => {
          e.preventDefault();
          const qty = parseInt(qtyInput ? qtyInput.value : currentQuantity, 10) || 1;
          const res = window.SVTStore.addToCart(product.id, qty, currentSelectedColour, currentSelectedSize);
          if (res.success) {
            window.location.href = 'checkout.html';
          } else {
            if (window.showToast) {
              window.showToast(res.message, 'error');
            }
          }
        };
      }

      // SKU Copy interaction
      const skuBadge = document.getElementById('skuCopyBadge');
      if (skuBadge) {
        skuBadge.onclick = (e) => {
          e.preventDefault();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(product.sku).then(() => {
              if (window.showToast) window.showToast(`SKU ${product.sku} copied to clipboard!`, 'info');
            }).catch(() => {
              if (window.showToast) window.showToast(`SKU: ${product.sku}`, 'info');
            });
          } else if (window.showToast) {
            window.showToast(`SKU: ${product.sku}`, 'info');
          }
        };
      }

      // Tab Switcher
      const tabPills = container.querySelectorAll('.tab-pill');
      tabPills.forEach(pill => {
        pill.onclick = (e) => {
          e.preventDefault();
          tabPills.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('aria-selected', 'false');
          });
          pill.classList.add('active');
          pill.setAttribute('aria-selected', 'true');

          const targetId = pill.getAttribute('data-tab-target');
          container.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
          const activePanel = container.querySelector(targetId);
          if (activePanel) activePanel.classList.add('active');
        };
      });

      // ----------------------------------------------------
      // RELATED PRODUCTS SECTION
      // ----------------------------------------------------
      if (relatedGrid) {
        const related = allProducts.filter(p => p.id !== product.id && p.categorySlug === product.categorySlug);
        const displayRelated = (related.length >= 2 ? related : allProducts.filter(p => p.id !== product.id)).slice(0, 4);

        if (displayRelated.length > 0) {
          relatedGrid.innerHTML = displayRelated.map(p => window.renderProductCardHTML(p)).join('');
        } else {
          const section = document.getElementById('relatedProductsSection');
          if (section) section.style.display = 'none';
        }
      }
    }

    // Initial render
    renderPage();

    // Keyboard navigation (avoid interfering when typing in inputs/textareas)
    function handleKeyNav(e) {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const lightboxModal = document.getElementById('productLightbox');
      const isLightboxOpen = lightboxModal && lightboxModal.classList.contains('active');

      if (e.key === 'Escape' && isLightboxOpen) {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
      } else if (e.key === 'ArrowLeft') {
        const prevBtn = document.getElementById('btnGalleryPrev');
        if (prevBtn) prevBtn.click();
      } else if (e.key === 'ArrowRight') {
        const nextBtn = document.getElementById('btnGalleryNext');
        if (nextBtn) nextBtn.click();
      }
    }

    // Attach single keyboard handler
    document.removeEventListener('keydown', handleKeyNav);
    document.addEventListener('keydown', handleKeyNav);

    // Reactive re-render on language toggle (preserves selected variant state)
    function onLangChange() {
      renderPage();
    }
    window.removeEventListener('svt_lang_change', onLangChange);
    window.addEventListener('svt_lang_change', onLangChange);
  }

  // Ensure execution regardless of DOM readyState
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductPage);
  } else {
    initProductPage();
  }
})();
