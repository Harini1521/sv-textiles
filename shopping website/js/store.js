/* ==========================================================================
   SV TEXTILES — Central Store & State Management
   Provides reactive client-side persistence for Cart, Wishlist,
   Catalog Inventory, Orders, Wholesale Enquiries, and Authentication.
   Operates in Interactive Demo Mode (localStorage) or connects to Firestore.
   ========================================================================== */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    PRODUCTS: 'svt_products_v1',
    CART: 'svt_cart_v1',
    WISHLIST: 'svt_wishlist_v1',
    ORDERS: 'svt_orders_v1',
    ENQUIRIES: 'svt_enquiries_v1',
    USER: 'svt_current_user_v1',
    RECENTLY_VIEWED: 'svt_recent_v1'
  };

  // Pre-configured coupons
  const VALID_COUPONS = {
    'SVTFIRST10': { type: 'percent', value: 10, minOrder: 1000, description: '10% off on orders above ₹1,000' },
    'TRADITION20': { type: 'percent', value: 20, minOrder: 5000, description: '20% off on orders above ₹5,000' },
    'FREESHIP': { type: 'shipping', value: 100, minOrder: 500, description: 'Free Standard Delivery' }
  };

  const SHIPPING_CONFIG = {
    FREE_THRESHOLD: 1999, // Free delivery above ₹1,999
    STANDARD_FEE: 99
  };

  const SVTStore = {
    // ----------------- Products & Inventory -----------------
    initProducts() {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SVT_INITIAL_PRODUCTS));
        return SVT_INITIAL_PRODUCTS;
      }
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse products, re-initializing', e);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SVT_INITIAL_PRODUCTS));
        return SVT_INITIAL_PRODUCTS;
      }
    },

    getAllProducts() {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!stored) return this.initProducts();
      try {
        return JSON.parse(stored);
      } catch (e) {
        return SVT_INITIAL_PRODUCTS;
      }
    },

    getProductById(id) {
      const products = this.getAllProducts();
      let product = products.find(p => p.id === id || p.sku === id) || null;
      if (product && typeof SVT_INITIAL_PRODUCTS !== 'undefined') {
        const initProd = SVT_INITIAL_PRODUCTS.find(p => p.id === product.id);
        if (initProd && initProd.images && (!product.images || product.images.length < initProd.images.length)) {
          product.images = initProd.images;
        }
      }
      return product;
    },

    saveProduct(productData) {
      const products = this.getAllProducts();
      if (productData.id) {
        // Update existing
        const index = products.findIndex(p => p.id === productData.id);
        if (index !== -1) {
          products[index] = { ...products[index], ...productData };
        } else {
          products.unshift(productData);
        }
      } else {
        // Create new
        const newProduct = {
          ...productData,
          id: 'svt-p-' + Date.now().toString(36),
          sku: productData.sku || 'SVT-' + Math.floor(1000 + Math.random() * 9000),
          rating: 5.0,
          reviewsCount: 1,
          isNew: true
        };
        products.unshift(newProduct);
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.dispatchChange('products');
      return true;
    },

    deleteProduct(id) {
      let products = this.getAllProducts();
      products = products.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.dispatchChange('products');
      return true;
    },

    updateStock(productId, newStock) {
      const products = this.getAllProducts();
      const product = products.find(p => p.id === productId);
      if (product) {
        product.stock = Math.max(0, parseInt(newStock, 10));
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
        this.dispatchChange('products');
        return true;
      }
      return false;
    },

    resetProducts() {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SVT_INITIAL_PRODUCTS));
      this.dispatchChange('products');
    },

    // ----------------- Shopping Cart -----------------
    getCart() {
      try {
        const cart = localStorage.getItem(STORAGE_KEYS.CART);
        return cart ? JSON.parse(cart) : [];
      } catch (e) {
        return [];
      }
    },

    saveCart(cart) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      this.dispatchChange('cart');
    },

    addToCart(productId, quantity, colour, size) {
      quantity = parseInt(quantity, 10) || 1;
      const product = this.getProductById(productId);
      if (!product) return { success: false, message: 'Product not found.' };

      if (product.stock <= 0) {
        return { success: false, message: 'Sorry, this product is currently out of stock.' };
      }

      // Default variant selections if not provided
      if (!colour && product.colours && product.colours.length > 0) {
        colour = product.colours[0].name;
      }
      if (!size && product.sizes && product.sizes.length > 0) {
        size = product.sizes[0];
      }

      const cart = this.getCart();
      const cartItemId = `${productId}__${colour || 'default'}__${size || 'default'}`;

      const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);

      if (existingIndex > -1) {
        const newQty = cart[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          return {
            success: false,
            message: `Cannot add more. Only ${product.stock} ${product.unit}(s) available in stock.`
          };
        }
        cart[existingIndex].quantity = newQty;
      } else {
        if (quantity > product.stock) {
          return {
            success: false,
            message: `Only ${product.stock} ${product.unit}(s) available in stock.`
          };
        }
        cart.push({
          cartItemId,
          productId: product.id,
          sku: product.sku,
          name: product.name,
          category: product.category,
          price: product.price,
          unit: product.unit,
          quantity: quantity,
          colour: colour || null,
          size: size || null,
          image: product.images[0] || '',
          stockAvailable: product.stock
        });
      }

      this.saveCart(cart);
      return { success: true, message: `Added "${product.name}" to shopping bag!`, cartCount: this.getCartCount() };
    },

    updateCartQuantity(cartItemId, newQuantity) {
      const cart = this.getCart();
      const item = cart.find(i => i.cartItemId === cartItemId);
      if (!item) return false;

      newQuantity = parseInt(newQuantity, 10);
      if (newQuantity <= 0) {
        return this.removeFromCart(cartItemId);
      }

      // Validate stock
      const product = this.getProductById(item.productId);
      if (product && newQuantity > product.stock) {
        alert(`Cannot exceed available stock of ${product.stock} ${item.unit}(s).`);
        item.quantity = product.stock;
      } else {
        item.quantity = newQuantity;
      }

      this.saveCart(cart);
      return true;
    },

    removeFromCart(cartItemId) {
      let cart = this.getCart();
      cart = cart.filter(item => item.cartItemId !== cartItemId);
      this.saveCart(cart);
      return true;
    },

    clearCart() {
      this.saveCart([]);
    },

    getCartCount() {
      const cart = this.getCart();
      return cart.reduce((total, item) => total + item.quantity, 0);
    },

    getCartTotals(couponCode) {
      const cart = this.getCart();
      let subtotal = 0;

      cart.forEach(item => {
        subtotal += item.price * item.quantity;
      });

      let discount = 0;
      let appliedCoupon = null;

      if (couponCode && typeof couponCode === 'string') {
        const cleanCode = couponCode.trim().toUpperCase();
        const promo = VALID_COUPONS[cleanCode];
        if (promo) {
          if (subtotal >= promo.minOrder) {
            appliedCoupon = { code: cleanCode, ...promo };
            if (promo.type === 'percent') {
              discount = Math.round((subtotal * promo.value) / 100);
            }
          }
        }
      }

      let shipping = 0;
      if (subtotal > 0) {
        if (appliedCoupon && appliedCoupon.type === 'shipping') {
          shipping = 0;
        } else if (subtotal >= SHIPPING_CONFIG.FREE_THRESHOLD) {
          shipping = 0;
        } else {
          shipping = SHIPPING_CONFIG.STANDARD_FEE;
        }
      }

      const total = Math.max(0, subtotal - discount + shipping);

      return {
        subtotal,
        discount,
        shipping,
        total,
        appliedCoupon,
        freeShippingThreshold: SHIPPING_CONFIG.FREE_THRESHOLD,
        amountNeededForFreeShipping: Math.max(0, SHIPPING_CONFIG.FREE_THRESHOLD - subtotal)
      };
    },

    // ----------------- Wishlist -----------------
    getWishlist() {
      try {
        const list = localStorage.getItem(STORAGE_KEYS.WISHLIST);
        return list ? JSON.parse(list) : [];
      } catch (e) {
        return [];
      }
    },

    isInWishlist(productId) {
      const list = this.getWishlist();
      return list.includes(productId);
    },

    toggleWishlist(productId) {
      let list = this.getWishlist();
      const index = list.indexOf(productId);
      let added = false;
      if (index > -1) {
        list.splice(index, 1);
        added = false;
      } else {
        list.push(productId);
        added = true;
      }
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(list));
      this.dispatchChange('wishlist');
      return { added, count: list.length };
    },

    // ----------------- Orders & Stock Deduction -----------------
    getAllOrders() {
      try {
        const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);
        return orders ? JSON.parse(orders) : [];
      } catch (e) {
        return [];
      }
    },

    getOrderById(orderReference) {
      const orders = this.getAllOrders();
      return orders.find(o => o.orderReference === orderReference || o.id === orderReference) || null;
    },

    createOrder(orderData) {
      /* Authoritative validation & stock check */
      const cart = this.getCart();
      if (!cart || cart.length === 0) {
        return { success: false, message: 'Shopping bag is empty.' };
      }

      // Re-verify current live stock for each item
      const products = this.getAllProducts();
      for (const item of cart) {
        const liveProd = products.find(p => p.id === item.productId);
        if (!liveProd) {
          return { success: false, message: `Product "${item.name}" is no longer in catalogue.` };
        }
        if (liveProd.stock < item.quantity) {
          return {
            success: false,
            message: `Insufficient stock for "${liveProd.name}". Available: ${liveProd.stock} ${liveProd.unit}(s).`
          };
        }
      }

      // Compute authoritative order totals
      const totals = this.getCartTotals(orderData.couponCode);

      // Unique reference: e.g. SVT-2026-94821
      const randomFive = Math.floor(10000 + Math.random() * 90000);
      const year = new Date().getFullYear();
      const orderReference = `SVT-${year}-${randomFive}`;

      const newOrder = {
        id: 'ord_' + Date.now().toString(36),
        orderReference: orderReference,
        createdAt: new Date().toISOString(),
        customer: {
          fullName: orderData.customer.fullName,
          email: orderData.customer.email,
          mobile: orderData.customer.mobile,
          address: orderData.customer.address,
          city: orderData.customer.city,
          state: orderData.customer.state,
          pincode: orderData.customer.pincode,
          orderNotes: orderData.customer.orderNotes || ''
        },
        items: cart.map(item => ({
          productId: item.productId,
          sku: item.sku,
          name: item.name,
          category: item.category,
          priceSnapshot: item.price,
          unit: item.unit,
          quantity: item.quantity,
          colour: item.colour,
          size: item.size,
          itemSubtotal: item.price * item.quantity,
          image: item.image
        })),
        pricing: {
          subtotal: totals.subtotal,
          discount: totals.discount,
          shipping: totals.shipping,
          finalTotal: totals.total,
          couponCode: totals.appliedCoupon ? totals.appliedCoupon.code : null
        },
        paymentMethod: orderData.paymentMethod, // 'cod' or 'online'
        paymentStatus: orderData.paymentMethod === 'cod' ? 'Pending (Cash on Delivery)' : 'Verification Pending (Demo Gateway)',
        orderStatus: 'Confirmed', // Confirmed, Processing, Shipped, Delivered, Cancelled
        isDemoOrder: window.SVT_DEMO_MODE
      };

      // Deduct inventory
      cart.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      });
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

      // Save order
      const orders = this.getAllOrders();
      orders.unshift(newOrder);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

      // Empty shopping cart
      this.clearCart();
      this.dispatchChange('products');
      this.dispatchChange('orders');

      return {
        success: true,
        order: newOrder,
        message: 'Order created successfully!'
      };
    },

    updateOrderStatus(orderReference, newStatus) {
      const orders = this.getAllOrders();
      const order = orders.find(o => o.orderReference === orderReference || o.id === orderReference);
      if (order) {
        order.orderStatus = newStatus;
        if (newStatus === 'Delivered' && order.paymentMethod === 'cod') {
          order.paymentStatus = 'Paid (Collected on Delivery)';
        }
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        this.dispatchChange('orders');
        return true;
      }
      return false;
    },

    // ----------------- Wholesale Enquiries -----------------
    submitWholesaleEnquiry(enquiry) {
      const enquiries = this.getAllWholesaleEnquiries();
      const newEnquiry = {
        id: 'ws_' + Date.now().toString(36),
        submittedAt: new Date().toISOString(),
        referenceNo: 'WSE-' + Math.floor(10000 + Math.random() * 90000),
        status: 'New Lead',
        ...enquiry
      };
      enquiries.unshift(newEnquiry);
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
      return { success: true, referenceNo: newEnquiry.referenceNo };
    },

    getAllWholesaleEnquiries() {
      try {
        const list = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
        return list ? JSON.parse(list) : [];
      } catch (e) {
        return [];
      }
    },

    // ----------------- User & Authentication -----------------
    getCurrentUser() {
      try {
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
      } catch (e) {
        return null;
      }
    },

    setCurrentUser(user) {
      if (!user) {
        localStorage.removeItem(STORAGE_KEYS.USER);
      } else {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
      this.dispatchChange('auth');
    },

    loginCustomer(email, password) {
      // Demo authentication simulation
      const user = {
        uid: 'usr_' + Date.now().toString(36),
        email: email,
        displayName: email.split('@')[0],
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      this.setCurrentUser(user);
      return { success: true, user };
    },

    loginAdmin(passcode) {
      // Admin authentication
      // In demo mode, admin passcode is 'svtadmin2026' or demo button
      if (passcode === 'svtadmin2026' || passcode === 'admin123') {
        const adminUser = {
          uid: 'admin_master',
          email: 'admin@svtextiles.com',
          displayName: 'SV Textiles Administrator',
          role: 'admin',
          isAdmin: true
        };
        sessionStorage.setItem('svt_admin_auth', JSON.stringify(adminUser));
        return { success: true, admin: adminUser };
      }
      return { success: false, message: 'Invalid Admin Authorization Passcode.' };
    },

    isAdminAuthenticated() {
      try {
        const auth = sessionStorage.getItem('svt_admin_auth');
        return !!auth;
      } catch (e) {
        return false;
      }
    },

    logoutAdmin() {
      sessionStorage.removeItem('svt_admin_auth');
    },

    logout() {
      this.setCurrentUser(null);
      this.logoutAdmin();
    },

    // ----------------- Event Dispatcher -----------------
    dispatchChange(type) {
      window.dispatchEvent(new CustomEvent('svt_store_update', { detail: { type } }));
    }
  };

  // Auto-init products if first time
  SVTStore.initProducts();

  window.SVTStore = SVTStore;
})(window);
