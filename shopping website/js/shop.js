/* ==========================================================================
   SV TEXTILES — Shop Catalogue Controller (shop.js)
   Handles dynamic filtering, sorting, price range, URL query parsing,
   active filter pills, and responsive filter drawers.
   ========================================================================== */

(function () {
  'use strict';

  let currentCategory = null;
  let selectedUnits = [];
  let minPrice = null;
  let maxPrice = null;
  let inStockOnly = false;
  let searchQuery = null;
  let sortCriteria = 'featured';

  // Elements
  const productsGrid = document.getElementById('shopProductsGrid');
  const emptyState = document.getElementById('shopEmptyState');
  const matchCountEl = document.getElementById('productMatchCount');
  const mobileCountEl = document.getElementById('mobileCountDisplay');
  const activeFiltersEl = document.getElementById('activeFilterTags');
  const catFilterContainer = document.getElementById('categoryFilterList');
  const sortSelect = document.getElementById('sortBySelect');
  const priceMinInput = document.getElementById('priceMin');
  const priceMaxInput = document.getElementById('priceMax');
  const btnApplyPrice = document.getElementById('btnApplyPrice');
  const btnClearAll = document.getElementById('btnClearAllFilters');
  const btnResetEmpty = document.getElementById('btnResetFiltersEmpty');
  const inStockCheckbox = document.getElementById('filterInStockOnly');
  const mobileFilterBtn = document.getElementById('btnToggleMobileFilters');
  const filterSidebar = document.getElementById('filterSidebar');
  const catalogPageTitle = document.getElementById('catalogPageTitle');

  // Initialize from URL params
  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('category')) {
      currentCategory = params.get('category');
    }
    if (params.has('unit')) {
      selectedUnits = [params.get('unit')];
    }
    if (params.has('q')) {
      searchQuery = params.get('q').toLowerCase();
    }
    if (params.has('filter')) {
      const f = params.get('filter');
      if (f === 'new') sortCriteria = 'newest';
      if (f === 'bestseller') sortCriteria = 'featured';
    }
  }

  // Populate category checkboxes
  function renderCategoryFilters() {
    if (!catFilterContainer || typeof SVT_CATEGORIES === 'undefined') return;
    const t = (k) => (window.SVTI18n ? window.SVTI18n.t(k) : k);
    const allCatText = t('shop.all_categories') || 'All Categories';

    catFilterContainer.innerHTML = `
      <label>
        <input type="radio" name="catRadio" value="" ${!currentCategory ? 'checked' : ''} />
        ${allCatText}
      </label>
      ${SVT_CATEGORIES.map(cat => {
        const localizedName = t(`cat.${cat.slug}`) || cat.name;
        return `
          <label>
            <input type="radio" name="catRadio" value="${cat.slug}" ${currentCategory === cat.slug ? 'checked' : ''} />
            ${localizedName}
          </label>
        `;
      }).join('')}
    `;

    const radios = catFilterContainer.querySelectorAll('input[name="catRadio"]');
    radios.forEach(radio => {
      radio.onchange = () => {
        currentCategory = radio.value || null;
        applyFiltersAndRender();
      };
    });
  }

  // Filter and Sort Engine
  function applyFiltersAndRender() {
    if (!window.SVTStore) return;
    let products = window.SVTStore.getAllProducts();

    // Filter by Category
    if (currentCategory) {
      products = products.filter(p => p.categorySlug === currentCategory);
    }

    // Filter by Unit
    if (selectedUnits.length > 0) {
      products = products.filter(p => selectedUnits.includes(p.unit));
    }

    // Filter by In-Stock Only
    if (inStockOnly) {
      products = products.filter(p => p.stock > 0);
    }

    // Filter by Price
    if (minPrice !== null && !isNaN(minPrice)) {
      products = products.filter(p => p.price >= minPrice);
    }
    if (maxPrice !== null && !isNaN(maxPrice)) {
      products = products.filter(p => p.price <= maxPrice);
    }

    // Filter by Search Query
    if (searchQuery) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery) ||
        p.sku.toLowerCase().includes(searchQuery) ||
        p.material.toLowerCase().includes(searchQuery)
      );
    }

    // Sorting
    if (sortCriteria === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortCriteria === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortCriteria === 'newest') {
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sortCriteria === 'name-az') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default / featured
      products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    // Update Counts
    const count = products.length;
    if (matchCountEl) matchCountEl.textContent = count;
    if (mobileCountEl) mobileCountEl.textContent = `${count} items`;

    // Update Header Title
    if (catalogPageTitle) {
      const t = (k) => (window.SVTI18n ? window.SVTI18n.t(k) : k);
      if (currentCategory) {
        const catObj = (typeof SVT_CATEGORIES !== 'undefined') ? SVT_CATEGORIES.find(c => c.slug === currentCategory) : null;
        const localizedName = catObj ? (t(`cat.${catObj.slug}`) || catObj.name) : currentCategory;
        catalogPageTitle.textContent = localizedName;
      } else if (searchQuery) {
        catalogPageTitle.textContent = `Search results for "${searchQuery}"`;
      } else if (sortCriteria === 'newest') {
        catalogPageTitle.textContent = t('nav.newArrivals') || 'New Arrivals & Fresh Weaves';
      } else {
        catalogPageTitle.textContent = t('shop.title') || 'Textile Catalogue';
      }
    }

    // Render Active Filter Tags
    renderActiveFilterPills();

    // Render Grid or Empty State
    if (count === 0) {
      if (productsGrid) productsGrid.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
    } else {
      if (productsGrid) {
        productsGrid.style.display = 'grid';
        productsGrid.innerHTML = products.map(p => window.renderProductCardHTML(p)).join('');
      }
      if (emptyState) emptyState.style.display = 'none';
    }
  }

  function renderActiveFilterPills() {
    if (!activeFiltersEl) return;
    let pills = [];

    if (currentCategory) {
      const catObj = (typeof SVT_CATEGORIES !== 'undefined') ? SVT_CATEGORIES.find(c => c.slug === currentCategory) : null;
      const label = catObj ? catObj.name : currentCategory;
      pills.push(`
        <span class="active-filter-pill">
          Category: ${label}
          <button data-remove-filter="category" aria-label="Remove category filter">&times;</button>
        </span>
      `);
    }

    selectedUnits.forEach(u => {
      pills.push(`
        <span class="active-filter-pill">
          Unit: /${u}
          <button data-remove-unit="${u}" aria-label="Remove unit filter">&times;</button>
        </span>
      `);
    });

    if (minPrice !== null || maxPrice !== null) {
      const minText = minPrice !== null ? `₹${minPrice}` : '₹0';
      const maxText = maxPrice !== null ? `₹${maxPrice}` : 'Above';
      pills.push(`
        <span class="active-filter-pill">
          Price: ${minText} - ${maxText}
          <button data-remove-filter="price" aria-label="Remove price filter">&times;</button>
        </span>
      `);
    }

    if (inStockOnly) {
      pills.push(`
        <span class="active-filter-pill">
          In Stock Only
          <button data-remove-filter="instock" aria-label="Remove in-stock filter">&times;</button>
        </span>
      `);
    }

    if (searchQuery) {
      pills.push(`
        <span class="active-filter-pill">
          Search: "${searchQuery}"
          <button data-remove-filter="search" aria-label="Remove search filter">&times;</button>
        </span>
      `);
    }

    activeFiltersEl.innerHTML = pills.join('');

    // Attach pill removal clicks
    activeFiltersEl.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => {
        const type = btn.getAttribute('data-remove-filter');
        const unit = btn.getAttribute('data-remove-unit');
        if (type === 'category') {
          currentCategory = null;
          const radioAll = catFilterContainer ? catFilterContainer.querySelector('input[value=""]') : null;
          if (radioAll) radioAll.checked = true;
        } else if (unit) {
          selectedUnits = selectedUnits.filter(u => u !== unit);
          const checkbox = document.querySelector(`input[name="unitFilter"][value="${unit}"]`);
          if (checkbox) checkbox.checked = false;
        } else if (type === 'price') {
          minPrice = null;
          maxPrice = null;
          if (priceMinInput) priceMinInput.value = '';
          if (priceMaxInput) priceMaxInput.value = '';
        } else if (type === 'instock') {
          inStockOnly = false;
          if (inStockCheckbox) inStockCheckbox.checked = false;
        } else if (type === 'search') {
          searchQuery = null;
        }
        applyFiltersAndRender();
      };
    });
  }

  function resetAllFilters() {
    currentCategory = null;
    selectedUnits = [];
    minPrice = null;
    maxPrice = null;
    inStockOnly = false;
    searchQuery = null;
    sortCriteria = 'featured';

    if (sortSelect) sortSelect.value = 'featured';
    if (priceMinInput) priceMinInput.value = '';
    if (priceMaxInput) priceMaxInput.value = '';
    if (inStockCheckbox) inStockCheckbox.checked = false;

    document.querySelectorAll('input[name="unitFilter"]').forEach(cb => cb.checked = false);
    if (catFilterContainer) {
      const radioAll = catFilterContainer.querySelector('input[value=""]');
      if (radioAll) radioAll.checked = true;
    }

    applyFiltersAndRender();
  }

  document.addEventListener('DOMContentLoaded', () => {
    parseUrlParams();
    renderCategoryFilters();

    // Setup Unit filters
    const unitCheckboxes = document.querySelectorAll('input[name="unitFilter"]');
    unitCheckboxes.forEach(cb => {
      if (selectedUnits.includes(cb.value)) cb.checked = true;
      cb.onchange = () => {
        selectedUnits = Array.from(unitCheckboxes).filter(c => c.checked).map(c => c.value);
        applyFiltersAndRender();
      };
    });

    // Setup Price apply button & enter key
    const triggerPriceApply = () => {
      const minVal = parseFloat(priceMinInput.value);
      const maxVal = parseFloat(priceMaxInput.value);
      minPrice = !isNaN(minVal) ? minVal : null;
      maxPrice = !isNaN(maxVal) ? maxVal : null;
      applyFiltersAndRender();
    };

    if (btnApplyPrice) btnApplyPrice.onclick = triggerPriceApply;
    if (priceMinInput) {
      priceMinInput.onkeydown = (e) => { if (e.key === 'Enter') triggerPriceApply(); };
    }
    if (priceMaxInput) {
      priceMaxInput.onkeydown = (e) => { if (e.key === 'Enter') triggerPriceApply(); };
    }

    // In stock filter
    if (inStockCheckbox) {
      inStockCheckbox.onchange = () => {
        inStockOnly = inStockCheckbox.checked;
        applyFiltersAndRender();
      };
    }

    // Sort select
    if (sortSelect) {
      sortSelect.value = sortCriteria;
      sortSelect.onchange = () => {
        sortCriteria = sortSelect.value;
        applyFiltersAndRender();
      };
    }

    // Clear all filters
    if (btnClearAll) btnClearAll.onclick = resetAllFilters;
    if (btnResetEmpty) btnResetEmpty.onclick = resetAllFilters;

    // Mobile filter drawer toggle
    if (mobileFilterBtn && filterSidebar) {
      mobileFilterBtn.onclick = () => {
        if (filterSidebar.style.display === 'block') {
          filterSidebar.style.display = 'none';
        } else {
          filterSidebar.style.display = 'block';
          filterSidebar.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }

    // Listen for store updates (e.g. stock updates from admin or cart actions)
    window.addEventListener('svt_store_update', () => {
      applyFiltersAndRender();
    });

    // Listen for language changes to update categories, titles & product cards
    window.addEventListener('svt_lang_change', () => {
      renderCategoryFilters();
      applyFiltersAndRender();
    });

    applyFiltersAndRender();
  });
})();
